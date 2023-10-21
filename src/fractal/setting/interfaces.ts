export { type RgbColor } from "react-colorful";
export enum Fractal {MandelBulb, MandelBox, Menger, Sierpinski, Julia4D};
export interface Param {
    label: string;
    minValue: number;
    maxValue: number;
    step: number;
    marks: number[];
    value: number;
}
