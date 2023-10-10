import { FC, Dispatch } from 'react'
import Box from '@mui/material/Box';
import ResetButton from './ResetButton';
import SaveButton from './SaveButton';
import { SettingAction } from '..';
interface SettingFootProps {dispatch: Dispatch<SettingAction>;}
const SettingFoot: FC<SettingFootProps> = ({dispatch}) => {
  const reset = () => dispatch({type: '@RESET'})
  return (
    <Box display='flex' flexDirection='row' justifyContent='space-around' alignItems='center' margin='40px 0'>
        <ResetButton reset={reset}/>
        <SaveButton/>
    </Box>
  )
}

export default SettingFoot;