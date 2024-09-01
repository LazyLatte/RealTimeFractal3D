export { type RgbColor } from "react-colorful";
export enum Fractal {MandelBulb, MandelBox, Menger, Sierpinski, Julia4D};
export interface SliderSetting {
    label: string;
    minValue: number;
    maxValue: number;
    step: number;
    marks: number[];
}
// export interface Param {
//     label: string;
//     minValue: number;
//     maxValue: number;
//     step: number;
//     marks: number[];
//     value: number;
// }
