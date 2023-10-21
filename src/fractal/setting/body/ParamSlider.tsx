import {FC} from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Slider from '@mui/material/Slider';
import { Param } from '..';

interface ParamSliderProps {
    param: Param;
    setParam: (value: number) => void;
}
const ParamSlider: FC<ParamSliderProps> = ({param, setParam}) => {
    const {label, minValue, maxValue, step, marks, value} = param;
    const handleSliderChange = (_: Event, newValue: number | number[]) => {
        if (typeof newValue === 'number') {
            setParam(newValue)
        }
    };

    return (
        <Box margin='8px 0'>
            <Typography id="param-label">
                {label}
            </Typography>
            <Slider
                min={minValue}
                max={maxValue}
                step={step}
                value={value}
                onChange={handleSliderChange}
                valueLabelDisplay="auto"
                marks={marks.map(e => ({label: e, value: e}))}
                sx={{
                    width: 300,
                    height: 10,
                }}
            />
        </Box>
      )
}

export default ParamSlider;

