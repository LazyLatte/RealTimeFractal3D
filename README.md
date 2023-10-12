# Real Time Fractal 3D

A webpage for exploring 3D Fractal. User can observe 3D fractal from different angles and distances, or increase precision to generate more details.
In order to get smoother framerate, I only implement simple blinn phong shading and abandon resourse-consuming shading technique such as shadow and fog.

![image](src/data/samples/1/1.png)

## Control

1. Camera : W A S D E C + Click the screen to enter free camera mode.

2. Increase/Decrease Precision : Roll the scroll wheel.

3. Eliminate noise (decrease ray_multiplier) : Hold the right mouse button, and then roll the scroll wheel.

## Tips

1. Use higher eps and ray_multiplier when moving the camera.
   
2. Once you find your desired location, you can decrease eps and ray_multiplier to get detailed image.
