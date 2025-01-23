import React from 'react';
import { StyleSheet } from 'react-native';
import { fontFamilies } from '../constants/fontFamilies';
import TextComponent from './TextComponent';

interface Props {
    text: string,
    font?: string,
    size?: number,
    color?: string
}

const TitleComponent = (props: Props) => {
    const { text, font, size, color } = props
    return (
        <TextComponent
            text={text}
            font={font ?? fontFamilies.semiBold}
            size={size ?? 20}
        />
    );
}

const styles = StyleSheet.create({})

export default TitleComponent;
