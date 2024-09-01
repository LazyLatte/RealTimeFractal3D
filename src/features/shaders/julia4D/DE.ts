import { vec3 } from "gl-matrix";
import { iter, bailout } from "./constant";
const qMul = (q1: vec3, q2: vec3) => vec3.fromValues(q1[0] * q2[0] - q1[1] * q2[1] - q1[2] * q2[2], q1[0] * q2[1] + q2[0] * q1[1], q1[0] * q2[2] + q2[0] * q1[2]);
const qSquare = (q: vec3) => vec3.fromValues(q[0] * q[0] - q[1] * q[1] - q[2] * q[2], 2.0 * q[0] * q[1], 2.0 * q[0] * q[2]);
const qCube = (q: vec3) => {
    const q2 = vec3.create();
    vec3.mul(q2, q, q); 
    return vec3.fromValues(q[0] * (q2[0] - 3.0 * q2[1] - 3.0 * q2[2]), q[1] * (3.0 * q2[0] - q2[1] - q2[2]), q[2] * (3.0 * q2[0] - q2[1] - q2[2]));
}
const qFourthPow = (q: vec3) => qSquare(qSquare(q));
const qFifthPow = (q: vec3) => qMul(qSquare(q), qCube(q));
const qSixthPow = (q: vec3) => qSquare(qCube(q));
const qSeventhPow = (q: vec3) => qMul(qCube(q), qFourthPow(q));
const qEighthPow = (q: vec3) => qSquare(qSquare(qSquare(q)));
const qNinthPow = (q: vec3) => qCube(qCube(q));
const qPow_JS = (q: vec3, power: number): vec3 => {
    if(power === 2.0) return qSquare(q);
    if(power === 3.0) return qCube(q);
    if(power === 4.0) return qFourthPow(q);
    if(power === 5.0) return qFifthPow(q);
    if(power === 6.0) return qSixthPow(q);
    if(power === 7.0) return qSeventhPow(q);
    if(power === 8.0) return qEighthPow(q);
    if(power === 9.0) return qNinthPow(q);
    return q;
}
export const julia4DDE_JS = (p: vec3, params: number[], juliaEnabled: boolean, julia: number[]): number => {
    const power = params[0];
    const c = juliaEnabled ? vec3.clone(julia as vec3) : vec3.clone(p);
    var v = vec3.clone(p);
    var dr2 = 1.0;             
    var r2 = vec3.dot(v, v);  
    for (let i = 0; i < iter; i++) {
        dr2 *= (Math.pow(power, 2.0) * Math.pow(r2, power - 1.0));
        vec3.add(v, qPow_JS(v, power), c);
        
        r2 = vec3.dot(v, v);
        if(r2 > bailout) break;
    }
    return 0.25 * Math.log(r2) * Math.sqrt(r2 / dr2);
} 