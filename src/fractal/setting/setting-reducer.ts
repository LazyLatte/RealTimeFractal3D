import {useReducer} from 'react';
import { vec2, vec3, mat4 } from "gl-matrix";
import { Fractal, Param, RGBColor } from './interfaces';
import { fractalDE_JS } from '../webgl';
import DefaultMandelBulbSetting from '../../data/mandelbulb.json';
import DefaultMandelBoxSetting from '../../data/mandelbox.json';
import DefaultMengerSetting from '../../data/menger.json';
import DefaultSierpinskiSetting from '../../data/sierpinski.json';
import DefaultJulia4DSetting from '../../data/julia4D.json';
export type SettingState = {
    fractal: Fractal;
    params: Param[];
    juliaEnabled: boolean;
    julia: vec3;
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
} | {
    type: '@RESET';
}



const defaultSetting = [DefaultMandelBulbSetting, DefaultMandelBoxSetting, DefaultMengerSetting, DefaultSierpinskiSetting, DefaultJulia4DSetting];
const getSetting = (fractal: Fractal): SettingState  => {
    const targetsetting = defaultSetting[fractal];
    const {params, juliaEnabled, neon, eps, ray_multiplier} = targetsetting;
    const color = {...targetsetting.color};
    const julia = vec3.fromValues(targetsetting.julia[0], targetsetting.julia[1], targetsetting.julia[2]);
    const camera = vec3.fromValues(targetsetting.camera[0], targetsetting.camera[1], targetsetting.camera[2]);
    const front = vec3.create();
    vec3.normalize(front, vec3.scale(front, camera, -1));
    return {fractal, juliaEnabled, julia, color, neon, camera, front, eps, ray_multiplier, params: params.map(e => ({...e}))}
}
const reducer = (state: SettingState, action: SettingAction): SettingState => {
    switch(action.type){
        case '@SET_PARAM': {
            const {value, idx} = action;
            return {...state, params: state.params.map((e, i) => i===idx ? {...e, value} : e) }
        }
        case '@SET_JULIA': {
            const {julia} = state;
            const {juliaConst, idx} = action;
            const newJulia = [julia[0], julia[1], julia[2]] as vec3;
            newJulia[idx] = juliaConst;
            return {...state, julia: newJulia}
        }
        case '@TOGGLE_JULIA': return {...state, juliaEnabled: action.juliaEnabled}
        case '@TOGGLE_NEON': return {...state, neon: action.neon};
        case '@SET_COLOR': return {...state, color: {...action.color}};
        case '@MOVE_CAMERA': {
            const {dir} = action;
            const {fractal, params, juliaEnabled, julia, camera, front} = state;
            const paramValues = Array(3).fill(0).map((_, i) => i < params.length ? params[i].value : 0) as vec3; // pad to vec3
            const DE = fractalDE_JS(fractal, camera, paramValues, juliaEnabled, julia);
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

            return {...state, camera: newCamera};
        }
        case '@ROTATE_CAMERA': {
            const {dir} = action;
            const r = vec2.length(dir);
            const rotateFactor = 0.05;
            const {fractal, params, juliaEnabled, julia, camera, front} = state;
            const paramValues = Array(3).fill(0).map((_, i) => i < params.length ? params[i].value : 0) as vec3; // pad to vec3
            const DE = fractalDE_JS(fractal, camera, paramValues, juliaEnabled, julia);
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
        case '@SWITCH_FRACTAL': return getSetting(action.fractal);
        case '@RESET': return getSetting(state.fractal);
        default: return state;
    }
}

export const useSettingReducer = () => useReducer(reducer, getSetting(Fractal.MandelBulb));