import { vec3 } from "gl-matrix";
const iter = 9;
const bailout = 2.0;
export const mandelbulbDE = `
    vec2 mandelbulbDE(vec3 p) {
        const int iter = ${iter};
        const float bailout = float(${bailout});
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

export const mandelbulbDE_JS = (p: vec3, power: number, juliaEnabled: boolean, julia: vec3): number => {
    const c = juliaEnabled ? vec3.clone(julia) : vec3.clone(p);
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
