import { FC, ChangeEvent } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import ColorPicker from './ColorPicker';
import { RGBColor  } from 'react-color';
interface ShadingOptionsProps {
    color: RGBColor;
    neon: boolean;
    setColor:  (newColor: RGBColor) => void;
    toggleNeon: (neon: boolean) => void;
    fromSample: (idx: number) => void;
}
const ShadingOptions: FC<ShadingOptionsProps> = ({color, neon, setColor, toggleNeon, fromSample}) => {
    const handleCheckboxChange = (_: ChangeEvent<HTMLInputElement>, checked: boolean) => toggleNeon(checked);
    const neonCheckBox = <Checkbox checked={neon} onChange={handleCheckboxChange}/>;
    return (
        <Box display='flex' flexDirection='row' justifyContent='flex-start' alignItems='flex-start' sx={{width: 300, marginTop: '20px'}}>
            <ColorPicker color={color} setColor={setColor}/>
            <FormControl focused={false} sx={{display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center'}}>
                <FormGroup>
                    <FormControlLabel control={neonCheckBox} label="neon" sx={{margin: 0}}/>
                </FormGroup>
                <Button sx={{fontSize: '8px'}} onClick={()=>fromSample(0)}>sample0</Button>
                <Button sx={{fontSize: '8px'}} onClick={()=>fromSample(1)}>sample1</Button>
            </FormControl>
        </Box>
    )
}

export default ShadingOptions;