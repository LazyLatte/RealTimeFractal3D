export { type RGBColor } from "react-color";
export enum Fractal {MandelBulb, MandelBox, Menger, Sierpinski, Julia4D};
export interface Param {
    label: string;
    minValue: number;
    maxValue: number;
    step: number;
    marks: number[];
    value: number;
}

export interface ClipBoardData {
    fractal: number;
    params: number[];
    juliaEnabled: boolean;
    julia: [number, number, number];
    color: {r: number, g: number, b: number};
    neon: boolean;
    camera: [number, number, number];
    front: [number, number, number];
    eps: number;
    ray_multiplier: number;
}