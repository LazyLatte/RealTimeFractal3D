import IconButton from '@mui/material/IconButton';
import DownloadIcon from '@mui/icons-material/Download';
const SaveButton = () => {
    const saveImg = () => {
        const cvs = document.getElementById('fractal-canvas') as HTMLCanvasElement;
        if(cvs){
            var link = document.createElement('a');
            link.download = 'fractal.png';
            link.href = cvs.toDataURL()
            link.click();
        }
    }
    return (
        <IconButton aria-label="save-img" color='secondary' onClick={saveImg} >
            <DownloadIcon sx={{fontSize: '48px'}}/>
        </IconButton>
    )
}

export default SaveButton;