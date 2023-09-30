import { useState, FC, Dispatch, SetStateAction} from 'react';
import Drawer from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import SettingsIcon from '@mui/icons-material/Settings';
import Header from './header';
import Body from './body';
import { RGBColor } from 'react-color';

interface SettingProps {
  color: RGBColor;
  setColor:  Dispatch<SetStateAction<RGBColor>>;
  powerStates: [number, Dispatch<SetStateAction<number>>][]
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
            height: 720,
            backgroundColor: '#eee'
          }
        }}
      >
        <Header onClick={handleDrawerClose}/>
        <Divider/>
        <Body {...props}/>
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