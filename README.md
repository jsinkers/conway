# conway
Conway's game of life and other fun

Interesting play problems as I learn some JavaScript.
  
1. [Conway's Game of Life](conway.html). 
Cells live or die at the next generation depending how many neighbours they have: too few and it is as though it is underpopulated, and dies; too many and it is as thought it is overpopulated, and dies.  Living cells with 2 or 3 neighbours stay alive, and otherwise die.  Dead cells with exactly 3 neighbours come to life.  From these simple rules you see static and dynamic patterns emerge.  Each run is randomly seeded with roughly 50% of cells populated.    
2. [Double Pendulum](double_pendulum.html) . A classic example of chaotic motion. Simulated using Euler's method. Speeds, masses and lengths are randomly seeded within a set range.  The pendulum produces a trace for the outer pendulum. 
3. [Mandelbrot set](mandelbrot.html).  Set of complex numbers c that remain bounded under the transformation z_n+1 = z_n^2 + c
4. [Progress bar](progress_bar.html). Bootstrap based progress bar, using a web worker to update progress.  Intended as a template for future work.
5. [Box selector](box_selector.html). Template to create boxes on a canvas by clicking.
