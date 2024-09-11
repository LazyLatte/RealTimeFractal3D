import { vec3 } from "gl-matrix";
import { iter, bailout, scale } from "./constant";

const sdBox = (p: vec3, b: vec3) => {
    const d = vec3.fromValues(Math.abs(p[0])-b[0], Math.abs(p[1])-b[1], Math.abs(p[2])-b[2]);
    const m = vec3.fromValues(Math.max(d[0], 0), Math.max(d[1], 0), Math.max(d[2], 0));
    return vec3.length(m) + Math.min(Math.max(d[0], Math.max(d[1],d[2])), 0.0);
}
export const mengerDE_JS = (p: vec3, params: number[], juliaEnabled: boolean, julia: number[]): number => {
    const c = juliaEnabled ? vec3.fromValues(julia[0], julia[1], julia[2]) : vec3.fromValues(0, 0, 0);
    const offset = vec3.fromValues(1.0, 1.0, 1.0);
    var v = vec3.clone(p);
    var s = 1.0;

    const xRad = params[0] * Math.PI / 180;
    const yRad = params[1] * Math.PI / 180;
    const zRad = params[2] * Math.PI / 180;
    const fold = (z: vec3, a: number, b: number) => {
        const fold_z = vec3.clone(z);
        fold_z[a] = z[b];
        fold_z[b] = z[a];
        return fold_z;
    };
    
    for(let i=0; i<iter; i++){
        v[0] = Math.abs(v[0]);
        v[1] = Math.abs(v[1]);
        v[2] = Math.abs(v[2]);
        if(v[0] > bailout || v[1] > bailout || v[2] > bailout) break;
        if(v[0] < v[1]) v = fold(v, 0, 1); 
        if(v[0] < v[2]) v = fold(v, 0, 2);
        if(v[1] < v[2]) v = fold(v, 1, 2); 
        s *= scale;
        vec3.scale(v, v, scale);
        vec3.scaleAndAdd(v, v, offset, 1.0 - scale);
        const zVal = offset[2] * (scale - 1.0);
        if(v[2] < -0.5 * zVal) v[2] += zVal;
        vec3.rotateX(v, v, vec3.fromValues(0, 0, 0), xRad);
        vec3.rotateY(v, v, vec3.fromValues(0, 0, 0), -yRad);
        vec3.rotateZ(v, v, vec3.fromValues(0, 0, 0), zRad);
        vec3.add(v, v, c);
    }
    return sdBox(v, [1.0, 1.0, 1.0]) / s;
}
