import { FC } from 'react';
import IconButton from '@mui/material/IconButton';
import DownloadIcon from '@mui/icons-material/Download';
interface SaveButtonProps {draw: () => HTMLCanvasElement}
const SaveButton: FC<SaveButtonProps> = ({draw}) => {
    const saveImg = () => {
        const cvs = draw();
        var link = document.createElement('a');
        link.download = 'fractal.png';
        link.href = cvs.toDataURL()
        link.click();
    }
    return (
        <IconButton aria-label="save-img" color='secondary' onClick={saveImg} >
            <DownloadIcon sx={{fontSize: '48px'}}/>
        </IconButton>
    )
}

export default SaveButton;