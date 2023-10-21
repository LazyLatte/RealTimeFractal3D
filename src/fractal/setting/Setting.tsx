import { useState, FC, Dispatch} from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Drawer from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import SettingsIcon from '@mui/icons-material/Settings';
import SettingHead from './head';
import SettingBody from './body';
import SettingFoot from './foot';
import { SettingState, SettingAction } from '.';
interface SettingProps {
  setting: SettingState;
  dispatch: Dispatch<SettingAction>;
}
const Setting: FC<SettingProps> = (props) => {
  const [open, setOpen] = useState(false);
  const handleOpenDrawer = () => setOpen(true);
  const handleDrawerClose = () => setOpen(false);
  return (
    <>
      <Drawer 
        variant='persistent'
        anchor='left'
        open={open}
        hideBackdrop
        sx={{
          position: 'absolute',
          zIndex: 999,
        }}
        PaperProps={{
          sx: {
            backgroundColor: '#eee'
          }
        }}
      >
        <SettingHead onClick={handleDrawerClose}/>
        <Divider/>
        <SettingBody {...props}/>
        <SettingFoot {...props}/>
        <Box display='flex' flexDirection='row' justifyContent='space-around' alignItems='center'>
          <Button sx={{fontSize: '8px'}} onClick={()=>props.dispatch({type: '@FROM_SAMPLE', idx: 0})}>sample 0-red</Button>
          <Button sx={{fontSize: '8px'}} onClick={()=>props.dispatch({type: '@FROM_SAMPLE', idx: 1})}>sample 0-blue</Button>
        </Box>
      </Drawer>
      <IconButton 
        aria-label="setting" 
        onClick={handleOpenDrawer}
        sx={{
          position: 'absolute', 
          top: 8, 
          left: 8, 
          zIndex: 99
        }} 
      >
        <SettingsIcon sx={{fontSize: '48px', color: 'ghostwhite'}}/>
      </IconButton>
    </>
  )
}

export default Setting;