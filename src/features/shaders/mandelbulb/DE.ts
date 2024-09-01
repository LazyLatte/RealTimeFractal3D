import { iter, bailout } from "./constants";
import { vec3 } from "gl-matrix";

export const mandelbulbDE_JS = (p: vec3, params: number[], juliaEnabled: boolean, julia: number[]): number => {
    const power = params[0];
    const c = juliaEnabled ? vec3.clone(julia as vec3) : vec3.clone(p);
    var v = vec3.clone(p);
    var dr = 1.0;             
    var r = vec3.length(v); 
    
    for (let i = 0; i < iter; i++) {
        const r_pow_n_minus_one = Math.pow(r, power - 1);
        const r_pow_n = r * r_pow_n_minus_one;
        const theta = Math.atan2(v[1], v[0]) * power;
        const phi = Math.asin(v[2] / r) * power;
        dr = power * r_pow_n_minus_one * dr + 1.0;
        vec3.scaleAndAdd(v, c, vec3.fromValues(Math.cos(theta) * Math.cos(phi), Math.cos(phi) * Math.sin(theta), -Math.sin(phi)), r_pow_n);
 
        r = vec3.length(v);     
        if (r > bailout) break;  
    }

    return 0.5 * Math.log(r) * r / dr;
}
/*
function arctan(y: number, x: number) {
    if(x > 0) return Math.atan(y / x);
    if(y >= 0 && x < 0) return Math.atan(y / x) + Math.PI;
    if(y < 0 && x < 0) return Math.atan(y / x) - Math.PI;
    if(y > 0 && x === 0) return Math.PI * 0.5;
    if(y < 0 && x === 0) return -Math.PI * 0.5;
    return 0;
}
*/