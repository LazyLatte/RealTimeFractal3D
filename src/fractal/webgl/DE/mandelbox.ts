import { vec3 } from "gl-matrix";
export const mandelboxDE = `
    vec2 mandelboxDE(vec3 p) {
        const int iter = 64;
        const float bailout2 = 1024.0;
        float scale = params[0];
        float minRadius2 = params[1] * params[1];
        float fixedRadius2 = 1.0;
        float fold = params[2];
        
        vec3 c = juliaEnabled ? julia : p;
        vec3 v = p;
        float dr = 1.0;
        float r2 = v.x * v.x + v.y * v.y + v.z * v.z;  
        float trap = r2;
        if(abs(scale) < 1.0) return vec2(0.0, 0.0);
        for(int i=0; i<iter; i++){
            v = clamp(v, -1.0, 1.0) * 2.0 - v;
            v *= fold;
            r2 = v.x * v.x + v.y * v.y + v.z * v.z;
            if(r2 < minRadius2){
                float factor = fixedRadius2 / minRadius2;
                v *= factor;
                dr *= factor;
            }else if(r2 < fixedRadius2){
                float factor = fixedRadius2 / r2;
                v *= factor;
                dr *= factor;
            }

            v = c + scale * v;
            dr = dr * abs(scale) + 1.0;
            trap = min(trap, r2);
            if(r2 > bailout2) break;
        }
        return vec2(sqrt(r2) / abs(dr), sqrt(trap));
    }
`
export const mandelboxDE_JS = (p: vec3, params: number[], juliaEnabled: boolean, julia: vec3): number => {
    const iter = 8;
    const bailout2 = 1024; 
    const scale = params[0];
    const minRadius2 = params[1] * params[1];
    const fixedRadius2 = 1.0;
    const fold = params[2];

    const c = juliaEnabled ? vec3.clone(julia) : vec3.clone(p);
    var v = vec3.clone(p);
    var dr = 1.0;  
    var r2 = v[0] * v[0] + v[1] * v[1] + v[2] * v[2];         

    for (let i = 0; i < iter; i++) {
        if(v[0] > 1){v[0] = 2 - v[0]}else if(v[0] < -1){v[0] = -2 - v[0]}
        if(v[1] > 1){v[1] = 2 - v[1]}else if(v[1] < -1){v[1] = -2 - v[1]}
        if(v[2] > 1){v[2] = 2 - v[2]}else if(v[2] < -1){v[2] = -2 - v[2]}
        vec3.scale(v, v, fold);
        r2 = v[0] * v[0] + v[1] * v[1] + v[2] * v[2];
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
