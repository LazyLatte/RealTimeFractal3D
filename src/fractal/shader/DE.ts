import { vec3 } from "gl-matrix";
import { Fractal } from "../setting";
const {MandelBulb, MandelBox, Menger, Sierpinski} = Fractal;
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
        const float bailout2 = 256.0;
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
        return vec2(sqrt(r2) / abs(dr), sqrt(trap));
    }
`
const mengerDE = `

    float sdBox(vec3 p, vec3 b){
        vec3 d = abs(p) - b;
        return length(max(d,0.0)) + min(max(d.x,max(d.y,d.z)),0.0);
    }
    vec2 mengerDE(vec3 p){
        const int iter = 3;
        const vec3 n1 = normalize(vec3(1,0,-1));
        const vec3 n2 = normalize(vec3(0,1,-1));
        vec3 v = p;
        float s = 1.;
        float trap = dot(v,v);
        for(int i=0; i<iter; i++){
            v = abs(v);  
            v -= 2.*min(0.,dot(v,n1))*n1; 
            v -= 2.*min(0.,dot(v,n2))*n2; 
            
            v *= 3.; 
            s /= 3.;
            
            v.z -=  1.;
            v.z  = -abs(v.z);
            v.z +=  1.;
            v.x -= 2.;
            v.y -= 2.;  
            
            trap = min(trap, dot(v,v)); 
        }
        float dis = sdBox(v,vec3(1.0));
        dis *= s;
        return vec2(dis, sqrt(trap));
    }
`

const sierpinskiDE = `
    vec2 sierpinskiDE(vec3 p){
        const int iter = 15;
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
`
const fractalDE = `
    ${mandelbulbDE}
    ${mandelboxDE}
    ${mengerDE}
    ${sierpinskiDE}
    vec2 fractalDE(vec3 p) {
        if(fractal == ${MandelBulb}) return mandelbulbDE(p);
        if(fractal == ${MandelBox}) return mandelboxDE(p);
        if(fractal == ${Menger}) return mengerDE(p);
        if(fractal == ${Sierpinski}) return sierpinskiDE(p);
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

const sierpinskiDE_JS = (p: vec3): number => {
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
export const fractalDE_JS = (fractal: number, p: vec3, params: vec3, juliaEnabled: boolean, julia: vec3): number => {
    if(fractal === MandelBulb) return mandelbulbDE_JS(p, params[0], juliaEnabled, julia);
    if(fractal === MandelBox) return mandelboxDE_JS(p, params, juliaEnabled, julia);
    if(fractal === Sierpinski) return sierpinskiDE_JS(p);
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