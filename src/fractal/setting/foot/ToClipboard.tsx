import {FC, useState} from 'react';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import { SettingState } from '..';
interface ToClipboardProps {setting: SettingState}
const ToClipboard: FC<ToClipboardProps> = ({setting}) => {
    const [isCopied, setIsCopied] = useState(false);
    const handleOnClick = () => {
        const settingData = JSON.stringify({...setting, params: setting.params.map(e => e.value)});
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