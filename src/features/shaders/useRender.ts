import { createFractalShdaer } from "./createFractalShader";
import { fs, fs_header } from "./fs.glsl";
import { vec3 } from "gl-matrix";
import { FractalStyle } from "../setting";
const useRender = (DE: string, param_names: string[], julia_dimension: 3 | 4 = 3) => {
    return (gl: WebGL2RenderingContext) => {
        const program = createFractalShdaer(gl, fs_header + DE + fs);
        const camera_location = gl.getUniformLocation(program, "camera");
        const front_location = gl.getUniformLocation(program, "front");
        const juliaEnabled_location = gl.getUniformLocation(program, "juliaEnabled");
        const julia_location = gl.getUniformLocation(program, "julia");
        const neon_location = gl.getUniformLocation(program, "neon");
        const decayCoeff_location = gl.getUniformLocation(program, "decayCoeff");
        const fogDensity_location = gl.getUniformLocation(program, "fogDensity");
        const palette_seed_location = gl.getUniformLocation(program, "palette_seed");
        const eps_location = gl.getUniformLocation(program, "eps");
        const ray_multiplier_location = gl.getUniformLocation(program, "ray_multiplier");
        const param_locations = param_names.map(s => gl.getUniformLocation(program, s));
        return (params: number[], juliaEnabled: boolean, julia: number[], camera: vec3, front: vec3, eps: number, ray_multiplier: number, style: FractalStyle) => {
            gl.useProgram(program);
    
            gl.uniform3f(camera_location, camera[0], camera[1], camera[2]);
            gl.uniform3f(front_location, front[0], front[1], front[2]);
            gl.uniform1i(juliaEnabled_location, Number(juliaEnabled));
            
            gl.uniform1i(neon_location, Number(style.neon));
            gl.uniform1f(decayCoeff_location, style.decay);
            gl.uniform1f(fogDensity_location, style.fog);
            gl.uniform3f(palette_seed_location, style.color.r / 255.0, style.color.g / 255.0, style.color.b / 255.0);
            gl.uniform1f(eps_location, eps);
            gl.uniform1f(ray_multiplier_location, ray_multiplier);
    
            julia_dimension == 3 ? gl.uniform3f(julia_location, julia[0], julia[1], julia[2]) : gl.uniform4f(julia_location, julia[0], julia[1], julia[2], julia[3]);
            param_locations.forEach((loc, i) => gl.uniform1f(loc, params[i]));
            gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
        }
    }
}

export default useRender;