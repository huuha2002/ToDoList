import React from 'react';
import { StyleProp, StyleSheet, Text, TextStyle, } from 'react-native';
import { globalStyles } from '../styles/globalStyles';
import { fontFamilies } from '../constants/fontFamilies';
import { colors } from '../constants/color';

interface Props {
    text: string,
    color?: string
    size?: number,
    font?: string,
    flex?: number,
    style?: StyleProp<TextStyle>,
    numbOfLine?: number
}

const TextComponent = (props: Props) => {
    const { text, color, font, size, flex, style, numbOfLine } = props
    return (
        <Text
            numberOfLines={numbOfLine && numbOfLine}
            style={[globalStyles.text,
            {
                flex: flex ?? 1,
                fontSize: size ?? 16,
                fontFamily: font ?? fontFamilies.regular,
            }, style]}>
            {text}
        </Text>
    );
}

const styles = StyleSheet.create({})

export default TextComponent;
