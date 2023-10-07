export enum Fractal {MandelBulb, MandelBox, Menger, Sierpinski};
export interface Param {
    label: string;
    minValue: number;
    maxValue: number;
    value: number;
}
