import { vec3 } from "gl-matrix";
import {vs, fs} from "./shader";
import { Fractal } from "../setting";

const canvas = document.createElement("canvas");
canvas.id = "fractal-canvas";
canvas.style.width = `${window.innerWidth}px`;
canvas.style.height = `${window.innerHeight}px`;
canvas.width = Math.floor(window.innerWidth * window.devicePixelRatio);
canvas.height = Math.floor(window.innerHeight * window.devicePixelRatio);
// canvas.addEventListener('webglcontextlost', (e) => {e.preventDefault()}); navigate to Error page
// canvas.addEventListener('webglcontextrestored', (e) => {}); navigate back

function useRender() {
    const gl = canvas.getContext('webgl2', {alpha: false, depth: false, antialias: false});
    if(!gl){
        throw new Error('Unable to initialize WebGL2.');
    }
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    
    const initShader = (type: 'VERTEX_SHADER' | 'FRAGMENT_SHADER', source: string) => {
        const shader = gl.createShader(gl[type]);
    
        if (!shader) {
          throw new Error('Unable to create a shader.');
        }
    
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
    
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
          throw new Error(`An error occurred during compiling the shaders: ${gl.getShaderInfoLog(shader)}`);
        }
    
        return shader;
      }
    const vertexShader = initShader("VERTEX_SHADER", vs);
    const fragmentShader = initShader("FRAGMENT_SHADER", fs);
    const program = gl.createProgram();

    if (!program) {
        throw new Error('Unable to create the program.');
    }

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
  
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      throw new Error(`Unable to link the shaders: ${gl.getProgramInfoLog(program)}`);
    }
  
    gl.useProgram(program);
    const positions = [
        -1, -1,
        1, -1,
        1, 1,
        -1, 1
    ];
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
  
    const index = gl.getAttribLocation(program, 'position');
    gl.vertexAttribPointer(index, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(index);

    const iRes_location = gl.getUniformLocation(program, "iResolution");
    gl.uniform2f(iRes_location, canvas.width, canvas.height);

    return (fractal: Fractal, params: number[], camera: vec3, front: vec3, juliaEnabled: boolean, julia: vec3, neon: boolean, palette_seed: vec3, eps: number, ray_multiplier: number, far_plane: number) => {
        const fractal_location = gl.getUniformLocation(program, "fractal");
        const camera_location = gl.getUniformLocation(program, "camera");
        const front_location = gl.getUniformLocation(program, "front");
        const juliaEnabled_location = gl.getUniformLocation(program, "juliaEnabled");
        const julia_location = gl.getUniformLocation(program, "julia");
        const neon_location = gl.getUniformLocation(program, "neon");
        const palette_seed_location = gl.getUniformLocation(program, "palette_seed");
        const eps_location = gl.getUniformLocation(program, "eps");
        const ray_multiplier_location = gl.getUniformLocation(program, "ray_multiplier");
        const far_plane_location = gl.getUniformLocation(program, "far_plane");
        gl.uniform1i(fractal_location, fractal);
        gl.uniform3f(camera_location, camera[0], camera[1], camera[2]);
        gl.uniform3f(front_location, front[0], front[1], front[2]);
        gl.uniform1i(juliaEnabled_location, Number(juliaEnabled));
        gl.uniform3f(julia_location, julia[0], julia[1], julia[2]);
        gl.uniform1i(neon_location, Number(neon));
        gl.uniform3f(palette_seed_location, palette_seed[0], palette_seed[1], palette_seed[2]);
        gl.uniform1f(eps_location, eps);
        gl.uniform1f(ray_multiplier_location, ray_multiplier);
        gl.uniform1f(far_plane_location, far_plane);
        params.forEach((e, i) => {
          const param_location = gl.getUniformLocation(program, `params[${i}]`);
          gl.uniform1f(param_location, e);
        })
        gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
        return canvas;
    }
    
}

export default useRender;