import {FC, Dispatch} from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Slider from '@mui/material/Slider';
import {Fractal, SettingAction} from '..';

import MandelBulbParamSliderSetting from '../../../data/mandelbulb/paramSliderSetting.json';
import MandelBoxParamSliderSetting from '../../../data/mandelbox/paramSliderSetting.json';
import MengerParamSliderSetting from '../../../data/menger/paramSliderSetting.json';
import SierpinskiParamSliderSetting from '../../../data/sierpinski/paramSliderSetting.json';
import Julia4DParamSliderSetting from '../../../data/julia4D/paramSliderSetting.json';

interface ParamSliderProps {
    fractal: Fractal;
    params: number[];
    dispatch: Dispatch<SettingAction>;
}

const sliderSetting = [MandelBulbParamSliderSetting, MandelBoxParamSliderSetting, MengerParamSliderSetting, SierpinskiParamSliderSetting, Julia4DParamSliderSetting] as const;
const ParamSliders: FC<ParamSliderProps> = ({fractal, params, dispatch}) => {
    const paramSliderSetting = sliderSetting[fractal].params;
    return (<>
        {paramSliderSetting.map((p, i) => (
            <Box margin='8px 0' key={i}>
                <Typography id="param-label">
                    {p.label}
                </Typography>
                <Slider
                    min={p.minValue}
                    max={p.maxValue}
                    step={p.step}
                    value={params[i]}
                    onChange={(_: Event, newValue: number | number[]) => {
                        if (typeof newValue === 'number') {
                            dispatch({type: '@SET_PARAM', value: newValue, idx: i});
                        }
                    }}
                    valueLabelDisplay="auto"
                    marks={p.marks.map(e => ({label: e, value: e}))}
                    sx={{
                        width: 300,
                        height: 10,
                    }}
                />
            </Box>
        ))}
    </>);
}

export default ParamSliders;

