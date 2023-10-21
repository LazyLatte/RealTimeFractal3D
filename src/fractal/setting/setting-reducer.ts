import {useReducer} from 'react';
import { vec2, vec3, mat4 } from "gl-matrix";
import { Fractal, Param, RgbColor } from './interfaces';
import { fractalDE_JS } from '../webgl';
import DefaultMandelBulbSetting from '../../data/default-setting/mandelbulb.json';
import DefaultMandelBoxSetting from '../../data/default-setting/mandelbox.json';
import DefaultMengerSetting from '../../data/default-setting/menger.json';
import DefaultSierpinskiSetting from '../../data/default-setting/sierpinski.json';
import DefaultJulia4DSetting from '../../data/default-setting/julia4D.json';
import Sample_0 from '../../data/samples/0/0.json';
import Sample_1 from '../../data/samples/1/1.json';

interface ClipBoardData {
    fractal: number;
    params: number[];
    juliaEnabled: boolean;
    julia: [number, number, number];
    color: {r: number, g: number, b: number};
    neon: boolean;
    decay: number;
    fog: number;
    camera: [number, number, number];
    front: [number, number, number];
    eps: number;
    ray_multiplier: number;
}

export type SettingState = {
    fractal: Fractal;
    params: Param[];
    juliaEnabled: boolean;
    julia: vec3;
    color: RgbColor;
    neon: boolean;
    decay: number;
    fog: number;
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
    color: RgbColor;
} | {
    type: '@TOGGLE_NEON';
    neon: boolean;
} | {
    type: '@SET_DECAY';
    decay: number;
} | {
    type: '@SET_FOG';
    fog: number;
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
} | {
    type: '@FROM_SAMPLE';
    idx: number;
} | {
    type: '@FROM_CLIPBOARD';
    data: Object;
}

const defaultSetting = [DefaultMandelBulbSetting, DefaultMandelBoxSetting, DefaultMengerSetting, DefaultSierpinskiSetting, DefaultJulia4DSetting] as const;
const getSetting = (fractal: Fractal): SettingState  => {
    const targetsetting = defaultSetting[fractal];
    const {params, juliaEnabled, neon, eps, ray_multiplier} = targetsetting;
    const camera = [targetsetting.camera[0], targetsetting.camera[1], targetsetting.camera[2]] as vec3;
    const front = [-targetsetting.camera[0], -targetsetting.camera[1], -targetsetting.camera[2]] as vec3;
    const julia = [targetsetting.julia[0], targetsetting.julia[1], targetsetting.julia[2]] as vec3;
    const color = {...targetsetting.color};
    vec3.normalize(front, front);
    return {fractal, juliaEnabled, julia, color, neon, decay: 0, fog: 0, camera, front, eps, ray_multiplier, params: params.map(e => ({...e}))}
}
const samples = [Sample_0, Sample_1];
const fromSample = (idx: number): SettingState => {
    const targetSample = samples[idx];
    const {fractal, params, juliaEnabled, neon, color, decay, fog, eps, ray_multiplier} = targetSample;
    const targetSetting = defaultSetting[fractal];
    const camera = [targetSample.camera[0], targetSample.camera[1], targetSample.camera[2]] as vec3;
    const front = [targetSample.front[0], targetSample.front[1], targetSample.front[2]] as vec3;
    const julia = [targetSample.julia[0], targetSample.julia[1], targetSample.julia[2]] as vec3;
    return {fractal, params: targetSetting.params.map((e, i) => ({...e, value: params[i]})), camera, front, juliaEnabled, julia, neon, color, decay, fog, eps, ray_multiplier};
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
        case '@SET_DECAY': return {...state, decay: action.decay};
        case '@SET_FOG': return {...state, fog: action.fog};
        case '@MOVE_CAMERA': {
            const {dir} = action;
            const {fractal, params, juliaEnabled, julia, camera, front} = state;
            const DE = fractalDE_JS(fractal, camera, params.map(e => e.value), juliaEnabled, julia);
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
            const {front} = state;
            const r = vec2.length(dir);
            const rotateFactor = 0.0008;
            const z_axis = [0, 0, dir[0] > 0 ? 1 : -1] as vec3;
            const max_theta =  Math.acos(vec3.dot(front, z_axis) / vec3.length(front)) - 0.52359877559; //0.52359877559 = pi / 6
            const theta = Math.min(r * rotateFactor, max_theta);
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

            return {...state, front: newFront};
        }
        case '@SET_EPS': {
            const {eps} = state;
            const {increase} = action;
            return {...state, eps: increase ? Math.min(eps / 0.9, 0.01) : Math.max(eps * 0.9, 1e-7)} 
        }
        case '@SET_RAY_MULTIPLIER': {
            const {ray_multiplier} = state;
            const {increase} = action;
            return {...state, ray_multiplier: increase ? Math.min(ray_multiplier / 0.9, 1.0) : Math.max(ray_multiplier * 0.9, 0.01)}
        }
        case '@SWITCH_FRACTAL': return getSetting(action.fractal);
        case '@RESET': return getSetting(state.fractal);
        case '@FROM_SAMPLE': return fromSample(action.idx);
        case '@FROM_CLIPBOARD': {
            const {data} = action;
            const {fractal, params, camera, front, juliaEnabled, julia, neon, color, decay, fog, eps, ray_multiplier} = data as ClipBoardData;
            if(!Number.isInteger(fractal) || !Array.isArray(params) || !Array.isArray(camera) || camera.length !== 3 || !Array.isArray(front) || front.length !== 3 || 
            !Array.isArray(julia) || julia.length !== 3 || typeof juliaEnabled !== 'boolean' || typeof neon !== 'boolean' || typeof eps !== 'number' || typeof ray_multiplier !== 'number' ||
            typeof color !== 'object' || typeof color.r !== 'number' || typeof color.g !== 'number' || typeof color.b !== 'number') throw Error('Invalid setting');
            if(fractal >= defaultSetting.length || fractal < 0) throw Error('No such fractal');
            const targetFractalDefaultSetting = defaultSetting[fractal];
            if(params.length !== targetFractalDefaultSetting.params.length) throw Error('Params number not match');
            params.forEach((e, i) => {
                if(typeof e !== 'number' || e > targetFractalDefaultSetting.params[i].maxValue || e < targetFractalDefaultSetting.params[i].minValue){
                    throw Error('Invalid param value');
                }
            });
            for(let i=0; i<3; i++){
                if(typeof camera[i] !== 'number') throw Error('Invalid camera position');
                if(typeof front[i] !== 'number') throw Error('Invalid camera direction');
                if(typeof julia[i] !== 'number') throw Error('Invalid julia vector');
            };
            if(decay < 0) throw Error('Invalid decay coefficient');
            if(fog < 0) throw Error('Invalid fog density');
            color.r = Math.min(Math.max(color.r, 0), 255);
            color.g = Math.min(Math.max(color.g, 0), 255);
            color.b = Math.min(Math.max(color.b, 0), 255);
            return {fractal, params: targetFractalDefaultSetting.params.map((e, i) => ({...e, value: params[i]})), camera, front, juliaEnabled, julia, neon, color, decay, fog, eps, ray_multiplier};
        }
        default: return state;
    }
}

export const useSettingReducer = () => useReducer(reducer, getSetting(Fractal.MandelBulb));