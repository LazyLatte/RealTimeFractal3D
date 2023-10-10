import { vec3 } from "gl-matrix";
export const sierpinskiDE = `
    vec2 sierpinskiDE(vec3 p){
        const int iter = 8;
        float scale = 2.0;
        vec3 offset = vec3(1.0);

        vec3 v = p;
        float trap = dot(v, v);
        for(int i=0; i<iter; i++){
            if(v.x+v.y<0.0) v.xy = -v.yx; 
            if(v.x+v.z<0.0) v.xz = -v.zx;
            if(v.y+v.z<0.0) v.yz = -v.zy; 
            v = v*scale - offset*(scale-1.0);
            trap = min(dot(v, v), trap);
        }
        return vec2(length(v)* pow(scale, -float(iter)), sqrt(trap));
    }
`;

export const sierpinskiDE_JS = (p: vec3): number => {
    const iter = 15;
    const scale = 2.0;
    const offset = vec3.fromValues(1.0, 1.0, 1.0);
    vec3.scale(offset, offset, 1.0 - scale);
    var v = vec3.clone(p);

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
        vec3.scaleAndAdd(v, offset, v, scale);
    }
    return vec3.length(v)* Math.pow(scale, -iter);
}
