import {useReducer} from 'react';
import { vec2, vec3, mat4} from "gl-matrix";
import { Fractal, RgbColor } from './interfaces';
import { LightingInterface, LightingAction} from './advanced/lighting';
import { getFractalDE } from '../shaders';
import MandelBulbParamSliderSetting from '../../data/mandelbulb/paramSliderSetting.json';
import MandelBoxParamSliderSetting from '../../data/mandelbox/paramSliderSetting.json';
import MengerParamSliderSetting from '../../data/menger/paramSliderSetting.json';
import SierpinskiParamSliderSetting from '../../data/sierpinski/paramSliderSetting.json';
import Julia4DParamSliderSetting from '../../data/julia4D/paramSliderSetting.json';

import DefaultMandelBulbSetting from '../../data/mandelbulb/default-setting.json';
import DefaultMandelBoxSetting from '../../data/mandelbox/default-setting.json';
import DefaultMengerSetting from '../../data/menger/default-setting.json';
import DefaultSierpinskiSetting from '../../data/sierpinski/default-setting.json';
import DefaultJulia4DSetting from '../../data/julia4D/default-setting.json';
import Sample_0 from '../../data/mandelbox/sample/1.json';
//import Sample_0 from '../../data/menger/sample/0.json';
import Sample_1 from '../../data/menger/sample/1.json';

interface ClipBoardData {
    fractal: number;
    params: number[];
    juliaEnabled: boolean;
    julia: number[];
    camera: [number, number, number];
    front: [number, number, number];
    eps: number;
    ray_multiplier: number;
    style: {
        color: {r: number, g: number, b: number};
        lighting: LightingInterface;
        orbit_freq: [number, number, number];
        shadow: boolean;
        neon: boolean;
        decay: number; 
    }
}
export type FractalStyle = {
    color: RgbColor;
    lighting: LightingInterface;
    shadow: boolean;
    neon: boolean;
    decay: number;
    orbit_freq: [number, number, number];
}
export type SettingState = {
    fractal: Fractal;
    params: number[];
    juliaEnabled: boolean;
    julia: number[];

    camera: vec3;
    front: vec3;
    eps: number;
    ray_multiplier: number;

    style: FractalStyle;
}

export type SettingAction = {
    type: '@SET_PARAM';
    value: number;
    idx: number;
} | {
    type: '@SET_JULIA';
    value: number;
    idx: number;
} | {
    type: '@TOGGLE_JULIA';
    juliaEnabled: boolean;
} | {
    type: '@SET_COLOR';
    color: RgbColor;
} | {
    type: '@SET_ORBIT_FREQUENCY';
    value: number;
    idx: number;
} | {
    type: '@TOGGLE_NEON';
    neon: boolean;
} | {
    type: '@TOGGLE_SHADOW';
    shadow: boolean;
} | {
    type: '@SET_DECAY';
    decay: number;
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
} | LightingAction;

const sliderSetting = [MandelBulbParamSliderSetting, MandelBoxParamSliderSetting, MengerParamSliderSetting, SierpinskiParamSliderSetting, Julia4DParamSliderSetting] as const;
const defaultParams = [DefaultMandelBulbSetting, DefaultMandelBoxSetting, DefaultMengerSetting, DefaultSierpinskiSetting, DefaultJulia4DSetting] as const;
const getSetting = (fractal: Fractal): SettingState  => {
    const targetDefaultParams = defaultParams[fractal];
    const {params, juliaEnabled, neon, eps, ray_multiplier} = targetDefaultParams;
    const camera = [targetDefaultParams.camera[0], targetDefaultParams.camera[1], targetDefaultParams.camera[2]] as vec3;
    const front = [-targetDefaultParams.camera[0], -targetDefaultParams.camera[1], -targetDefaultParams.camera[2]] as vec3;
    const julia = targetDefaultParams.julia;
    const color = {...targetDefaultParams.color};
    const lighting: LightingInterface = {
        enabled: true,
        lights: [{
            pos: camera,
            color
        }],
        shadow: 16.0
    }
    vec3.normalize(front, front);
    return {fractal, params, juliaEnabled, julia, camera, front, eps, ray_multiplier, style: {color, lighting, neon, shadow: false, decay: 0, orbit_freq: [1.0, 1.0, 1.0]}};
}
const samples = [Sample_0];
const fromSample = (idx: number): SettingState => {
    const targetSample = samples[idx];
    const {fractal, params, juliaEnabled, shadow, neon, color, decay, eps, ray_multiplier} = targetSample;
    const camera = [targetSample.camera[0], targetSample.camera[1], targetSample.camera[2]] as vec3;
    const front = [targetSample.front[0], targetSample.front[1], targetSample.front[2]] as vec3;
    const julia = targetSample.julia;
    const lighting: LightingInterface = {
        enabled: true,
        lights: [{
            pos: camera,
            color
        }],
        shadow: 16.0
    }
    return {fractal, params, juliaEnabled, julia, camera, front, eps, ray_multiplier, 
        style: {color, lighting, neon, shadow, decay, orbit_freq: [targetSample.orbit_freq[0], targetSample.orbit_freq[1], targetSample.orbit_freq[2]]}};
}


