import { Vector3D } from "./vector3d";
function palette(t: number, a: Vector3D, b: Vector3D, c: Vector3D, d: Vector3D): Vector3D {
    return [
        a[0] + b[0] * Math.cos(2 * Math.PI * (c[0] * t + d[0])),
        a[1] + b[1] * Math.cos(2 * Math.PI * (c[1] * t + d[1])),
        a[2] + b[2] * Math.cos(2 * Math.PI * (c[2] * t + d[2]))
    ]
}

function gammaCorrection(color: Vector3D): Vector3D {
    const gamma = 0.4545;
    return [
        Math.pow(color[0], gamma),
        Math.pow(color[1], gamma),
        Math.pow(color[2], gamma)
    ]
}

export {palette, gammaCorrection}