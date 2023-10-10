import { vec3 } from "gl-matrix";
import { Fractal } from "../../setting";
import rotate from "./rotate";
import {mandelbulbDE, mandelbulbDE_JS} from "./mandelbulb";
import {mandelboxDE, mandelboxDE_JS} from "./mandelbox";
import {mengerDE, mengerDE_JS} from "./menger";
import {sierpinskiDE, sierpinskiDE_JS} from "./sierpinski";
import {julia4DDE, julia4DDE_JS} from "./julia4D";
const {MandelBulb, MandelBox, Menger, Sierpinski, Julia4D} = Fractal;

const fractalDE = `
    ${rotate}
    ${mandelbulbDE}
    ${mandelboxDE}
    ${mengerDE}
    ${sierpinskiDE}
    ${julia4DDE}
    vec2 fractalDE(vec3 p) {
        if(fractal == ${MandelBulb}) return mandelbulbDE(p);
        if(fractal == ${MandelBox}) return mandelboxDE(p);
        if(fractal == ${Menger}) return mengerDE(p);
        if(fractal == ${Sierpinski}) return sierpinskiDE(p);
        if(fractal == ${Julia4D}) return julia4DDE(p);
        return vec2(0.0);
    }
`
export default fractalDE;


export const fractalDE_JS = (fractal: number, p: vec3, params: number[], juliaEnabled: boolean, julia: vec3): number => {
    if(fractal === MandelBulb) return mandelbulbDE_JS(p, params[0], juliaEnabled, julia);
    if(fractal === MandelBox) return mandelboxDE_JS(p, params, juliaEnabled, julia);
    if(fractal === Menger) return mengerDE_JS(p);
    if(fractal === Sierpinski) return sierpinskiDE_JS(p);
    if(fractal === Julia4D) return julia4DDE_JS(p, params[0], juliaEnabled, julia);
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