const reducer = (state: SettingState, action: SettingAction): SettingState => {
    switch(action.type){
        case '@SET_PARAM': {
            const {value, idx} = action;
            const newParams = [...state.params];
            newParams[idx] = value;
            return {...state, params: newParams};
        }
        case '@SET_JULIA': {
            const {value, idx} = action;
            const newJulia = [...state.julia];
            newJulia[idx] = value;
            return {...state, julia: newJulia};
        }
        case '@SET_ORBIT_FREQUENCY': {
            const {value, idx} = action;
            state.style.orbit_freq[idx] = value;
            return {...state, style: {...state.style, orbit_freq: [state.style.orbit_freq[0], state.style.orbit_freq[1], state.style.orbit_freq[2]]}};
        }
        case '@TOGGLE_JULIA': return {...state, juliaEnabled: action.juliaEnabled}
        case '@TOGGLE_SHADOW': return {...state, style: {...state.style, shadow: action.shadow}};
        case '@TOGGLE_NEON': return {...state, style: {...state.style, neon: action.neon}};
        case '@SET_COLOR': return {...state, style: {...state.style, color: action.color}};
        case '@SET_DECAY': return {...state, style: {...state.style, decay: action.decay}};
        
        case '@MOVE_CAMERA': {
            const {dir} = action;
            const {fractal, params, juliaEnabled, julia, camera, front} = state;
            const DE = getFractalDE(fractal, camera, params, juliaEnabled, julia);
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
        case '@TOGGLE_LIGHTING': {
            const newState: SettingState = JSON.parse(JSON.stringify(state));
            newState.style.lighting.enabled = action.enabled;
            return newState;
        }
        case '@ADD_LIGHT': {
            const newState: SettingState = JSON.parse(JSON.stringify(state));
            newState.style.lighting.lights.push({...action});
            return newState;
        }
        case '@DELETE_LIGHT': {
            const newState: SettingState = JSON.parse(JSON.stringify(state));
            newState.style.lighting.lights = newState.style.lighting.lights.filter((_, i) => i != action.idx);
            return newState;
        }
        case '@UPDATE_SHADOW': {
            const newState: SettingState = JSON.parse(JSON.stringify(state));
            newState.style.lighting.shadow = action.shadow;
            return newState;
        }
        case '@SWITCH_FRACTAL': return getSetting(action.fractal);
        case '@RESET': return getSetting(state.fractal);
        case '@FROM_SAMPLE': return fromSample(action.idx);
        case '@FROM_CLIPBOARD': {
            const {data} = action;
            const {fractal, params, camera, front, juliaEnabled, julia, eps, ray_multiplier, style} = data as ClipBoardData;
            const {neon, color, decay, orbit_freq} = style;
            if(!Number.isInteger(fractal) || !Array.isArray(params) || !Array.isArray(camera) || camera.length !== 3 || !Array.isArray(front) || front.length !== 3 || 
            !Array.isArray(julia) || (julia.length !== 3 && julia.length !== 4) || typeof juliaEnabled !== 'boolean' || typeof neon !== 'boolean' || typeof eps !== 'number' || typeof ray_multiplier !== 'number' ||
            typeof color !== 'object' || typeof color.r !== 'number' || typeof color.g !== 'number' || typeof color.b !== 'number') throw Error('Invalid setting');
            if(fractal >= defaultParams.length || fractal < 0) throw Error('No such fractal');
            const targetFractalSliderSetting = sliderSetting[fractal];
            if(params.length !== targetFractalSliderSetting.params.length) throw Error('Params number not match');
            params.forEach((e, i) => {
                if(typeof e !== 'number' || e > targetFractalSliderSetting.params[i].maxValue || e < targetFractalSliderSetting.params[i].minValue){
                    throw Error('Invalid param value');
                }
            });
            camera.forEach(v => {
                if(typeof v !== 'number') throw Error('Invalid camera position');
            });
            front.forEach(v => {
                if(typeof v !== 'number') throw Error('Invalid front direction');
            });
            julia.forEach(v => {
                if(typeof v !== 'number') throw Error('Invalid julia vector');
            });
            if(decay < 0) throw Error('Invalid decay coefficient');
            color.r = Math.min(Math.max(color.r, 0), 255);
            color.g = Math.min(Math.max(color.g, 0), 255);
            color.b = Math.min(Math.max(color.b, 0), 255);
            return {fractal, params, camera, front, juliaEnabled, julia, eps, ray_multiplier, style};
        }
        default: return state;
    }
}

export const useSettingReducer = () => useReducer(reducer, fromSample(0)/*getSetting(Fractal.Menger)*/);