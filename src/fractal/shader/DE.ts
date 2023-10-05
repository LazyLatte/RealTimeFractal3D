import { vec3 } from "gl-matrix";
const mandelbulbDE = `
    vec2 mandelbulbDE(vec3 p) {
        const int iter = 9;
        const float bailout = 2.0;
        float power = params[0];
        vec3 c = juliaEnabled ? julia : p;
        vec3 v = p;
        float dr = 1.0;             
        float r = length(v);  
        float trap = r;
        
        for (int i = 0; i < iter; i++) {
            float r_pow_n_minus_one = pow(r, power - 1.0);
            float r_pow_n = r * r_pow_n_minus_one;
            float theta = atan(v.y, v.x) * power;
            float phi = asin(v.z / r) * power;
            dr = power * r_pow_n_minus_one * dr + 1.0;
            v = c + r_pow_n * vec3(cos(theta) * cos(phi), cos(phi) * sin(theta), -sin(phi));
    
            trap = min(trap, r);
            r = length(v);     
            if (r > bailout) break;  
        }
    
        return vec2(0.5 * log(r) * r / dr, trap);
    }
`

const mandelboxDE = `
    vec2 mandelboxDE(vec3 p) {
        const int iter = 8;
        const float bailout2 = 1024.0;
        float scale = params[0];
        float minRadius2 = params[1] * params[1];
        float fixedRadius2 = params[2] * params[2];
        
        vec3 c = juliaEnabled ? julia : p;
        vec3 v = p;
        float dr = 1.0;
        float r2 = v.x * v.x + v.y * v.y + v.z * v.z;  
        float trap = r2;

        for(int i=0; i<iter; i++){
            v = clamp(v, -1.0, 1.0) * 2.0 - v;

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
        return vec2(sqrt(r2) / abs(dr), trap);
    }
`


const fractalDE = `
    ${mandelbulbDE}
    ${mandelboxDE}
    vec2 fractalDE(vec3 p) {
        if(fractal == 0) return mandelbulbDE(p);
        if(fractal == 1) return mandelboxDE(p);
        return vec2(0.0);
    }
`
export default fractalDE;


const mandelbulbDE_JS = (p: vec3, power: number, juliaEnabled: boolean, julia: vec3): number => {
    const iter = 9;
    const bailout = 2.0;
    const c = juliaEnabled ? vec3.clone(julia) : vec3.clone(p);
    var v = vec3.clone(p);
    var dr = 1.0;             
    var r = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);  
    
    for (let i = 0; i < iter; i++) {
        const r_pow_n_minus_one = Math.pow(r, power - 1);
        const r_pow_n = r * r_pow_n_minus_one;
        const theta = Math.atan2(v[1], v[0]) * power;
        const phi = Math.asin(v[2] / r) * power;
        dr = power * r_pow_n_minus_one * dr + 1.0;
        vec3.scaleAndAdd(v, c, vec3.fromValues(Math.cos(theta) * Math.cos(phi), Math.cos(phi) * Math.sin(theta), -Math.sin(phi)), r_pow_n);
 
        r = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);       
        if (r > bailout) break;  
    }

    return 0.5 * Math.log(r) * r / dr;
}

const mandelboxDE_JS = (p: vec3, params: vec3, juliaEnabled: boolean, julia: vec3): number => {
    const iter = 8;
    const bailout2 = 1024; 
    const scale = params[0];
    const minRadius2 = params[1] * params[1];
    const fixedRadius2 = params[2] * params[2];

    const c = juliaEnabled ? vec3.clone(julia) : vec3.clone(p);
    var v = vec3.clone(p);
    var dr = 1.0;  
    var r2 = v[0] * v[0] + v[1] * v[1] + v[2] * v[2];         

    for (let i = 0; i < iter; i++) {
        if(v[0] > 1){v[0] = 2 - v[0]}else if(v[0] < -1){v[0] = -2 - v[0]}
        if(v[1] > 1){v[1] = 2 - v[1]}else if(v[1] < -1){v[1] = -2 - v[1]}
        if(v[2] > 1){v[2] = 2 - v[2]}else if(v[2] < -1){v[2] = -2 - v[2]}

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

export const fractalDE_JS = (fractal: number, p: vec3, params: vec3, juliaEnabled: boolean, julia: vec3): number => {
    if(fractal === 0) return mandelbulbDE_JS(p, params[0], juliaEnabled, julia);
    if(fractal === 1) return mandelboxDE_JS(p, params, juliaEnabled, julia);
    return 0;
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