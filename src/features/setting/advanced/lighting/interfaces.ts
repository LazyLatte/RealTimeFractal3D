import { vec3 } from "gl-matrix";
import { RgbColor } from "react-colorful";

type Light = {
    pos: vec3;
    color: RgbColor;
}

export interface LightingInterface {
    enabled: boolean;
    lights:  Light[];
    shadow: number;
}

interface ToggleLightingAction {
    type: "@TOGGLE_LIGHTING";
    enabled: boolean;
}

interface AddLightAction {
    type: "@ADD_LIGHT";
    pos: vec3;
    color: RgbColor;
}

interface DeleteLightAction {
    type: "@DELETE_LIGHT";
    idx: number;
}

interface UpdateShadowAction {
    type: "@UPDATE_SHADOW";
    shadow: number;
}

export type LightingAction = ToggleLightingAction | AddLightAction | DeleteLightAction | UpdateShadowAction;