import numpy as np
import matplotlib.pyplot as plt
from ising import simulate_ising

# Define temperature range to simulate
temps = np.linspace(1.0, 3.5, 10)
N = 100  # Lattice size (N x N)
mc_steps = 100000
equil_steps = 50000

def run_temperature_sweep(temps, N, mc_steps, equil_steps):
    """Run Ising model simulations across a temperature range."""
    magnetizations = []
    susceptibilities = []
    specific_heats = []

    print("Starting temperature sweep...\n")
    for T in temps:
        print(f"\nStarting simulation for T = {T}")
        print("Beginning equilibration phase...")
        print("Equilibration complete.")
        print("Beginning sampling phase...")
        
        # Run simulation with measurement of observables
        _, avg_M, chi, C = simulate_ising(
            T=T,
            N=N,
            mc_steps=mc_steps,
            equil_steps=equil_steps,
            compute_observables=True
        )
        
        # Store the absolute value of the average magnetization
        magnetizations.append(avg_M)
        susceptibilities.append(chi)
        specific_heats.append(C)
        
        print("Sampling complete.")
        print(f"Results for T = {T}:")
        print(f"  Average Magnetization <M> = {avg_M:.3f}")
        print(f"  Susceptibility χ = {chi:.3f}")
        print(f"  Specific Heat C = {C:.3f}\n")
    
    print("Temperature sweep complete. Now plotting results...")
    return magnetizations, susceptibilities, specific_heats

# Run the temperature sweep
magnetizations, susceptibilities, specific_heats = run_temperature_sweep(
    temps, N, mc_steps, equil_steps
)

# Plot and save the magnetic susceptibility plot
plt.figure(figsize=(6, 4))
plt.plot(temps, susceptibilities, marker='o')
plt.xlabel('Temperature T')
plt.ylabel('Susceptibility χ')
plt.title('Magnetic Susceptibility vs. Temperature')
plt.tight_layout()
plt.savefig("images/susceptibility.png", dpi=300)
print("Magnetic susceptibility plot saved as 'susceptibility.png'.")
plt.close()

# Plot and save the specific heat plot
plt.figure(figsize=(6, 4))
plt.plot(temps, specific_heats, marker='o')
plt.xlabel('Temperature T')
plt.ylabel('Specific Heat C')
plt.title('Specific Heat vs. Temperature')
plt.tight_layout()
plt.savefig("images/specific_heat.png", dpi=300)
print("Specific heat plot saved as 'specific_heat.png'.")
plt.close()

# Plot and save the absolute average magnetization plot
plt.figure(figsize=(6, 4))
plt.plot(temps, magnetizations, marker='o')
plt.xlabel('Temperature T')
plt.ylabel('Absolute Average Magnetization <|M|>')
plt.title('Absolute Average Magnetization vs. Temperature')
plt.tight_layout()
plt.savefig("images/magnetization.png", dpi=300)
print("Magnetization plot saved as 'magnetization.png'.")
plt.close()