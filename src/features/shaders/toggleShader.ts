import { Fractal } from "../setting";
import { useRenderJulia4D } from "./julia4D/DE.glsl";
import { useRenderMandelBox } from "./mandelbox/DE.glsl";
import { useRenderMandelBulb } from "./mandelbulb/DE.glsl";
import { useRenderMenger } from "./menger/DE.glsl";
import { useRenderSierpinski } from "./sierpinski/DE.glsl";

export const toggleShader = (gl: WebGL2RenderingContext, fractal: Fractal) => {
    switch(fractal){
        case Fractal.MandelBulb: return useRenderMandelBulb(gl);
        case Fractal.MandelBox: return useRenderMandelBox(gl);
        case Fractal.Menger: return useRenderMenger(gl);
        case Fractal.Sierpinski: return useRenderSierpinski(gl);
        case Fractal.Julia4D: return useRenderJulia4D(gl);
        default: return useRenderMandelBulb(gl);
    }
}