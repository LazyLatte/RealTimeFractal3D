import {useReducer} from 'react';
import { vec2, vec3, mat4 } from "gl-matrix";
import { RGBColor } from "react-color";
import { Fractal, Param } from './interfaces';
import { fractalDE_JS } from '../shader';
export type SettingState = {
    fractal: Fractal;
    params: Param[];
    julia: [boolean, vec3];
    color: RGBColor;
    camera: vec3;
    eps: number;
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
    type: '@ROTATE_CAMERA';
    dir: vec2;
} | {
    type: '@MOVE_CAMERA';
    forward: boolean;
} | {
    type: '@SET_EPS';
    increase: boolean;
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
    },
    camera: vec3.fromValues(1, 1, 1.414),
    eps: 0.001
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
    },
    camera: vec3.fromValues(0, 7, 0),
    eps: 0.0025
}

const defaultMengerSetting: SettingState = {
    fractal: Fractal.Menger,
    params: [],
    julia: [false, [0, 0, 0]],
    color: {
        r: 25,
        g: 94,
        b: 124
    },
    camera: vec3.fromValues(3, 0, 0),
    eps: 0.01
}

const defaultSierpinskiSetting: SettingState = {
    fractal: Fractal.Sierpinski,
    params: [],
    julia: [false, [0, 0, 0]],
    color: {
        r: 25,
        g: 94,
        b: 124
    },
    camera: vec3.fromValues(1.5, 1.5, -1.5),
    eps: 0.01
}



const defaultSetting = [defaultMandelBulbSetting, defaultMandelBoxSetting, defaultMengerSetting, defaultSierpinskiSetting];
const getSetting = (fractal: Fractal): SettingState  => {
    const targetsetting = defaultSetting[fractal];
    return {
        fractal,
        params: targetsetting.params.map(e => ({...e})),
        julia: [false, [0, 0, 0]],
        color: {...targetsetting.color},
        camera: vec3.clone(targetsetting.camera),
        eps: targetsetting.eps
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
        case '@ROTATE_CAMERA': {
            const rotateFactor = 0.005;
            const {camera} = state;
            const {dir} = action;
            
            const r = vec2.length(dir);
            const newCamera = vec3.create();
                        
            const front = vec3.create();
            const right = vec3.create();
            const up = vec3.create();
            vec3.scale(front, camera, -1);
            vec3.cross(right, front, [0, 0, 1]);
            vec3.cross(up, right, front);
            vec3.normalize(front, front);
            vec3.normalize(right, right);
            vec3.normalize(up, up);
            
            const rotateAxis = vec3.create();
            const rotateMatrix = mat4.create();
            vec3.zero(rotateAxis);
            vec3.scaleAndAdd(rotateAxis, rotateAxis, right, dir[0]);
            vec3.scaleAndAdd(rotateAxis, rotateAxis, up, dir[1]);

            mat4.fromRotation(rotateMatrix, r * rotateFactor, rotateAxis);
            vec3.transformMat4(newCamera, camera, rotateMatrix);
            return {
                ...state,
                camera: newCamera
            };
        }
        case '@MOVE_CAMERA': {
            const translateFactor = 0.2;
            const {forward} = action;
            const {fractal, params, julia, camera} = state;
            const paramValues = Array(3).fill(0).map((_, i) => i < params.length ? params[i].value : 0) as vec3; // pad to vec3
            const DE = fractalDE_JS(fractal, camera, paramValues, julia[0], julia[1]);
                        
            const newCamera = vec3.create();
            const translate = vec3.create();
            const dir = forward ? 1 : -1;
            const t = dir === -1 ? Math.abs(DE * 0.2) : translateFactor;
            vec3.normalize(translate, camera);
            vec3.scale(translate, translate, dir * t);

            const translationMatrix = mat4.create();
            mat4.fromTranslation(translationMatrix, translate);
            vec3.transformMat4(newCamera, camera, translationMatrix);
            return {
                ...state,
                camera: newCamera
            };
        }
        case '@SET_EPS': {
            const {eps} = state;
            const {increase} = action;
            return {
                ...state,
                eps:  increase ? Math.min(eps / 0.9, 0.01) : Math.max(eps * 0.9, 1e-7)
            } 
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