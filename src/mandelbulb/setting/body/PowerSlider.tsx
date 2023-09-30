import { useState, FC, Dispatch, SetStateAction, ChangeEvent} from 'react';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import Slider from '@mui/material/Slider';

const minPower = 0;
const maxPower = 16;
const powerStep = 0.1;
const marks = [...Array(5).keys()].map((_, i) => ({label: 1 << i, value: 1 << i}));
interface PowerSliderProps {
    initialPower: number;
    powerState: [number, Dispatch<SetStateAction<number>>];
}
const PowerSlider: FC<PowerSliderProps> = ({initialPower, powerState}) => {
    const [power, setPower] = powerState;
    const enabled = power >= 0;
    const defaultPower = Math.max(initialPower, 0);
    const [sliderPower, setSliderPower] = useState(defaultPower);
    

    const handleCheckboxChange = (event: ChangeEvent<HTMLInputElement>, checked: boolean) => setPower(checked ? sliderPower : -1);
    const handleSliderChange = (event: Event, newValue: number | number[]) => {
        if (typeof newValue === 'number') {
            setPower(newValue);
            setSliderPower(newValue);
        }
    };

    return (
        <Box display='flex' flexDirection='row' justifyContent='space-around' alignItems='center' margin='12px 0'>
            <Checkbox 
                checked={enabled}
                onChange={handleCheckboxChange}
                sx={{
                    position: 'relative', 
                    bottom: 10, 
                    marginRight: '18px'
                }}
            />
            <Slider
                min={minPower}
                max={maxPower}
                step={powerStep}
                defaultValue={defaultPower}
                onChange={handleSliderChange}
                valueLabelDisplay="auto"
                marks={marks}
                disabled={!enabled}
                sx={{
                    width: 300,
                    height: 10,
                }}
            />
        </Box>
      )
}

export default PowerSlider;