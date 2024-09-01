import useRender from "../useRender";
import { iter, bailout } from "./constant";
const DE = `
    uniform float power;
    uniform float qk;
    uniform bool juliaEnabled;
    uniform vec4 julia;

    vec4 qMul(vec4 q1, vec4 q2){return vec4(
        q1.x * q2.x - q1.y * q2.y - q1.z * q2.z - q1.w * q2.w,
        q1.x * q2.y + q1.y * q2.x + q1.z * q2.w - q1.w * q2.z,
        q1.x * q2.z - q1.y * q2.w + q1.z * q2.x + q1.w * q2.y,
        q1.x * q2.w + q1.y * q2.z - q1.z * q2.y + q1.w * q2.x
    );}
    vec4 qSquare(vec4 q){
        return vec4(q.x*q.x - dot(q.yzw, q.yzw), 2.0 * q.x * q.yzw);
    }
    vec4 qCube(vec4 q){
        return q * (4.0 * q.x * q.x - dot(q, q) * vec4(3.0, 1.0, 1.0, 1.0));
    }

    vec4 qPow(vec4 q, float power){
        if(power == 2.0) return qSquare(q);
        if(power == 3.0) return qCube(q);
        if(power == 4.0) return qSquare(qSquare(q));
        if(power == 5.0) return qMul(qSquare(q), qCube(q));
        if(power == 6.0) return qSquare(qCube(q));
        if(power == 7.0) return qMul(qSquare(qSquare(q)), qCube(q));
        if(power == 8.0) return qSquare(qSquare(qSquare(q)));
        if(power == 9.0) return qCube(qCube(q));
        return q;
    }
    float lengthSquared(vec4 q){return dot(q, q);}
    vec2 DE(vec3 p) {
        const int iter = ${iter};
        const float bailout = float(${bailout});
        vec4 v = vec4(p, qk);
        vec4 c = juliaEnabled ? julia : v;
        float dr2 = 1.0;             
        float r2 = dot(v, v);  
        float trap = r2;
        for (int i = 0; i < iter; i++) {
            dr2 *= (power * power * lengthSquared(qPow(v, power - 1.0)));
            v = qPow(v, power) + c;
            
            r2 = dot(v, v);
            trap = min(trap, r2);
            if(r2 > bailout) break;
        }
        return vec2(0.25 * log(r2) * sqrt(r2 / dr2), sqrt(trap));
    }
`;

export const useRenderJulia4D = useRender(DE, ["power", "qk"], 4);