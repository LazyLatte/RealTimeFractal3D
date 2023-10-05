import { useState, FC, ReactNode} from 'react';
import Drawer from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import SettingsIcon from '@mui/icons-material/Settings';
import Header from './header';

interface SettingProps {children: ReactNode}
const Setting: FC<SettingProps> = ({children}) => {
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
        <Header onClick={handleDrawerClose}/>
        <Divider/>
        {children}
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