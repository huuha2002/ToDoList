import React from 'react';
import { StyleProp, StyleSheet, TextStyle, ViewProps } from 'react-native';
import { fontFamilies } from '../constants/fontFamilies';
import TextComponent from './TextComponent';

interface Props {
    text: string,
    font?: string,
    size?: number,
    color?: string,
    styles?: StyleProp<TextStyle>
}

const TitleComponent = (props: Props) => {
    const { text, font, size, color, styles } = props
    return (
        <TextComponent
            text={text}
            font={font ?? fontFamilies.semiBold}
            size={size ?? 20}
            style={[styles, { flex: 0 }]}
        />
    );
}

const styles = StyleSheet.create({})

export default TitleComponent;
