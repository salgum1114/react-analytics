import React, { useState, useEffect } from 'react';
import { Dropdown, Button, Menu } from 'antd';
import { SketchPicker, ColorResult } from 'react-color';
import debounce from 'lodash/debounce';

export interface ColorPickerProps {
    value?: string;
    onChange?: (color: any) => void;
}

const ColorPicker: React.SFC<ColorPickerProps> = props => {
    const { value, onChange } = props;
    const [color, setColor] = useState('#fff');
    useEffect(() => {
        setColor(value);
    }, [value]);
    const handleChange = (color: ColorResult) => {
        const { r, g, b, a } = color.rgb;
        const colorValue = `rgba(${r}, ${g}, ${b}, ${a})`;
        setColor(colorValue);
        if (onChange) {
            onChange(colorValue);
        }
    }
    const renderOverlay = () => {
        return (
            <Menu>
                <SketchPicker
                    color={color}
                    onChange={debounce(handleChange, 300)}
                />
            </Menu>
        );
    }
    return (
        <Dropdown overlay={renderOverlay()} trigger={['click']}>
            <Button shape="circle" style={{ backgroundColor: color }} />
        </Dropdown>
    );
}

export default ColorPicker;
