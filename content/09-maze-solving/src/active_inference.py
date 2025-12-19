# active-inference.py
import numpy as np
import matplotlib.pyplot as plt
from matplotlib.animation import FuncAnimation
import torch
import torch.nn as nn
import torch.optim as optim
import random
import math
from maze import TerrainGenerator, PrimsMaze

device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')

class TinyGenerativeModel(nn.Module):
    """
    Predict if a cell is free or a wall, plus a small transition prior.
    We'll still do a partial Bayesian update outside this network.
    """
    def __init__(self, state_dim=2, hidden_dim=32):
        super().__init__()
        self.obs_network = nn.Sequential(
            nn.Linear(state_dim, hidden_dim),
            nn.ReLU(),
            nn.Linear(hidden_dim, hidden_dim),
            nn.ReLU(),
            nn.Linear(hidden_dim, 1),
            nn.Sigmoid()
        )
        self.trans_network = nn.Sequential(
            nn.Linear(state_dim, hidden_dim),
            nn.ReLU(),
            nn.Linear(hidden_dim, hidden_dim),
            nn.ReLU(),
            nn.Linear(hidden_dim, state_dim)
        )

    def forward(self, state):
        obs_prob = self.obs_network(state)
        trans_pred = self.trans_network(state)
        return obs_prob, trans_pred

