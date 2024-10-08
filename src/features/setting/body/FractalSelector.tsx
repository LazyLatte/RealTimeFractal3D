import {FC, Dispatch, ChangeEvent} from 'react';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import Select, {SelectChangeEvent} from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import {Fractal, SettingAction} from '..';
interface FractalSelectorProps {
    fractal: Fractal;
    juliaEnabled: boolean;
    dispatch: Dispatch<SettingAction>;
}

const FractalSelector: FC<FractalSelectorProps> = ({fractal, juliaEnabled, dispatch}) => {
    const fractalTypes = Object.keys(Fractal).filter((_, i) => Fractal[i] === undefined);
    const handleOnChange = (event: SelectChangeEvent<string>) => dispatch({type: '@SWITCH_FRACTAL', fractal: Fractal[event.target.value as keyof typeof Fractal]});
    const handleCheckboxChange = (_: ChangeEvent<HTMLInputElement>, checked: boolean) => dispatch({type: '@TOGGLE_JULIA', juliaEnabled: checked});
    const juliaCheckBox = <Checkbox checked={juliaEnabled} onChange={handleCheckboxChange}/>;
    return (
        <FormControl fullWidth focused={false} sx={{display: 'flex', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', margin: '20px 0 12px'}}>
            <Select
                id="fractal-select"
                value={fractalTypes[fractal]}
                onChange={handleOnChange}
                sx={{
                    width: 150
                }}
            >
                {fractalTypes.map((t, i) => <MenuItem value={t} key={i}>{t}</MenuItem>)}
            </Select>
            <FormGroup row>
                <FormControlLabel control={juliaCheckBox} label="Julia" />
            </FormGroup>
        </FormControl>
    )
}

export default FractalSelector;