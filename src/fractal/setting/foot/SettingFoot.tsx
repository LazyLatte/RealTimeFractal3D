import { FC, Dispatch } from 'react'
import Box from '@mui/material/Box';
import ResetButton from './ResetButton';
import SaveButton from './SaveButton';
import { SettingAction } from '..';
interface SettingFootProps {
  draw: () => HTMLCanvasElement; 
  dispatch: Dispatch<SettingAction>;
}
const SettingFoot: FC<SettingFootProps> = ({draw, dispatch}) => {
  const reset = () => dispatch({type: '@RESET'});
  const test_function = () => dispatch({type: '@FROM_SAMPLE', idx: 1});
  return (
    <Box display='flex' flexDirection='row' justifyContent='space-around' alignItems='center' margin='40px 0'>
        <ResetButton reset={test_function}/>
        <SaveButton draw={draw}/>
    </Box>
  )
}

export default SettingFoot;