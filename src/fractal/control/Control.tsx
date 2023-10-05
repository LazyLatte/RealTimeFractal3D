import { useState,  FC, Dispatch, SetStateAction} from 'react';
import { vec3, mat4 } from 'gl-matrix';

interface ControlProps {
    fractalDE: (p: vec3) => number;
    setCamera:  Dispatch<SetStateAction<vec3>>;
    setEps: Dispatch<SetStateAction<number>>;
}
const rotateFactor = 0.005;
const translateFactor = 0.2//0.02;
const Control: FC<ControlProps> = ({fractalDE, setCamera, setEps}) => {
    const [evtButton, setEvtButton] = useState(-1);
    return (
        <div 
            style={{
                position: 'absolute', 
                top: 0, 
                right: 0, 
                bottom: 0, 
                left: 0, 
                backgroundColor: 'transparent',
                zIndex: 99
            }} 
            onContextMenu={e => e.preventDefault()}
            onMouseDown={(e) => setEvtButton(e.button)}
            onMouseUp={() => setEvtButton(-1)}
            onMouseMove={(e) => {
                if(evtButton === 0){
                    if( e.movementX === 0 &&  e.movementY === 0) return;
                    const screenRotateAxis = [-e.movementY, -e.movementX];
                    const r = Math.sqrt(e.movementX * e.movementX + e.movementY * e.movementY);
                    setCamera(prev => {
                        const newCamera = vec3.create();
                        
                        const front = vec3.create();
                        const right = vec3.create();
                        const up = vec3.create();
                        vec3.scale(front, prev, -1);
                        vec3.cross(right, front, [0, 0, 1]);
                        vec3.cross(up, right, front);
                        vec3.normalize(front, front);
                        vec3.normalize(right, right);
                        vec3.normalize(up, up);
                        
                        const rotateAxis = vec3.create();
                        const rotateMatrix = mat4.create();
                        vec3.zero(rotateAxis);
                        vec3.scaleAndAdd(rotateAxis, rotateAxis, right, screenRotateAxis[0]);
                        vec3.scaleAndAdd(rotateAxis, rotateAxis, up, screenRotateAxis[1]);

                        mat4.fromRotation(rotateMatrix, r * rotateFactor, rotateAxis);
                        vec3.transformMat4(newCamera, prev, rotateMatrix);
                        return newCamera;
                    })
                }
            }}
            onWheel={(e) => {
                if(evtButton === -1){
                    setCamera(prev => {
                        const DE = fractalDE(prev);
                        
                        const newCamera = vec3.create();
                        const translate = vec3.create();
                        const dir = e.deltaY > 0 ? 1 : -1;
                        const t = dir === -1 ? Math.abs(DE * 0.2) : translateFactor;
                        vec3.normalize(translate, prev);
                        vec3.scale(translate, translate, dir * t);
    
                        const translationMatrix = mat4.create();
                        mat4.fromTranslation(translationMatrix, translate);
                        vec3.transformMat4(newCamera, prev, translationMatrix);
                        return newCamera;
                    })
                }else if(evtButton === 2){
                    // eps could not be lower than 3e-8
                    setEps(prev => e.deltaY > 0 ? Math.min(prev / 0.9, 0.01) : Math.max(prev * 0.9, 1e-7))   
                }
            }}
        />
    )
}

export default Control;