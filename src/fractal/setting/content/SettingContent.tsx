import {FC, Dispatch} from 'react';
import Box from '@mui/material/Box';
import FractalSelector from './FractalSelector';
import ParamSlider from './ParamSlider';
import JuliaSliders from './JuliaSliders';
import ColorPicker from './ColorPicker';
import { SettingState, SettingAction } from '..';
interface SettingContentProps {
  setting: SettingState;
  dispatch: Dispatch<SettingAction>;
}

const SettingContent: FC<SettingContentProps> = ({setting, dispatch}) => {
  const {fractal, params, julia, color} = setting;
  const switchFractal = (nextFractal: typeof fractal) => dispatch({type: '@SWITCH_FRACTAL', fractal: nextFractal});
  const toggleJulia = (juliaEnabled: boolean) => dispatch({type: '@TOGGLE_JULIA', juliaEnabled});
  const setJulia = (juliaConst: number, idx: number) => dispatch({type: '@SET_JULIA', juliaConst, idx});
  const setParam = (value: number, idx: number) => dispatch({type: '@SET_PARAM', value, idx})
  const setColor = (newColor: typeof color) => dispatch({type: '@SET_COLOR', color: newColor});
  return (
    <Box display='flex' flexDirection='column' justifyContent='flex-start' alignItems='center' padding='0 40px'>
      <FractalSelector fractal={fractal} switchFractal={switchFractal} juliaEnabled={julia[0]} toggleJulia={toggleJulia}/>
      {params.map((param, idx) => <ParamSlider param={param} setParam={(value: number) => setParam(value, idx)} key={idx}/>)}
      <JuliaSliders julia={julia} setJulia={setJulia}/>
      <ColorPicker color={color} setColor={setColor}/>
    </Box>
  )
}

export default SettingContent