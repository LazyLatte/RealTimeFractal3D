import {useState, forwardRef, useImperativeHandle, FC, ChangeEvent, Dispatch} from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Checkbox from '@mui/material/Checkbox';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import TextField from '@mui/material/TextField';

import Draggable from 'react-draggable';
import { NumericFormat } from 'react-number-format';
import AddLightSourceModal from './AddLightSourceModal';
import { SettingState, SettingAction } from '../..';
interface LightingProps {
    setting: SettingState;
    dispatch: Dispatch<SettingAction>;
}
export interface LightingHandle {
    open: () => void;
}
const defaultShadowKVal = 16;
const defaultPosition = {x: window.innerWidth * 0.5, y: Math.max(window.innerHeight * 0.5 - 100, 0.0)};
const Lighting = forwardRef<LightingHandle, LightingProps>(({setting, dispatch}, ref) => {
    const {enabled, lights, shadow} = setting.style.lighting;
    const [open, setOpen] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [kVal, setKVal] = useState(shadow.toString());

    useImperativeHandle(ref, ()=>({
        open: () => {
            setOpen(true);
        }
    }));

    const handleToggleLighting = (_: ChangeEvent<HTMLInputElement>, checked: boolean) => dispatch({type: "@TOGGLE_LIGHTING", enabled: checked});
    const handleDeleteLight = (idx: number) => dispatch({type: "@DELETE_LIGHT", idx});
    const handleUpdatingShadow = () => dispatch({type: "@UPDATE_SHADOW", shadow: parseFloat(kVal)});

    if(!open) return null;
    return (
        <Draggable defaultPosition={defaultPosition} cancel={'[class*="MuiList-root"], [class*="MuiModal-root"]'}>
            <Box display='flex' flexDirection='column' sx={{position: 'absolute', border: "1px solid", maxWidth: 300, borderRadius: 2, backgroundColor: 'orange',  padding: "4px 8px 12px"}}>
                <IconButton size="small" color="error" sx={{alignSelf: 'end'}} onClick={() => setOpen(false)}>
                    <CloseIcon fontSize='inherit'/>
                </IconButton>
                <Divider sx={{margin: '4px 0', border: '1px solid black'}}/>
                <List sx={{borderRadius: 2, backgroundColor: 'white', padding: '6px 6px 0px'}}>
                    <ListItem>
                        <Button variant="outlined" onClick={() => setModalOpen(true)} >Add light</Button>
                    </ListItem>
                    {lights.map((lt, i) => (
                        <ListItem 
                            key={i}
                            secondaryAction={
                                <IconButton edge="end" aria-label="comments" onClick={() => handleDeleteLight(i)}>
                                    <DeleteIcon />
                                </IconButton>
                            }
                            sx={{border: '1px solid', borderRadius: 2, margin: '6px 0px'}}
                        >
                            <ListItemText secondary={`(${lt.pos[0].toFixed(5)}, ${lt.pos[1].toFixed(5)}, ${lt.pos[2].toFixed(5)})`} />
                            <Box sx={{border: '2px solid', borderRadius: 2, width: 25, height: 25, backgroundColor: `rgb(${lt.color.r}, ${lt.color.g}, ${lt.color.b})`}}/>
                        </ListItem>
                    ))}
                    <ListItem>
                        <Typography >Enabled</Typography>
                        <Checkbox size="small" checked={enabled} onChange={handleToggleLighting} sx={{width: 32, height: 32}}/>
                        <NumericFormat 
                            label="shadow-kVal"
                            value={kVal} 
                            defaultValue={defaultShadowKVal}
                            onValueChange={(values) => setKVal(values.value)}
                            customInput={TextField}
                            allowNegative={false} 
                            variant="standard"
                            size='small'
                            onBlur={handleUpdatingShadow}
                            sx={{
                                marginLeft: 'auto',
                                width: 80
                            }}
                        />

                    </ListItem>
                </List>  
                <AddLightSourceModal open={modalOpen} camera={setting.camera} dispatch={dispatch} handleClose={() => setModalOpen(false)}/>
            </Box>
            
        </Draggable>
    )
});

export default Lighting;