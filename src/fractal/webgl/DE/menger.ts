import { vec3 } from "gl-matrix";
const iter = 3;
export const mengerDE = `
    float sdBox(vec3 p, vec3 b){
        vec3 d = abs(p) - b;
        return length(max(d, 0.0)) + min(max(d.x, max(d.y,d.z)), 0.0);
    }
    vec2 mengerDE(vec3 p){
        const int iter = ${iter};
        const float bailout = 2.0;
        vec3 v = p;
        float scale = 3.0;
        vec3 offset = vec3(1.0);
        float trap = dot(v,v);
        float s = 1.0;
        for(int i=0; i<iter; i++){
            v = abs(v);  
            if(v.x > bailout || v.y > bailout || v.z > bailout) break;
            if(v.x < v.y) v.xy = v.yx;
            if(v.x < v.z) v.xz = v.zx;
            if(v.y < v.z) v.yz = v.zy;
            s *= scale;
            v = v * scale - offset * (scale - 1.0);
            float zVal = offset.z * (scale - 1.0);
            if(v.z < -0.5 * zVal) v.z += zVal;
            trap = min(trap, dot(v,v)); 
        }
        return vec2(sdBox(v,vec3(1.0)) / s, sqrt(trap));
    }
`

const sdBox = (p: vec3, b: vec3) => {
    const d = vec3.fromValues(Math.abs(p[0])-b[0], Math.abs(p[1])-b[1], Math.abs(p[2])-b[2]);
    const m = vec3.fromValues(Math.max(d[0], 0), Math.max(d[1], 0), Math.max(d[2], 0));
    return vec3.length(m) + Math.min(Math.max(d[0], Math.max(d[1],d[2])), 0.0);
}
export const mengerDE_JS = (p: vec3): number => {
    const scale = 3.0;
    const offset = vec3.fromValues(1.0, 1.0, 1.0);
    vec3.scale(offset, offset, 1.0 - scale);
    var v = vec3.clone(p);
    var s = 1.0;
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
        if(v[0] < v[1]) v = fold(v, 0, 1); 
        if(v[0] < v[2]) v = fold(v, 0, 2);
        if(v[1] < v[2]) v = fold(v, 1, 2); 
        s *= scale;
        vec3.scaleAndAdd(v, offset, v, scale);
        const zVal = offset[2] * (scale - 1.0);
        if(v[2] < -0.5 * zVal) v[2] += zVal;
    }
    return sdBox(v, [1.0, 1.0, 1.0]) / s;
}
