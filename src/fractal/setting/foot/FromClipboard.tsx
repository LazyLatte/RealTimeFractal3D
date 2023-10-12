import {FC, useState} from 'react';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
interface FromClipboardProps {load: (data: Object) => void}
const FromClipboard: FC<FromClipboardProps> = ({load}) => {
    const [errMsg, setErrMsg] = useState('');
    const handleOnClick = async () => {
        const clipBoardData = await navigator.clipboard.readText();
        try{
            const settingData = JSON.parse(clipBoardData);
            load(settingData);
            setErrMsg('');
        }catch(err){
            const result = (err as Error).message;
            setErrMsg('Invalid format');
            console.log(result);
        }
    }
    return (
        <Tooltip title={errMsg}>
            <Button disableRipple color={errMsg ? 'error' : 'primary'} onClick={handleOnClick}>From<br/>Clipboard</Button>
        </Tooltip>
    )
}

export default FromClipboard;