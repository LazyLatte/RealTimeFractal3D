import {FC, Dispatch} from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Slider from '@mui/material/Slider';
import {Fractal, SettingAction} from '..';

import MandelBulbJuliaSliderSetting from '../../../data/mandelbulb/juliaSliderSetting.json';
import MandelBoxJuliaSliderSetting from '../../../data/mandelbox/juliaSliderSetting.json';
import MengerJuliaSliderSetting from '../../../data/menger/juliaSliderSetting.json';
import SierpinskiJuliaSliderSetting from '../../../data/sierpinski/juliaSliderSetting.json';
import Julia4DJuliaSliderSetting from '../../../data/julia4D/juliaSliderSetting.json';

interface JuliaSlidersProps {
    fractal: Fractal;
    julia: number[];
    juliaEnabled: boolean;
    dispatch: Dispatch<SettingAction>;
}

const juliaSliderSetting = [MandelBulbJuliaSliderSetting, MandelBoxJuliaSliderSetting, MengerJuliaSliderSetting, SierpinskiJuliaSliderSetting, Julia4DJuliaSliderSetting] as const;
const JuliaSliders: FC<JuliaSlidersProps> = ({fractal, juliaEnabled, julia, dispatch}) => {
    const sliderSetting = juliaSliderSetting[fractal];
    return (
        <Box margin='12px 0'>
            {sliderSetting.labels.map((label, i) => (
                <Box key={i}>
                    <Typography id="param-label">
                        {label}
                    </Typography>
                    <Slider
                        min={sliderSetting.minValue}
                        max={sliderSetting.maxValue}
                        step={sliderSetting.step}
                        value={julia[i]}
                        onChange={(_: Event, newValue: number | number[]) => {
                            if (typeof newValue === 'number') {
                                dispatch({type: '@SET_JULIA', value: newValue, idx: i});
                            }
                        }}
                        valueLabelDisplay="auto"
                        disabled={!juliaEnabled}
                        sx={{
                            width: 300,
                            height: 10,
                        }}
                    />
                </Box>
            ))}
        </Box>
    )
}

export default JuliaSliders;