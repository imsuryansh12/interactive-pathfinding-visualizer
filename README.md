# A* Pathfinding Visualizer

I built this project to get a better visual understanding of how the A* pathfinding algorithm actually works under the hood. 

Instead of just outputting coordinates to a console, this is an interactive web tool where you can draw custom obstacles on a grid, and it will animate the algorithm's search process frame-by-frame to find the shortest path. 

![A* Visualization Demo]


<img width="615" height="620" alt="Demo" src="https://github.com/user-attachments/assets/8776235a-06f8-4fc9-b140-880ba03d6e4f" />



## What it does
* **Draw Obstacles:** Click and drag on the grid to build a maze.
* **Watch it Think:** The algorithm visualizes its search in real-time (blue nodes are being evaluated, the yellow line is the final fastest route).
* **Reset & Re-run:** A quick clear function to reset the grid memory and try a new layout instantly.

## How it was built
I wanted to keep this as lightweight as possible, so it's built entirely without frameworks:
* **HTML & CSS** (using CSS Grid for the coordinate alignment)
* **Vanilla JavaScript** (handling the object-oriented node logic, event delegation, and the actual A* math)

## Try it out
There are no dependencies or local servers needed. 
1. Clone this repo.
2. Double-click `index.html` to open it in your browser.
3. Draw a wall and hit "Solve A*".

## Author
Suryansh
