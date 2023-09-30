import { GPU} from 'gpu.js';
import {Vector3D, arctan, add3D, subtract3D, scale3D, scaleAndAdd3D, length3D, normalize3D, dot3D, cross3D} from './vector3d';
import { palette, gammaCorrection } from './shading';
import fractalDE from './DE';

const gpu = new GPU();

gpu
.addFunction(arctan)
.addFunction(add3D)
.addFunction(scale3D)
.addFunction(scaleAndAdd3D)
.addFunction(subtract3D)
.addFunction(length3D)
.addFunction(normalize3D)
.addFunction(dot3D)
.addFunction(cross3D)
.addFunction(fractalDE)
.addFunction(palette)
.addFunction(gammaCorrection)

const useRender = (width: number, height: number)  => gpu.createKernel(function(width: number, height: number, eps: number, power_1: number, power_2: number, power_3: number, r: number, g: number, b: number, x: number, y: number, z: number){                                                                       
    const ray_step = 700 ;
    const ray_multiplier = 0.79;
    const FOV = 1;
    const far_plane = 4;

    const j = this.thread.x;
    const i = this.thread.y;

    const iResolution = [width, height];
    const p = [j, i];

    //---convert screen space coordinate to (-ap~ap, -1~1)
    const uv = [p[0]*2 - iResolution[0], p[1]*2 - iResolution[1]];
    uv[0] /= iResolution[1];
    uv[1] /= -iResolution[1];
    //---

    //---create camera      
    const origin = [x, y, z] as Vector3D;
    const front = normalize3D(scale3D(origin, -1));
    const right = normalize3D(cross3D(front, [0, 0, 1]));
    const up = normalize3D(cross3D(right, front));
    const rd = normalize3D([
        uv[0] * right[0] + uv[1] * up[0] + FOV * front[0],
        uv[0] * right[1] + uv[1] * up[1] + FOV * front[1],
        uv[0] * right[2] + uv[1] * up[2] + FOV * front[2],
    ]);

    //---marching
    var dist = 0;    
    var orbit = 0;
    const powers = [power_1, power_2, power_3] as Vector3D;    
    for (let i = 0; i < ray_step; i++) {
        const map = fractalDE(scaleAndAdd3D(origin, rd, dist), powers); 
        const DE = map[0]; 
        orbit = map[1];
        if (Math.abs(DE) < eps || dist > far_plane) break;
        dist += DE * ray_multiplier;
    }
    dist = dist < far_plane ? dist : -1;


    //---coloring
    const lightColor: Vector3D = [1, 0.9, 0.8];   
    const gloss = 32;
    //---
     
    var color: Vector3D = [0, 0, 0];
    if (dist > 0) {
        const v = scaleAndAdd3D(origin, rd, dist);  
        const L = scale3D(front, -1)//normalize3D([-0.5, 3, -1]);           
        const N = normalize3D([
            fractalDE(add3D(v, [eps, 0, 0]), powers)[0] - fractalDE(subtract3D(v, [eps, 0, 0]), powers)[0],
            fractalDE(add3D(v, [0, eps, 0]), powers)[0] - fractalDE(subtract3D(v, [0, eps, 0]), powers)[0],
            fractalDE(add3D(v, [0, 0, eps]), powers)[0] - fractalDE(subtract3D(v, [0, 0, eps]), powers)[0],
        ]);             
        const H = normalize3D(subtract3D(L, rd));  


        var lin: Vector3D = [0, 0, 0];
        const ambient: Vector3D = [0.1, 0.1, 0.1];  
        const diffuse_color = scale3D(lightColor, dot3D(L, N));   
        const specular_color = scale3D(diffuse_color, Math.pow(dot3D(H, N), gloss));  

        color = palette(orbit - 0.4, [0.5, 0.5, 0.5], [0.5, 0.5, 0.5], [1, 1, 1], [r, g, b]); 
        lin = add3D(lin, ambient);
        lin = add3D(lin, diffuse_color)
        color = [
            color[0] * lin[0],
            color[1] * lin[1],
            color[2] * lin[2]
        ]
        color = add3D(color, scale3D(specular_color, 0.8))              
    }
   color = gammaCorrection(color);
   this.color(color[0], color[1], color[2]);
   //this.color(orbit, orbit, orbit)
})
.setGraphical(true)
.setOutput([width, height])

export default useRender;