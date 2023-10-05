import { FC } from 'react';
import { SketchPicker, ColorResult, RGBColor  } from 'react-color';
interface ColorPickerProps {
    color: RGBColor;
    setColor:  (newColor: RGBColor) => void;
}
const ColorPicker: FC<ColorPickerProps> = ({color, setColor}) => {
    const handleChange  = (color: ColorResult) => setColor(color.rgb);
    const handleChangeComplete = (color: ColorResult) => setColor(color.rgb);
    
    return (
        <div style={{marginTop: '20px'}}>
            <SketchPicker
                color={color}
                onChangeComplete={handleChangeComplete}
                onChange={handleChange}
            />
        </div>
    )
}

export default ColorPicker;