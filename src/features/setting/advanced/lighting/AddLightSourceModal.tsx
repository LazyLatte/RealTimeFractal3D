import {FC, Dispatch, useState} from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Modal from '@mui/material/Modal';
import Grid from '@mui/material/Grid';
import { RgbColorPicker , RgbColor} from "react-colorful";
import { SettingAction } from '../..';
import { NumericFormat } from 'react-number-format';
import { vec3 } from 'gl-matrix';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    borderRadius: 2,
    boxShadow: 24,
    p: 4,
};
interface AddLightSourceModalProps {
    open: boolean;
    handleClose: () => void;
    camera: vec3;
    dispatch: Dispatch<SettingAction>;
}

const AddLightSourceModal: FC<AddLightSourceModalProps> = ({open, handleClose, camera, dispatch}) => {
    const [x, setX] = useState(camera[0].toFixed(5).toString());
    const [y, setY] = useState(camera[1].toFixed(5).toString());
    const [z, setZ] = useState(camera[2].toFixed(5).toString());
    const pos = [x, y, z];
    const setPos = [setX, setY, setZ];

    const [color, setColor] = useState<RgbColor>({r: 255, g: 255, b: 255});
    const handleOnColorChange = (newColor: RgbColor) => setColor(newColor);
    const handleAddLight = () => {
        dispatch({type: "@ADD_LIGHT", pos: vec3.fromValues(parseFloat(x), parseFloat(y), parseFloat(z)), color});
        handleClose();
    };

    return (
        <Modal open={open} onClose={() => {}}>
            <Grid container spacing={2} sx={style}>
                <Grid container item spacing={2}>
                    <Grid container item xs={6} direction="column" sx={{justifyContent: "space-around", alignItems: "center"}}>
                        {["x", "y", "z"].map((label, i) => (
                            <NumericFormat 
                                key={i}
                                label={label}
                                value={pos[i]} 
                                onValueChange={(values) => {
                                    setPos[i](values.value);
                                }}
                                
                                customInput={TextField} 
                                variant="standard"
                            />
                        ))}
                    </Grid>
                    <Grid item xs={6}>
                        <RgbColorPicker color={color}  onChange={handleOnColorChange} style={{width: "100%"}}/>
                    </Grid>
                </Grid>
                <Grid container item xs={12} direction="row" sx={{justifyContent: "space-around", alignItems: "center"}}>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleAddLight}>Create</Button>
                </Grid>
            </Grid>
        </Modal>
    )

};
export default AddLightSourceModal;