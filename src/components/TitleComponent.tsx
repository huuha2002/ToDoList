import React from 'react';
import { StyleProp, StyleSheet, TextStyle, ViewProps } from 'react-native';
import { fontFamilies } from '../constants/fontFamilies';
import TextComponent from './TextComponent';

interface Props {
    text: string,
    font?: string,
    size?: number,
    color?: string,
    styles?: StyleProp<TextStyle>,
    flex?: number,
    numberOfLines?: number
}

const TitleComponent = (props: Props) => {
    const { text, font, size, color, styles, flex, numberOfLines } = props
    return (
        <TextComponent
            color={color}
            text={text}
            font={font ?? fontFamilies.semiBold}
            size={size ?? 18}
            style={[styles]}
            flex={flex ?? 0}
            numbOfLine={numberOfLines && numberOfLines}
        />
    );
}

const styles = StyleSheet.create({})

export default TitleComponent;
