import useRender from "../useRender";
import {rotate} from "../common";
import { iter, scale } from "./constant";
const DE = `
    uniform float xDeg;
    uniform float yDeg;
    uniform float zDeg;
    uniform bool juliaEnabled;
    uniform vec3 julia;
    ${rotate}
    vec2 DE(vec3 p){
        const int iter = ${iter};
        const float scale = float(${scale});
        const vec3 offset = vec3(1.0);
        vec3 c = juliaEnabled ? julia : vec3(0.0);
        vec3 v = p;
        float trap = dot(v, v);
        for(int i=0; i<iter; i++){
            if(v.x+v.y<0.0) v.xy = -v.yx; 
            if(v.x+v.z<0.0) v.xz = -v.zx;
            if(v.y+v.z<0.0) v.yz = -v.zy; 
            v = v*scale - offset*(scale-1.0);
            v = rotateX(v, xDeg);
            v = rotateY(v, yDeg);
            v = rotateZ(v, zDeg);
            v += c;
            trap = min(dot(v, v), trap);
        }
        return vec2(length(v)* pow(scale, -float(iter)), sqrt(trap));
    }
`;

export const useRenderSierpinski = useRender(DE, ["xDeg", "yDeg", "zDeg"]);
