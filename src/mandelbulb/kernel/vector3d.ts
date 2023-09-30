export type Vector3D = [number, number, number];
function arctan(y: number, x: number) {
    if(x > 0) return Math.atan(y / x);
    if(y >= 0 && x < 0) return Math.atan(y / x) + Math.PI;
    if(y < 0 && x < 0) return Math.atan(y / x) - Math.PI;
    if(y > 0 && x === 0) return Math.PI * 0.5;
    if(y < 0 && x === 0) return -Math.PI * 0.5;
    return 0;
}
function add3D(a: Vector3D, b: Vector3D): Vector3D {return [a[0]+b[0], a[1]+b[1], a[2]+b[2]]}
function subtract3D(a: Vector3D, b: Vector3D): Vector3D {return [a[0]-b[0], a[1]-b[1], a[2]-b[2]]}
function scale3D(a: Vector3D, c: number): Vector3D {return [a[0]*c, a[1]*c, a[2]*c]}
function scaleAndAdd3D(a: Vector3D, b: Vector3D, c: number): Vector3D {return add3D(a, scale3D(b, c))}
function length3D(v: Vector3D): number {return Math.sqrt(v[0]*v[0] + v[1]*v[1] + v[2]*v[2])}
function normalize3D(v: Vector3D): Vector3D {const r = length3D(v); return [v[0] / r, v[1] / r, v[2] / r]}
function dot3D(a: Vector3D, b: Vector3D): number {return a[0]*b[0] + a[1]*b[1] + a[2]*b[2]}
function cross3D(a: Vector3D, b: Vector3D): Vector3D {return [a[1] * b[2] - b[1] * a[2], a[2] * b[0] - b[2] * a[0], a[0] * b[1] - b[0] * a[1]]}

export {arctan, add3D, subtract3D, scale3D, scaleAndAdd3D, length3D, normalize3D, dot3D, cross3D}

