import { vec3 } from "gl-matrix";
import { Fractal } from "../setting";
import { mandelbulbDE_JS } from "./mandelbulb/DE";
import { mandelboxDE_JS } from "./mandelbox/DE";
import { mengerDE_JS } from "./menger/DE";
import { sierpinskiDE_JS } from "./sierpinski/DE";
import { julia4DDE_JS } from "./julia4D/DE";


export const getFractalDE = (fractal: Fractal, p: vec3, params: number[], juliaEnabled: boolean, julia: number[]): number => {
    switch(fractal){
        case Fractal.MandelBulb: return mandelbulbDE_JS(p, params, juliaEnabled, julia);
        case Fractal.MandelBox: return mandelboxDE_JS(p, params, juliaEnabled, julia);
        case Fractal.Menger: return mengerDE_JS(p, params, juliaEnabled, julia);
        case Fractal.Sierpinski: return sierpinskiDE_JS(p, params, juliaEnabled, julia);
        case Fractal.Julia4D: return julia4DDE_JS(p, params, juliaEnabled, julia);
        default: return mandelbulbDE_JS(p, params, juliaEnabled, julia);
    }
}