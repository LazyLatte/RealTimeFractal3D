import { vec3 } from "gl-matrix";
const iter = 16;
const scale = 2.0;
export const sierpinskiDE = `
    vec2 sierpinskiDE(vec3 p){
        const int iter = ${iter};
        const float scale = float(${scale});
        const vec3 offset = vec3(1.0);
        float xDeg = params[0];
        float yDeg = params[1];
        float zDeg = params[2];
        vec3 c = juliaEnabled ? julia : vec3(0.0);
        vec3 v = p;
        float trap = dot(v, v);
        for(int i=0; i<iter; i++){
            if(v.x+v.y<0.0) v.xy = -v.yx; 
            if(v.x+v.z<0.0) v.xz = -v.zx;
            if(v.y+v.z<0.0) v.yz = -v.zy; 
            v = v*scale - offset*(scale-1.0);
            v = rotateX(v, xDeg);
            v = rotateY(v, yDeg);
            v = rotateZ(v, zDeg);
            v += c;
            trap = min(dot(v, v), trap);
        }
        return vec2(length(v)* pow(scale, -float(iter)), sqrt(trap));
    }
`;

export const sierpinskiDE_JS = (p: vec3, params: number[], juliaEnabled: boolean, julia: vec3): number => {
    const c = juliaEnabled ? vec3.clone(julia) : vec3.fromValues(0, 0, 0);
    const offset = vec3.fromValues(1.0, 1.0, 1.0);
    var v = vec3.clone(p);

    const xRad = params[0] * Math.PI / 180;
    const yRad = params[1] * Math.PI / 180;
    const zRad = params[2] * Math.PI / 180;
    const fold = (z: vec3, a: number, b: number) => {
        const fold_z = vec3.clone(z);
        fold_z[a] = -z[b];
        fold_z[b] = -z[a];
        return fold_z;
    };
    
    for(let i=0; i<iter; i++){
        if(v[0]+v[1]<0.0) v = fold(v, 0, 1); 
        if(v[0]+v[2]<0.0) v = fold(v, 0, 2);
        if(v[1]+v[2]<0.0) v = fold(v, 1, 2); 
        vec3.scale(v, v, scale);
        vec3.scaleAndAdd(v, v, offset, 1.0 - scale);
        vec3.rotateX(v, v, vec3.fromValues(0, 0, 0), xRad);
        vec3.rotateY(v, v, vec3.fromValues(0, 0, 0), yRad);
        vec3.rotateZ(v, v, vec3.fromValues(0, 0, 0), zRad);
        vec3.add(v, v, c);
    }
    return vec3.length(v)* Math.pow(scale, -iter);
}
