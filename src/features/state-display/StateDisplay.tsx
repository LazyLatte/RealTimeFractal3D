import {FC} from 'react';
import { vec3 } from 'gl-matrix';
interface StateDisplayProps {camera: vec3, eps: number, ray_multiplier: number};
const digits = 5;
const StateDisplay: FC<StateDisplayProps> = ({camera, eps, ray_multiplier}) => {
  return (
    <div style={{position: 'absolute', top: 8, right: 8, fontSize: '24px', color: 'white', textAlign: 'right'}}>
        <div>ray_mul: {ray_multiplier.toFixed(4)}</div>
        <div>eps: {eps.toFixed(7)}</div>
        <div>x: {camera[0].toFixed(digits)}</div>
        <div>y: {camera[1].toFixed(digits)}</div>
        <div>z: {camera[2].toFixed(digits)}</div>
    </div>
  )
}

export default StateDisplay;