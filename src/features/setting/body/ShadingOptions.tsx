import { FC, ChangeEvent, Dispatch, useState } from 'react';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import Slider from '@mui/material/Slider';
import Collapse from '@mui/material/Collapse';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';

import Option from './Option';
import { RgbColorPicker , RgbColor} from "react-colorful";
import { SettingState, SettingAction } from '..';
interface ShadingOptionsProps {
    setting: SettingState;
    dispatch: Dispatch<SettingAction>;
}

const listItemStyle = {
    paddingTop: 0, 
    paddingBottom: 0,
    paddingRight: 0
}
const sliderStyle = {
    width: 60,
    height: 8,
    marginLeft: "12px",
    "& .MuiSlider-thumb": {
        width: 16,
        height: 16
    }
}

const checkboxStyle = {
    height: "30px", 
    width: "30px"
}
const ShadingOptions: FC<ShadingOptionsProps> = (props) => {
    const {setting, dispatch} = props;
    const {style} = setting;
    const toggleShadow = (_: ChangeEvent<HTMLInputElement>, checked: boolean) => dispatch({type: '@TOGGLE_SHADOW', shadow: checked});
    const toggleNeon = (_: ChangeEvent<HTMLInputElement>, checked: boolean) => dispatch({type: '@TOGGLE_NEON', neon: checked});
    const handleOnColorChange = (newColor: RgbColor) => dispatch({type: '@SET_COLOR', color: newColor});
    const handleDecaySliderChange = (_: Event, newValue: number | number[]) => typeof newValue === 'number' && dispatch({type: '@SET_DECAY', decay: newValue});
    const handleOrbitFreqSliderChange = (_: Event, newValue: number | number[], idx: number) => typeof newValue === 'number' && dispatch({type: '@SET_ORBIT_FREQUENCY', value: newValue, idx});

    const [open, setOpen] = useState(false);
    const handleOrbitClick = () => {
        setOpen(!open);
    };
    return (
        <Box display='flex' flexDirection='row' justifyContent='space-around' alignItems='flex-start' sx={{width: 300, marginTop: '20px'}}>
            <RgbColorPicker color={style.color} onChange={handleOnColorChange} style={{width: 150, minWidth: 150}}/>
            <List sx={{ width: '100%', maxWidth: 150}}>
                <ListItem sx={listItemStyle}>
                    <ListItemText primary="shadow" />
                    <Checkbox size="small" sx={checkboxStyle} checked={style.shadow} onChange={toggleShadow}/>
                </ListItem>
                <ListItem sx={listItemStyle}>
                    <ListItemText primary="neon" />
                    <Checkbox size="small" sx={checkboxStyle} checked={style.neon} onChange={toggleNeon}/>
                </ListItem>
                <ListItem sx={listItemStyle}>
                    <ListItemText primary="decay" />
                    <Slider
                        min={0}
                        max={4}
                        step={0.5}
                        value={style.decay}
                        onChange={handleDecaySliderChange}
                        valueLabelDisplay="auto"
                        sx={sliderStyle}
                    />
                </ListItem>
                <ListItem sx={listItemStyle}>
                    <ListItemButton sx={{padding: 0}} onClick={handleOrbitClick}>
                        <ListItemText primary="orbit-freq" />
                        {open ? <ExpandLess /> : <ExpandMore />}
                    </ListItemButton>
                </ListItem>
                <Collapse in={open} sx={{position: "absolute", right: 0, ml: 4, zIndex: 9}} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        {["red", "green", "blue"].map((col, i) => (
                            <ListItem key={i} disablePadding>
                                <ListItemText primary={col} sx={{maxWidth: 45}}/>
                                <Slider
                                    min={0}
                                    max={1.0}
                                    step={0.1}
                                    value={style.orbit_freq[i]}
                                    onChange={(_, v) => handleOrbitFreqSliderChange(_, v, i)}
                                    valueLabelDisplay="auto"
                                    sx={{...sliderStyle, color: col}}
                                />
                            </ListItem>
                        ))}
                    </List>
                </Collapse>
            </List>
        </Box>
    )
}

export default ShadingOptions;

