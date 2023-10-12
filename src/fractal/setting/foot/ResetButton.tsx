import {FC} from 'react';
import IconButton from '@mui/material/IconButton';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
interface ResetButtonProps {reset: () => void;}
const ResetButton: FC<ResetButtonProps> = ({reset}) => {
  return (
    <IconButton aria-label="reset" color='primary' onClick={reset}>
        <RestartAltIcon sx={{fontSize: '48px'}}/>
    </IconButton>
  )
}

export default ResetButton;