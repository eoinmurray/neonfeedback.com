import numpy as np
import numba

@numba.njit
def glauber_step(grid, T, steps_per_update=None, N=None):
    """
    Performs Glauber dynamics updates over a lattice.
    
    Parameters:
    -----------
    grid : 2D numpy array
        The spin configuration matrix (values should be +1 or -1)
    T : float
        Temperature
    steps_per_update : int, optional
        Number of spin update attempts (defaults to N*N)
    N : int, optional
        Grid dimension (inferred from grid if not provided)
        
    Returns:
    --------
    grid : 2D numpy array
        Updated spin configuration
    """
    if N is None:
        N = grid.shape[0]
    
    if steps_per_update is None:
        steps_per_update = N * N
        
    for _ in range(steps_per_update):
        # Choose a random spin
        i = np.random.randint(0, N)
        j = np.random.randint(0, N)
        s = grid[i, j]
        
        # Compute sum of nearest neighbors with periodic boundaries
        nb = (grid[(i+1) % N, j] + grid[i, (j+1) % N] +
              grid[(i-1) % N, j] + grid[i, (j-1) % N])
        
        # Energy change if spin is flipped
        dE = 2 * s * nb
        
        # Glauber flip probability
        p_flip = 1.0 / (1.0 + np.exp(dE / T))
        
        if np.random.rand() < p_flip:
            grid[i, j] = -s
            
    return grid

@numba.njit
def compute_energy(grid, N=None):
    """
    Compute the total energy of the Ising model configuration.
    
    Parameters:
    -----------
    grid : 2D numpy array
        The spin configuration matrix
    N : int, optional
        Grid dimension (inferred from grid if not provided)
        
    Returns:
    --------
    energy : float
        Total energy of the configuration
    """
    if N is None:
        N = grid.shape[0]
        
    energy = 0.0
    for i in range(N):
        for j in range(N):
            energy -= grid[i, j] * (grid[(i+1) % N, j] + grid[i, (j+1) % N])
    return energy

def initial_state(N):
    """
    Create a random initial spin configuration.
    
    Parameters:
    -----------
    N : int
        Grid dimension (N x N)
        
    Returns:
    --------
    grid : 2D numpy array
        Random spin configuration with values +1 or -1
    """
    return np.random.choice([-1, 1], size=(N, N))

def simulate_ising(T, N=100, mc_steps=10000, equil_steps=5000, compute_observables=False):
    """
    Run a full Ising model simulation at a given temperature.
    
    Parameters:
    -----------
    T : float
        Temperature
    N : int
        Grid dimension (N x N)
    mc_steps : int
        Number of Monte Carlo steps for measurement
    equil_steps : int
        Number of equilibration steps before measurement
    compute_observables : bool
        Whether to compute and return physical observables
        
    Returns:
    --------
    If compute_observables is True:
        (grid, avg_M, chi, C) : tuple
            - grid: Final spin configuration
            - avg_M: Average absolute magnetization
            - chi: Magnetic susceptibility
            - C: Specific heat
    Else:
        grid : 2D numpy array
            Final spin configuration
    """
    # Initialize grid randomly
    grid = initial_state(N)
    
    # Equilibration phase
    for _ in range(equil_steps):
        grid = glauber_step(grid, T, N*N, N)
    
    if not compute_observables:
        return grid
    
    # Sampling phase
    magnetizations = []
    energies = []
    
    for _ in range(mc_steps):
        grid = glauber_step(grid, T, N*N, N)
        M = np.sum(grid)
        E = compute_energy(grid, N)
        magnetizations.append(M)
        energies.append(E)
    
    magnetizations = np.array(magnetizations)
    energies = np.array(energies)
    
    # Calculate observables
    avg_M = np.mean(np.abs(magnetizations)) / (N*N)  # Absolute magnetization per spin
    avg_M2 = np.mean(magnetizations**2) / (N*N)**2
    chi = (avg_M2 - avg_M**2) * (N*N) / T  # Susceptibility
    
    avg_E = np.mean(energies) / (N*N)  # Energy per spin
    avg_E2 = np.mean(energies**2) / (N*N)**2
    C = (avg_E2 - avg_E**2) * (N*N) / (T**2)  # Specific heat per spin
    
    return grid, avg_M, chi, C