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
                zIndex: 99
            }} 
            onContextMenu={e => e.preventDefault()}
            onMouseDown={(e) => setEvtButton(e.button)}
            onMouseUp={() => setEvtButton(-1)}
            onMouseMove={(e) => {
                if(evtButton === 0){
                    if( e.movementX === 0 && e.movementY === 0) return;
                    dispatch({type: '@ROTATE_CAMERA', dir: [-e.movementY, -e.movementX]})
                }
            }}
            onWheel={(e) => {
                if(evtButton === -1){
                    dispatch({type: '@MOVE_CAMERA', forward: e.deltaY > 0})
                }else if(evtButton === 2){
                    dispatch({type: '@SET_EPS', increase: e.deltaY > 0}) 
                }
            }}
        />
    )
}

export default Control;