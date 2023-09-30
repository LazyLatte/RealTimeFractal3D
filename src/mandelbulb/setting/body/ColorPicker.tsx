import { FC, Dispatch, SetStateAction} from 'react';
import { SketchPicker, ColorResult, RGBColor  } from 'react-color';
interface ColorPickerProps {
    color: RGBColor;
    setColor:  Dispatch<SetStateAction<RGBColor>>;
}
const ColorPicker: FC<ColorPickerProps> = ({color, setColor}) => {
    const handleChange  = (color: ColorResult) => setColor(color.rgb);
    const handleChangeComplete = (color: ColorResult) => setColor(color.rgb);
    
    return (
        <div style={{marginTop: '16px'}}>
            <SketchPicker
                color={color}
                onChangeComplete={handleChangeComplete}
                onChange={handleChange}
            />
        </div>
    )
}

export default ColorPicker;