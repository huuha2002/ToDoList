import React from 'react';
import { StyleProp, StyleSheet, Text, TextStyle, } from 'react-native';
import { globalStyles } from '../styles/globalStyles';
import { fontFamilies } from '../constants/fontFamilies';

interface Props {
    text: string,
    size?: number,
    font?: string,
    flex?: number,
    style?: StyleProp<TextStyle>
}

const TextComponent = (props: Props) => {
    const { text, font, size, flex, style } = props
    return (
        <Text style={[globalStyles.text,
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
