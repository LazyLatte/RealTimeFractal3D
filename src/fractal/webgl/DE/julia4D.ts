import { vec3 } from "gl-matrix";
const iter = 24;
const bailout = 256;
export const julia4DDE = `
    vec3 qMul(vec3 q1, vec3 q2){return vec3(q1.x*q2.x - q1.y*q2.y - q1.z*q2.z, q1.x*q2.y + q2.x*q1.y, q1.x*q2.z + q2.x*q1.z);}
    vec3 qSquare(vec3 q){return vec3(q.x * q.x - q.y * q.y - q.z * q.z, 2.0 * q.x * q.yz);}
    vec3 qCube(vec3 q){vec3 q2 = q * q; return vec3(q.x * (q2.x - 3.0 * q2.y - 3.0 * q2.z), q.yz * (3.0 * q2.x - q2.y - q2.z));}
    vec3 qFourthPow(vec3 q){return qSquare(qSquare(q));}
    vec3 qFifthPow(vec3 q){return qMul(qSquare(q), qCube(q));}
    vec3 qSixthPow(vec3 q){return qSquare(qCube(q));}
    vec3 qSeventhPow(vec3 q){return qMul(qCube(q), qFourthPow(q));}
    vec3 qEighthPow(vec3 q){return qSquare(qSquare(qSquare(q)));}
    vec3 qNinthPow(vec3 q){return qCube(qCube(q));}
    vec3 qPow(vec3 q, float power){
        if(power == 2.0) return qSquare(q);
        if(power == 3.0) return qCube(q);
        if(power == 4.0) return qFourthPow(q);
        if(power == 5.0) return qFifthPow(q);
        if(power == 6.0) return qSixthPow(q);
        if(power == 7.0) return qSeventhPow(q);
        if(power == 8.0) return qEighthPow(q);
        if(power == 9.0) return qNinthPow(q);
        return q;
    }
    vec2 julia4DDE(vec3 p) {
        const int iter = ${iter};
        const float bailout = float(${bailout});
        float power = params[0];
        vec3 c = juliaEnabled ? julia : p;
        vec3 v = p;
        float dr2 = 1.0;             
        float r2 = dot(v, v);  
        float trap = r2;
        for (int i = 0; i < iter; i++) {
            dr2 *= (pow(power, 2.0) * pow(r2, power - 1.0));
            v = qPow(v, power) + c;
            
            r2 = dot(v, v);
            trap = min(trap, r2);
            if(r2 > bailout) break;
        }
        return vec2(0.25 * log(r2) * sqrt(r2 / dr2), sqrt(trap));
    }
`;

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
export const julia4DDE_JS = (p: vec3, power: number, juliaEnabled: boolean, julia: vec3): number => {
    const c = juliaEnabled ? vec3.clone(julia) : vec3.clone(p);
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