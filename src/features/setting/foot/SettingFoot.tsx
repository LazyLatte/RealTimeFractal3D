import { FC, Dispatch } from 'react'
import Box from '@mui/material/Box';
import ResetButton from './ResetButton';
import FromClipboard from './FromClipboard';
import ToClipboard from './ToClipboard';
import { SettingState, SettingAction } from '..';
interface SettingFootProps {
  setting: SettingState;
  dispatch: Dispatch<SettingAction>;
}
const SettingFoot: FC<SettingFootProps> = ({setting, dispatch}) => {
  const reset = () => dispatch({type: '@RESET'});
  const load = (data: Object) => dispatch({type: '@FROM_CLIPBOARD', data});
  return (
    <Box display='flex' flexDirection='row' justifyContent='space-around' alignItems='center' margin='40px 0'>
        <ResetButton reset={reset}/>
        <FromClipboard load={load}/>
        <ToClipboard setting={setting}/>
    </Box>
  )
}

export default SettingFoot;