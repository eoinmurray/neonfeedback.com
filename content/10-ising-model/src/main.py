import numpy as np
import matplotlib.pyplot as plt
import matplotlib.animation as animation
from ising import glauber_step, initial_state

# Grid size and simulation parameters
N = 100          # grid dimension (100x100)
T = 10.0         # temperature
steps_per_frame = N * N  # number of spin update attempts per animation frame

# Initialize grid randomly with spins +1 or -1
grid = initial_state(N)

# Set up the plot
fig, ax = plt.subplots()
im = ax.imshow(grid, cmap='coolwarm', interpolation='nearest')

print("T = %s" % T)
ax.set_title("T = %s" % T)

def update(frame):
    global grid
    grid = glauber_step(grid, T, steps_per_frame, N)
    im.set_data(grid)
    return [im]

# Create the animation
ani = animation.FuncAnimation(fig, update, frames=200, interval=50, blit=True)

# Save the animation as an animated GIF using the 'pillow' writer.
ani.save(f"images/ising_model-{T}T.gif", writer='pillow')

# # Optionally, display the animated plot.
# plt.show()