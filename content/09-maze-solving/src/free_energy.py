import numpy as np
import matplotlib.pyplot as plt
from matplotlib.animation import FuncAnimation, PillowWriter
import random
import math
import torch
from maze import PrimsMaze, TerrainGenerator
import string

def create_prior_preferences(grid, goal, goal_preference=200.0):
    gx, gy = goal
    height, width = grid.shape
    prefs = torch.zeros(height, width, dtype=torch.float)
    for x in range(height):
        for y in range(width):
            dist = math.sqrt((x - gx)**2 + (y - gy)**2)
            prefs[x, y] = goal_preference / (dist + 1)
    prefs[goal] = goal_preference
    return prefs

class FreeEnergyAgent:
    def __init__(self, grid, start, goal):
        self.grid = grid
        self.start = start
        self.goal = goal
        self.height, self.width = grid.shape

        # Key params
        self.gamma = 20.0
        self.goal_preference = 200.0
        self.visit_penalty = 100.0
        self.actions = [(-1, 0), (0, 1), (1, 0), (0, -1)]

        # Beliefs: -1 = unknown, 0 = blocked, 1 = free
        self.belief = torch.full((self.height, self.width), -1.0)
        self.prior_preferences = create_prior_preferences(grid, goal, self.goal_preference)
        self.full_path_history = []
        self.visit_counts = np.zeros_like(grid, dtype=float)
        self._initialize_belief(start)

    def _initialize_belief(self, pos):
        x, y = pos
        self._observe((x, y))

    def _observe(self, pos):
        x, y = pos
        self.belief[x, y] = 0.0 if self.grid[x, y] == 1 else 1.0

        for dx, dy in self.actions:
            nx, ny = x + dx, y + dy
            if 0 <= nx < self.height and 0 <= ny < self.width:
                if self.belief[nx, ny] < 0:  # only update if unknown
                    self.belief[nx, ny] = 0.0 if self.grid[nx, ny] == 1 else 1.0

    def find_path(self, max_steps=500):
        current = self.start
        path = [current]
        steps = 0

        while current != self.goal and steps < max_steps:
            next_pos = self._choose_action(current)
            path.append(next_pos)
            self.full_path_history.append(next_pos)

            self.visit_counts[next_pos] += 1.0
            self.visit_counts *= 0.99

            current = next_pos
            self._observe(current)
            steps += 1

        return np.array(path)

    def _expected_free_energy(self, next_pos):
        preference = self.prior_preferences[next_pos[0], next_pos[1]].item()
        repeat_penalty = self.visit_penalty * self.visit_counts[next_pos]
        return repeat_penalty - preference

    def _choose_action(self, current):
        candidates = []
        for dx, dy in self.actions:
            nx, ny = current[0] + dx, current[1] + dy
            if 0 <= nx < self.height and 0 <= ny < self.width:
                if self.belief[nx, ny] == 1.0:  # known free
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

class Visualizer:
    def __init__(self, agent: FreeEnergyAgent):
        self.agent = agent
        self.fig, self.ax_true = plt.subplots(figsize=(6, 6))
        self.path_artists_true = []
        self._setup_plots()

    def _setup_plots(self):
        self.fig.suptitle('Pathfinding with Free Energy Principle')
        self.ax_true.set_title('True Maze')
        self.grid_im_true = self.ax_true.imshow(self.agent.grid, cmap='gray_r')
        self.ax_true.set_xticks([])
        self.ax_true.set_yticks([])

    def update_frame(self, frame_num):
        for artist in self.path_artists_true:
            artist.remove()
        self.path_artists_true.clear()

        if frame_num < len(self.agent.full_path_history):
            full_path = self.agent.full_path_history[:frame_num+1]
            path_x, path_y = zip(*full_path)

            line_true, = self.ax_true.plot(path_y, path_x, 'r.-', linewidth=1, markersize=5)
            self.path_artists_true.append(line_true)
            current_marker_true, = self.ax_true.plot(path_y[-1], path_x[-1], 'go', markersize=12)
            self.path_artists_true.append(current_marker_true)
            start_true, = self.ax_true.plot(self.agent.start[1], self.agent.start[0], 'b*', markersize=12)
            goal_true, = self.ax_true.plot(self.agent.goal[1], self.agent.goal[0], 'r*', markersize=12)
            self.path_artists_true.extend([start_true, goal_true])

        return [self.grid_im_true] + self.path_artists_true

    def animate_path(self, save_gif=False):
        anim = FuncAnimation(
            self.fig,
            self.update_frame,
            frames=len(self.agent.full_path_history),
            interval=50,
            blit=True,
            repeat=False
        )
        if save_gif:
            print("Saving animation...")
            writer = PillowWriter(fps=20)
            
            random_string = ''.join(random.choices(string.ascii_letters + string.digits, k=10))
            
            gif_filename = f"gifs/anim-{random_string}.gif"
            
            anim.save(gif_filename, writer=writer)
            print(f"Animation saved as {gif_filename}")
        # plt.show()

def main():
    size = 21
    random_integer = random.randint(0, 10000)
    grid = np.zeros((size, size), dtype=int)
    maze_gen = PrimsMaze(size, seed=random_integer)
    # maze_gen = TerrainGenerator(size, seed=random_integer, obstacle_density=0.3)
    grid = maze_gen.generate()

    agent = FreeEnergyAgent(grid, start=(1, 1), goal=(size-2, size-2))
    path = agent.find_path(max_steps=500)

    viz = Visualizer(agent)
    viz.animate_path(save_gif=True)

if __name__ == "__main__":
    main()
