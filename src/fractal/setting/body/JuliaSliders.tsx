import {FC} from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Slider from '@mui/material/Slider';
import { vec3 } from 'gl-matrix';
interface JuliaSlidersProps {
    julia: vec3;
    juliaEnabled: boolean;
    setJulia: (j: number, idx: number) => void;
}
const j_min = -10;
const j_max = 10;
const j_step = 0.1;
const JuliaSliders: FC<JuliaSlidersProps> = ({juliaEnabled, julia, setJulia}) => {
    const labels = ['Jx', 'Jy', 'Jz'] as const;
    const handleSliderChange = (newValue: number | number[], idx: number) => {
        if (typeof newValue === 'number') {
            setJulia(newValue, idx);
        }
    };
    return (
        <Box margin='12px 0'>
            {labels.map((label, i) => (
                <Box key={i}>
                    <Typography id="param-label">
                        {label}
                    </Typography>
                    <Slider
                        min={j_min}
                        max={j_max}
                        step={j_step}
                        value={julia[i]}
                        onChange={(_, newValue) => handleSliderChange(newValue, i)}
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