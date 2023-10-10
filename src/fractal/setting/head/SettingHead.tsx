import {FC} from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';

interface SettingHeadProps {onClick: () => void}
const SettingHead: FC<SettingHeadProps> = ({onClick}) => {
  return (
    <Box display='flex' justifyContent='flex-end' alignItems='center'>
        <IconButton onClick={onClick}>
            <ChevronLeftIcon fontSize='large'/>
        </IconButton>
    </Box>
  )
}

export default SettingHead;