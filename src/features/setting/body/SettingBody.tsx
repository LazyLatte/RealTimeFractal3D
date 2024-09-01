import {FC, Dispatch} from 'react';
import Box from '@mui/material/Box';
import FractalSelector from './FractalSelector';
import ParamSliders from './ParamSliders';
import JuliaSliders from './JuliaSliders';
import ShadingOptions from './ShadingOptions';
import { SettingState, SettingAction } from '..';
interface SettingBodyProps {
  setting: SettingState;
  dispatch: Dispatch<SettingAction>;
}

const SettingBody: FC<SettingBodyProps> = ({setting, dispatch}) => {  
  return (
    <Box display='flex' flexDirection='column' justifyContent='flex-start' alignItems='center' padding='0 40px'>
      <FractalSelector {...setting} dispatch={dispatch}/>
      <ParamSliders {...setting} dispatch={dispatch} />
      <JuliaSliders {...setting} dispatch={dispatch}/>
      <ShadingOptions setting={setting} dispatch={dispatch}/>
    </Box>
  )
}

export default SettingBody;