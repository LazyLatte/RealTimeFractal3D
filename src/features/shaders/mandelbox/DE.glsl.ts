import useRender from "../useRender";
import { iter, bailout2 } from "./constants";

const DE = `
    uniform float scale;
    uniform float minRadius;
    uniform float fold;
    uniform bool juliaEnabled;
    uniform vec3 julia;
    
    vec2 DE(vec3 p) {
        const int iter = ${iter};
        const float bailout2 = float(${bailout2});
        float minRadius2 = minRadius * minRadius;
        float fixedRadius2 = 1.0;
        
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
export const useRenderMandelBox = useRender(DE, ["scale", "minRadius", "fold"]);
