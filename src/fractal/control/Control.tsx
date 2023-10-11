import { useState, FC, Dispatch} from 'react';
import { SettingAction } from '../setting';
interface ControlProps {dispatch: Dispatch<SettingAction>}
const Control: FC<ControlProps> = ({dispatch}) => {
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
                zIndex: 99,
                cursor: 'pointer'
            }} 
            tabIndex={0}
            onContextMenu={e => e.preventDefault()}
            onMouseDown={(e) => setEvtButton(e.button)}
            onMouseUp={() => setEvtButton(-1)}
            onClick={(e) => {
                if(document.pointerLockElement){
                    document.exitPointerLock();
                }else{
                    e.currentTarget.requestPointerLock();
                }
            }}
            onMouseMove={(e) => {
                if(document.pointerLockElement){
                    if(e.movementX === 0 && e.movementY === 0) return;
                    dispatch({type: '@ROTATE_CAMERA', dir: [-e.movementY, -e.movementX]})
                }
            }}
            onWheel={(e) => {
                if(evtButton === -1){
                    dispatch({type: '@SET_EPS', increase: e.deltaY > 0}) 
                }else if(evtButton === 2){
                    dispatch({type: '@SET_RAY_MULTIPLIER', increase: e.deltaY > 0}) 
                }
            }}
            onKeyDown={(e)=>{
                switch(e.code){
                    case 'KeyE': {
                        dispatch({type: '@MOVE_CAMERA', dir: [0, 1, 0]})
                        break;
                    }
                    case 'KeyC': {
                        dispatch({type: '@MOVE_CAMERA', dir: [0, -1, 0]})
                        break;
                    }
                    case 'KeyW': {
                        dispatch({type: '@MOVE_CAMERA', dir: [0, 0, 1]})
                        break;
                    }
                    case 'KeyS': {
                        dispatch({type: '@MOVE_CAMERA', dir: [0, 0, -1]})
                        break;
                    }
                    case 'KeyA': {
                        dispatch({type: '@MOVE_CAMERA', dir: [-1, 0, 0]})
                        break;
                    }
                    case 'KeyD': {
                        dispatch({type: '@MOVE_CAMERA', dir: [1, 0, 0]})
                        break;
                    }
                    default: break;
                }
                
            }}
            
        />
    )
}

export default Control;