class ActiveInferenceAgent:
    """
    A canonical approach using Bayesian updates for beliefs
    and single-step expected free energy for action selection.
    """
    def __init__(self, grid, start, goal):
        self.grid = grid
        self.start = start
        self.goal = goal
        self.height, self.width = grid.shape

        # Hyperparameters
        self.alpha = 0.5    # weighting for risk
        self.beta = 0.5     # weighting for ambiguity
        self.gamma = 20.0   # action-selection sharpness
        self.goal_preference = 200.0
        self.visit_penalty = 1.0

        # Create prior preferences: closer to goal = higher reward
        self.prior_preferences = self._create_prior_preferences()

        # Initialize beliefs
        self.beliefs = np.ones_like(grid, dtype=float)
        self.beliefs[self.start] *= 5.0
        self.beliefs[self.goal] *= 5.0
        self.beliefs /= np.sum(self.beliefs)

        # Track path, visits, etc.
        self.actions = [(-1, 0), (0, 1), (1, 0), (0, -1)]
        self.belief_history = []
        self.full_path_history = []
        self.visit_counts = np.zeros_like(grid, dtype=float)

        # PyTorch model
        self.model = TinyGenerativeModel().to(device)
        self.optimizer = optim.Adam(self.model.parameters(), lr=1e-3)

    def find_path(self, max_steps=500):
        current = self.start
        path = [current]
        steps = 0

        while current != self.goal and steps < max_steps:
            self._bayesian_update(current)
            self._transition_update(current)
            next_pos = self._choose_action(current)

            path.append(next_pos)
            self.full_path_history.append(next_pos)
            self.belief_history.append(self.beliefs.copy())

            # Decay, track visits, move
            self.visit_counts[next_pos] += 1.0
            self.visit_counts *= 0.99
            current = next_pos
            steps += 1

            # Update model with the new observation
            self._update_model(next_pos)

        return np.array(path)

    def _create_prior_preferences(self):
        prefs = np.zeros_like(self.grid, dtype=float)
        gx, gy = self.goal
        for x in range(self.height):
            for y in range(self.width):
                dist = math.sqrt((x - gx)**2 + (y - gy)**2)
                prefs[x, y] = self.goal_preference / (dist + 1)
        prefs[self.goal] = self.goal_preference
        return prefs

    def _bayesian_update(self, pos):
        """
        Update belief distribution q(s_t) given local observation:
        We only update around 'pos' to simulate local sensing.
        """
        new_beliefs = self.beliefs.copy()
        sensing_radius = 2
        x_min = max(0, pos[0] - sensing_radius)
        x_max = min(self.height, pos[0] + sensing_radius + 1)
        y_min = max(0, pos[1] - sensing_radius)
        y_max = min(self.width, pos[1] + sensing_radius + 1)

        with torch.no_grad():
            is_free = (self.grid[pos] == 0)
            xs = torch.arange(x_min, x_max, device=device, dtype=torch.float32)
            ys = torch.arange(y_min, y_max, device=device, dtype=torch.float32)
            grid_x, grid_y = torch.meshgrid(xs, ys, indexing='ij')
            states = torch.stack([grid_x.flatten(), grid_y.flatten()], dim=-1)
            obs_probs, _ = self.model(states)
            obs_probs = obs_probs.view(grid_x.shape)

            # If we see free, likelihood=obs_prob; else=1-obs_prob
            likelihood = obs_probs if is_free else (1.0 - obs_probs)
            likelihood_np = likelihood.cpu().numpy() + 1e-6
            new_beliefs[x_min:x_max, y_min:y_max] *= likelihood_np

        new_beliefs /= (np.sum(new_beliefs) + 1e-12)
        self.beliefs = new_beliefs

    def _transition_update(self, pos):
        """
        Diffuse beliefs around current position.
        """
        transition_radius = 1
        x_min, x_max = max(0, pos[0] - transition_radius), min(self.height, pos[0] + transition_radius + 1)
        y_min, y_max = max(0, pos[1] - transition_radius), min(self.width, pos[1] + transition_radius + 1)
        local_beliefs = self.beliefs[x_min:x_max, y_min:y_max].copy()
        new_local_beliefs = np.zeros_like(local_beliefs)

        for x in range(x_min, x_max):
            for y in range(y_min, y_max):
                if self.beliefs[x, y] > 0:
                    neighbors = []
                    for dx, dy in self.actions:
                        nx, ny = x + dx, y + dy
                        if (x_min <= nx < x_max and
                            y_min <= ny < y_max and
                            self.grid[nx, ny] == 0):
                            neighbors.append((nx, ny))
                    if neighbors:
                        share = self.beliefs[x, y] / len(neighbors)
                        for (nx, ny) in neighbors:
                            new_local_beliefs[nx - x_min, ny - y_min] += share
                    else:
                        new_local_beliefs[x - x_min, y - y_min] += self.beliefs[x, y]

        total_local = np.sum(new_local_beliefs) + 1e-12
        new_local_beliefs /= total_local

        updated_beliefs = self.beliefs.copy()
        updated_beliefs[x_min:x_max, y_min:y_max] = new_local_beliefs
        self.beliefs = updated_beliefs

    def _expected_free_energy(self, next_pos):
        """
        Single-step lookahead.
        """
        next_x, next_y = next_pos
        with torch.no_grad():
            st = torch.tensor([next_x, next_y], dtype=torch.float32, device=device)
            obs_prob, _ = self.model(st)
            obs_free_prob = obs_prob.item()

        # Risk: negative log-likelihood if free, else for not-free
        is_free = (self.grid[next_pos] == 0)
        risk = -math.log(obs_free_prob + 1e-12) if is_free else -math.log((1 - obs_free_prob) + 1e-12)

        # Ambiguity: measure how uncertain
        ambiguity = -(obs_free_prob * math.log(obs_free_prob + 1e-12) +
                      (1 - obs_free_prob) * math.log((1 - obs_free_prob) + 1e-12))

        # Preference from being near goal
        preference = self.prior_preferences[next_pos]

        # Visit penalty
        repeat_penalty = self.visit_penalty * self.visit_counts[next_pos]

        return self.alpha * risk + self.beta * ambiguity + repeat_penalty - preference

    def _choose_action(self, current):
        candidates = []
        for dx, dy in self.actions:
            nx, ny = current[0] + dx, current[1] + dy
            if 0 <= nx < self.height and 0 <= ny < self.width and self.grid[nx, ny] != 1:
                efe = self._expected_free_energy((nx, ny))
                candidates.append((efe, (nx, ny)))

        if not candidates:
            return current

        efe_values = [c[0] for c in candidates]
        min_efe = min(efe_values)
        shifted = [v - min_efe for v in efe_values]
        expvals = [math.exp(-self.gamma * s) for s in shifted]
        total = sum(expvals)
        probs = [v / total for v in expvals]

        r = random.random()
        cumsum = 0.0
        for i, p in enumerate(probs):
            cumsum += p
            if r < cumsum:
                return candidates[i][1]
        return candidates[-1][1]

    def _update_model(self, pos):
        """
        Train the generative model at position 'pos'.
        """
        self.optimizer.zero_grad()
        x, y = pos
        st = torch.tensor([x, y], dtype=torch.float32, device=device)
        obs_prob, _ = self.model(st)
        label = torch.tensor([1.0 if self.grid[pos] == 0 else 0.0], dtype=torch.float32, device=device)
        neg_ll = - (label * torch.log(obs_prob + 1e-12) + (1 - label) * torch.log(1 - obs_prob + 1e-12))

        reg = sum(torch.sum(p**2) for p in self.model.parameters()) * 1e-5
        loss = neg_ll + reg
        loss.backward()
        self.optimizer.step()

