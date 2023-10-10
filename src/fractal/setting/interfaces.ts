export { type RGBColor } from "react-color";
export enum Fractal {MandelBulb, MandelBox, Menger, Sierpinski, Julia4D};
export interface Param {
    label: string;
    minValue: number;
    maxValue: number;
    step: number;
    value: number;
}
