import {FC, useState} from 'react';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import { SettingState } from '..';
interface ToClipboardProps {setting: SettingState}
const ToClipboard: FC<ToClipboardProps> = ({setting}) => {
    const [isCopied, setIsCopied] = useState(false);
    const handleOnClick = () => {
        const camera = [setting.camera[0], setting.camera[1], setting.camera[2]];
        const front = [setting.front[0], setting.front[1], setting.front[2]];
        const julia = [setting.julia[0], setting.julia[1], setting.julia[2]];
        const settingData = JSON.stringify({...setting, camera, front, julia, params: setting.params.map(e => e.value)});
        navigator.clipboard.writeText(settingData);
        setIsCopied(true);
    }
    return (
        <Tooltip title={isCopied ? 'copied!' : ''}>
            <Button disableRipple onClick={handleOnClick} onMouseLeave={() => setIsCopied(false)}>To<br/>Clipboard</Button>
        </Tooltip>
    )
}

export default ToClipboard;