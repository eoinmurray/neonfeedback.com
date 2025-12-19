import numpy as np
import matplotlib.pyplot as plt
from ising import simulate_ising

# Parameters
L = 10  # Lattice size (LxL)
temps = np.linspace(1.0, 5.0, 25)  # Temperature range
n_steps = 200  # Monte Carlo steps per temperature

def simulate_magnetization(L, temps, n_steps):
    """Simulate magnetization across temperature range."""
    mag = []
    for T in temps:
        # Run simulation with measurement of observables
        _, avg_M, _, _ = simulate_ising(
            T=T, 
            N=L, 
            mc_steps=n_steps, 
            equil_steps=1000, 
            compute_observables=True
        )
        mag.append(avg_M)
    return mag

# Run simulation
magnetizations = simulate_magnetization(L, temps, n_steps)

# Plot results
plt.figure(figsize=(8, 6))
plt.plot(temps, magnetizations, marker='o', color='green')
plt.xlabel("Temperature (T)")
plt.ylabel("Magnetization (M)")
plt.title("Magnetization vs Temperature (Ising Model with Glauber Dynamics)")
plt.grid(True)
plt.tight_layout()

plt.savefig("images/magnetization-2.png", dpi=300)
plt.show()