import { FC, ChangeEvent, Dispatch } from 'react';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import Slider from '@mui/material/Slider';
import Option from './Option';
import { RgbColorPicker , RgbColor} from "react-colorful";
import { SettingState, SettingAction } from '..';
interface ShadingOptionsProps {
    setting: SettingState;
    dispatch: Dispatch<SettingAction>;
}
const SliderStyle = {
    width: 80,
    height: 8,
    "& .MuiSlider-thumb": {
        width: 16,
        height: 16
    }
}
const ShadingOptions: FC<ShadingOptionsProps> = ({setting, dispatch}) => {
    const {style} = setting;
    const handleCheckboxChange = (_: ChangeEvent<HTMLInputElement>, checked: boolean) => dispatch({type: '@TOGGLE_NEON', neon: checked});
    const handleOnColorChange = (newColor: RgbColor) => dispatch({type: '@SET_COLOR', color: newColor});
    const handleDecaySliderChange = (_: Event, newValue: number | number[]) => typeof newValue === 'number' && dispatch({type: '@SET_DECAY', decay: newValue});
    const handleFogSliderChange = (_: Event, newValue: number | number[]) => typeof newValue === 'number' && dispatch({type: '@SET_FOG', fog: newValue});
    return (
        <Box display='flex' flexDirection='row' justifyContent='flex-start' alignItems='flex-start' sx={{width: 300, marginTop: '20px'}}>
            <RgbColorPicker color={style.color} onChange={handleOnColorChange} style={{width: 150}}/>
            <Box display='flex' flexDirection='column' justifyContent='flex-start' alignItems='flex-start'>
            <Option label="neon">
                <Checkbox checked={style.neon} onChange={handleCheckboxChange}/>
            </Option>
            <Option label="decay">
                <Slider
                    min={0}
                    max={10}
                    step={1}
                    value={style.decay}
                    onChange={handleDecaySliderChange}
                    valueLabelDisplay="auto"
                    sx={SliderStyle}
                />
            </Option>
            <Option label="&nbsp;fog&nbsp;">
                <Slider
                    min={0}
                    max={0.4}
                    step={0.05}
                    value={style.fog}
                    onChange={handleFogSliderChange}
                    valueLabelDisplay="auto"
                    sx={SliderStyle}
                />
            </Option>
            </Box>
        </Box>
    )
}

export default ShadingOptions;

