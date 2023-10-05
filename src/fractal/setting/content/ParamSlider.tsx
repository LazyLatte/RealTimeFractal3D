import {FC} from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Slider from '@mui/material/Slider';
import { Param } from '..';
const paramStep = 0.1;
const marks = [...Array(5).keys()].map((_, i) => ({label: 1 << i, value: 1 << i}));
interface ParamSliderProps {
    param: Param;
    setParam: (value: number) => void;
}
const ParamSlider: FC<ParamSliderProps> = ({param, setParam}) => {
    const {label, minValue, maxValue, value} = param;
    const handleSliderChange = (_: Event, newValue: number | number[]) => {
        if (typeof newValue === 'number') {
            setParam(newValue)
        }
    };

    return (
        <Box margin='12px 0'>
            <Typography id="param-label">
                {label}
            </Typography>
            <Slider
                min={minValue}
                max={maxValue}
                step={paramStep}
                value={value}
                onChange={handleSliderChange}
                valueLabelDisplay="auto"
                marks={marks}
                sx={{
                    width: 300,
                    height: 10,
                }}
            />
        </Box>
      )
}

export default ParamSlider;

