import { iter, bailout2 } from "./constants";
import { vec3 } from "gl-matrix";
export const mandelboxDE_JS = (p: vec3, params: number[], juliaEnabled: boolean, julia: number[]): number => {
    const scale = params[0];
    const minRadius2 = params[1] * params[1];
    const fixedRadius2 = 1.0;
    const fold = params[2];

    const c = juliaEnabled ? vec3.clone(julia as vec3) : vec3.clone(p);
    var v = vec3.clone(p);
    var dr = 1.0;  
    var r2 = vec3.dot(v, v);         
    if(Math.abs(scale) < 1.0) return 0;
    for (let i = 0; i < iter; i++) {
        if(v[0] > 1){v[0] = 2 - v[0]}else if(v[0] < -1){v[0] = -2 - v[0]}
        if(v[1] > 1){v[1] = 2 - v[1]}else if(v[1] < -1){v[1] = -2 - v[1]}
        if(v[2] > 1){v[2] = 2 - v[2]}else if(v[2] < -1){v[2] = -2 - v[2]}
        vec3.scale(v, v, fold);
        r2 = vec3.dot(v, v); 
        if(r2 < minRadius2){
            const temp = fixedRadius2 / minRadius2;
            v[0] *= temp;
            v[1] *= temp;
            v[2] *= temp;
            dr *= temp;
        }else if(r2 < fixedRadius2){
            const temp = (fixedRadius2 / r2);
            v[0] *= temp;
            v[1] *= temp;
            v[2] *= temp;
            dr *= temp;
        }
        vec3.scaleAndAdd(v, c, v, scale);
        dr = dr * Math.abs(scale) + 1;
        if (r2 > bailout2) break;  
    }
    return Math.sqrt(r2) / Math.abs(dr);
}