class Visualizer:
    def __init__(self, agent: ActiveInferenceAgent):
        self.agent = agent
        self.fig, (self.ax1, self.ax2) = plt.subplots(1, 2, figsize=(12, 5))
        self.path_artists = []
        self.setup_plots()

    def setup_plots(self):
        self.fig.suptitle('Active Inference Pathfinding (More Canonical)')
        self.ax1.set_title('Environment & Path')
        self.grid_im = self.ax1.imshow(self.agent.grid, cmap='gray_r')
        self.ax1.set_xticks([])
        self.ax1.set_yticks([])

        self.ax2.set_title('Belief States')
        self.belief_im = self.ax2.imshow(self.agent.beliefs, cmap='viridis', vmin=0, vmax=1)
        self.fig.colorbar(self.belief_im, ax=self.ax2)

    def update_frame(self, frame_num):
        while self.path_artists:
            artist = self.path_artists.pop()
            artist.remove()

        if frame_num < len(self.agent.belief_history):
            data = self.agent.belief_history[frame_num]
            self.belief_im.set_array(data)
            self.belief_im.set_clim(vmin=data.min(), vmax=data.max())

        if 0 < frame_num <= len(self.agent.full_path_history):
            full_path = self.agent.full_path_history[:frame_num+1]
            path_x, path_y = zip(*full_path)
            for ax in [self.ax1, self.ax2]:
                line_plot, = ax.plot(path_y, path_x, 'r.-', linewidth=1, markersize=5)
                self.path_artists.append(line_plot)
                point, = ax.plot(path_y[-1], path_x[-1], 'go', markersize=12)
                self.path_artists.append(point)
                start, = ax.plot(self.agent.start[1], self.agent.start[0], 'b*', markersize=12)
                goal, = ax.plot(self.agent.goal[1], self.agent.goal[0], 'r*', markersize=12)
                self.path_artists.extend([start, goal])

        return [self.grid_im, self.belief_im] + self.path_artists

    def animate_path(self):
        anim = FuncAnimation(
            self.fig,
            self.update_frame,
            frames=len(self.agent.full_path_history) + 1,
            interval=50,
            blit=True,
            repeat=False
        )
        plt.show()

def main():
    size = 21
    # seed = 12123
    
    # random.seed(seed)
    # np.random.seed(seed)
    # torch.manual_seed(seed)

    random_integer = random.randint(0, 10000)
    print(f"Random integer: {random_integer}")

    # Maze generation
    grid = np.zeros((size, size), dtype=int)
    maze_gen = PrimsMaze(size, seed=random_integer)
    # maze_gen = TerrainGenerator(size, seed=random_integer, obstacle_density=0.2)
    
    grid = maze_gen.generate()

    agent = ActiveInferenceAgent(grid, start=(1, 1), goal=(size-2, size-2))
    path = agent.find_path(max_steps=500)
    print(path.shape)

    viz = Visualizer(agent)
    viz.animate_path()

if __name__ == "__main__":
    main()
