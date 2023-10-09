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
    neon: boolean;
    camera: vec3;
    front: vec3;
    eps: number;
    ray_multiplier: number;
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
    type: '@TOGGLE_NEON';
    neon: boolean;
} | {
    type: '@MOVE_CAMERA';
    dir: vec3;
} | {
    type: '@ROTATE_CAMERA';
    dir: vec2;
} | {
    type: '@SET_EPS';
    increase: boolean;
} | {
    type: '@SET_RAY_MULTIPLIER';
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
        step: 0.1,
        value: 8
    }],
    julia: [false, [1, 0, 0]],
    color: {
        r: 25,
        g: 94,
        b: 124
    },
    neon: false,
    camera: vec3.fromValues(1, 1, 1.414),
    front: vec3.normalize(vec3.create(), vec3.scale(vec3.create(), vec3.fromValues(1, 1, 1.414), -1)),
    eps: 0.001,
    ray_multiplier: 0.5
}

const defaultMandelBoxSetting: SettingState = {
    fractal: Fractal.MandelBox,
    params: [{
        label: 'scale',
        minValue: -3,
        maxValue: 3,
        step: 0.1,
        value: -1.7
    }, {
        label: 'minR',
        minValue: 0,
        maxValue: 1,
        step: 0.1,
        value: 0.5
    }, {
        label: 'fold',
        minValue: 0,
        maxValue: 2,
        step: 0.1,
        value: 1
    }],
    julia: [false, [0, 0, 0]],
    color: {
        r: 25,
        g: 94,
        b: 124
    },
    neon: false,
    camera: vec3.fromValues(0, 7, 0),
    front: vec3.normalize(vec3.create(), vec3.scale(vec3.create(), vec3.fromValues(0, 7, 0), -1)),
    eps: 0.0025,
    ray_multiplier: 0.5
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
    neon: false,
    camera: vec3.fromValues(3, 0, 0),
    front: vec3.normalize(vec3.create(), vec3.scale(vec3.create(), vec3.fromValues(3, 0, 0), -1)),
    eps: 0.01,
    ray_multiplier: 0.5
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
    neon: false,
    camera: vec3.fromValues(1.5, 1.5, -1.5),
    front: vec3.normalize(vec3.create(), vec3.scale(vec3.create(), vec3.fromValues(1.5, 1.5, -1.5), -1)),
    eps: 0.01,
    ray_multiplier: 0.5
}

const defaultJulia4DSetting: SettingState = {
    fractal: Fractal.Julia4D,
    params: [{
        label: 'power',
        minValue: 2,
        maxValue: 9,
        step: 1,
        value: 2
    }],
    julia: [true, [-0.8, -0.4, 0]],
    color: {
        r: 25,
        g: 94,
        b: 124
    },
    neon: false,
    camera: vec3.fromValues(-1, 1.5, 0),
    front: vec3.normalize(vec3.create(), vec3.scale(vec3.create(), vec3.fromValues(-1, 1.5, 0), -1)),
    eps: 0.0015,
    ray_multiplier: 0.5
}

const defaultSetting = [defaultMandelBulbSetting, defaultMandelBoxSetting, defaultMengerSetting, defaultSierpinskiSetting, defaultJulia4DSetting];
const getSetting = (fractal: Fractal): SettingState  => {
    const targetsetting = defaultSetting[fractal];
    return {
        fractal,
        params: targetsetting.params.map(e => ({...e})),
        julia: [targetsetting.julia[0], [targetsetting.julia[1][0], targetsetting.julia[1][1], targetsetting.julia[1][2]]],
        color: {...targetsetting.color},
        neon: targetsetting.neon,
        camera: vec3.clone(targetsetting.camera),
        front: vec3.clone(targetsetting.front),
        eps: targetsetting.eps,
        ray_multiplier: targetsetting.ray_multiplier
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
        case '@TOGGLE_NEON': {
            const {neon} = action;
            return {...state, neon};
        }
        case '@SET_COLOR': {
            const {color} = action;
            return {...state, color};
        }
        case '@MOVE_CAMERA': {
            const {dir} = action;
            const {fractal, params, julia, camera, front} = state;
            const paramValues = Array(3).fill(0).map((_, i) => i < params.length ? params[i].value : 0) as vec3; // pad to vec3
            const DE = fractalDE_JS(fractal, camera, paramValues, julia[0], julia[1]);
            const translateFactor = 0.2;
            const dist = Math.abs(DE) * translateFactor;

            const newCamera = vec3.create();
            const right = vec3.create();
            const up = vec3.create();
            vec3.cross(right, front, [0, 0, 1]);
            vec3.cross(up, right, front);
            vec3.normalize(right, right);
            vec3.normalize(up, up);
            
            const translate = vec3.create();
            vec3.zero(translate);
            vec3.scaleAndAdd(translate, translate, right, dir[0] * dist);
            vec3.scaleAndAdd(translate, translate, up, dir[1] * dist);
            vec3.scaleAndAdd(translate, translate, front, dir[2] * dist);
            const translationMatrix = mat4.create();
            mat4.fromTranslation(translationMatrix, translate);
            vec3.transformMat4(newCamera, camera, translationMatrix);

            return {
                ...state,
                camera: newCamera
            };
        }
        case '@ROTATE_CAMERA': {
            const {dir} = action;
            const r = vec2.length(dir);
            const rotateFactor = 0.05;
            const {fractal, params, julia, camera, front} = state;
            const paramValues = Array(3).fill(0).map((_, i) => i < params.length ? params[i].value : 0) as vec3; // pad to vec3
            const DE = fractalDE_JS(fractal, camera, paramValues, julia[0], julia[1]);
            const theta = Math.min(Math.abs(DE), 0.04) * r * rotateFactor;
            const newFront = vec3.create();
                        
            const right = vec3.create();
            const up = vec3.create();
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
            mat4.fromRotation(rotateMatrix, theta, rotateAxis);

            vec3.transformMat4(newFront, front, rotateMatrix);
            return {
                ...state,
                front: newFront
            };
        }
        case '@SET_EPS': {
            const {eps} = state;
            const {increase} = action;
            return {
                ...state,
                eps: increase ? Math.min(eps / 0.9, 0.01) : Math.max(eps * 0.9, 1e-7)
            } 
        }
        case '@SET_RAY_MULTIPLIER': {
            const {ray_multiplier} = state;
            const {increase} = action;
            return {
                ...state,
                ray_multiplier: increase ? Math.min(ray_multiplier / 0.9, 1.0) : Math.max(ray_multiplier * 0.9, 0.01)
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