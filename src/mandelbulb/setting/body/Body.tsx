import {FC, Dispatch, SetStateAction} from 'react';
import Box from '@mui/material/Box';
import Formula from './Formula';
import PowerSlider from './PowerSlider';
import ColorPicker from './ColorPicker';
import { RGBColor } from 'react-color';
import { initPowers } from '../../init';
interface BodyProps {
    color: RGBColor;
    setColor:  Dispatch<SetStateAction<RGBColor>>;
    powerStates: [number, Dispatch<SetStateAction<number>>][]
}

const Body: FC<BodyProps> = ({color, setColor, powerStates}) => {
  return (
    <Box display='flex' flexDirection='column' justifyContent='flex-start' alignItems='center' padding='0 40px'>
        <Formula powers={powerStates.map(e => e[0])}/>
        {powerStates.map((state, i) => <PowerSlider initialPower={initPowers[i]} powerState={state} key={i}/>)}
        <ColorPicker color={color} setColor={setColor}/>
    </Box>
  )
}

export default Body