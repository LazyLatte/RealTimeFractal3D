import useRender from "../useRender";
import {rotate} from "../common";
import { iter, bailout, scale } from "./constant";

const DE = `
    uniform float xDeg;
    uniform float yDeg;
    uniform float zDeg;
    uniform bool juliaEnabled;
    uniform vec3 julia;
    ${rotate}
    float sdBox(vec3 p, vec3 b){
        vec3 d = abs(p) - b;
        return length(max(d, 0.0)) + min(max(d.x, max(d.y,d.z)), 0.0);
    }
    vec2 DE(vec3 p){
        const int iter = ${iter};
        const float bailout = float(${bailout});
        const float scale = float(${scale});
        const vec3 offset = vec3(1.0);
        vec3 c = juliaEnabled ? julia : vec3(0.0);

        vec3 v = p;
        float s = 1.0;
        float trap = dot(v,v);
        for(int i=0; i<iter; i++){
            v = abs(v);  
            if(v.x > bailout || v.y > bailout || v.z > bailout) break;
            if(v.x < v.y) v.xy = v.yx;
            if(v.x < v.z) v.xz = v.zx;
            if(v.y < v.z) v.yz = v.zy;
            s *= scale;
            v = v * scale - offset * (scale - 1.0);
            float zVal = offset.z * (scale - 1.0);
            if(v.z < -0.5 * zVal) v.z += zVal;
            v = rotateX(v, xDeg);
            v = rotateY(v, yDeg);
            v = rotateZ(v, zDeg);
            v += c;
            trap = min(trap, dot(v,v)); 
        }
        return vec2(sdBox(v,vec3(1.0)) / s, sqrt(trap));
    }
`

export const useRenderMenger = useRender(DE, ["xDeg", "yDeg", "zDeg"]);