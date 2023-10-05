import {useReducer} from 'react';
import { vec3 } from "gl-matrix";
import { RGBColor } from "react-color";
import { Fractal, Param } from './interfaces';
export type SettingState = {
    fractal: Fractal;
    params: Param[];
    julia: [boolean, vec3];
    color: RGBColor;
}

export type SettingAction = {
    type: '@SET_PARAM';
    value: number;
    idx: number;
} | {
    type: '@SET_JULIA';
    juliaConst: number;
    idx: number;
} | {
    type: '@TOGGLE_JULIA';
    juliaEnabled: boolean;
} | {
    type: '@SET_COLOR';
    color: RGBColor;
} | {
    type: '@SWITCH_FRACTAL';
    fractal: Fractal;
}

const defaultMandelBulbSetting: SettingState = {
    fractal: Fractal.MandelBulb,
    params: [{
        label: 'power',
        minValue: 0,
        maxValue: 16,
        value: 8
    }],
    julia: [false, [0, 0, 0]],
    color: {
        r: 25,
        g: 94,
        b: 124
    }
}

const defaultMandelBoxSetting: SettingState = {
    fractal: Fractal.MandelBox,
    params: [{
        label: 'scale',
        minValue: -3,
        maxValue: 3,
        value: 3
    }, {
        label: 'min radius',
        minValue: 0,
        maxValue: 2,
        value: 0.5
    }, {
        label: 'fixed radius',
        minValue: 0,
        maxValue: 2,
        value: 1
    }],
    julia: [false, [0, 0, 0]],
    color: {
        r: 25,
        g: 94,
        b: 124
    }
}
const defaultSetting = [defaultMandelBulbSetting, defaultMandelBoxSetting];
const getSetting = (fractal: Fractal): SettingState  => {
    const targetsetting = defaultSetting[fractal];
    return {
        fractal,
        params: targetsetting.params.map(e => ({...e})),
        julia: [false, [0, 0, 0]],
        color: {...targetsetting.color}
    }
}
const reducer = (state: SettingState, action: SettingAction): SettingState => {
    switch(action.type){
        case '@SET_PARAM': {
            const {value, idx} = action;
            return {...state, params: state.params.map((e, i) => i===idx ? {...e, value} : e) }
        }
        case '@SET_JULIA': {
            const {juliaConst, idx} = action;
            const newJulia = state.julia[1];
            newJulia[idx] = juliaConst;
            return {...state, julia: [state.julia[0], newJulia]}
        }
        case '@TOGGLE_JULIA': {
            const {juliaEnabled} = action;
            return {...state, julia: [juliaEnabled, state.julia[1]]}
        }
        case '@SET_COLOR': {
            const {color} = action;
            return {...state, color};
        }
        case '@SWITCH_FRACTAL': {
            const {fractal} = action;
            return getSetting(fractal);
        }
        default:
            return state;
    }
}

export const useSettingReducer = () => useReducer(reducer, getSetting(Fractal.MandelBulb));