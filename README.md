# Real Time Fractal 3D

A webpage for exploring 3D Fractal. User can observe 3D fractal from different angles and distances, or increase precision to generate more details.
In order to get smoother framerate, I only implement simple blinn phong shading and abandon resourse-consuming shading technique such as shadow and fog.

![image](src/data/samples/1/1.png)
Setting: {"fractal":1,"params":[-1.5,0,1],"camera":[-2.865100860595703,3.6645030975341797,-0.7278513312339783],"front":[-0.9893273711204529,0.051059190183877945,0.13647110760211945],"juliaEnabled":true,"julia":[2,-0.5,-1],"neon":false,"color":{"r":48,"g":127,"b":140},"eps":0.0002,"ray_multiplier":0.5}
## Control

1. Camera : W A S D E C + Click the screen to enter free camera mode.

2. Increase/Decrease Precision : Roll the scroll wheel.

3. Eliminate noise (decrease ray_multiplier) : Hold the right mouse button, and then roll the scroll wheel.

## Tips

1. Use higher eps and ray_multiplier when moving the camera.
   
2. Once you find your desired location, you can decrease eps and ray_multiplier to get detailed image.
