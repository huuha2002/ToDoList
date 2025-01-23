import React from 'react';
import { StyleProp, StyleSheet, TextStyle, TouchableOpacity, ViewStyle } from 'react-native';
import { globalStyles } from '../styles/globalStyles';
import TextComponent from './TextComponent';

interface Props {
    text: string,
    color?: string,
    tagStyles?: StyleProp<ViewStyle>,
    textStyles?: StyleProp<TextStyle>,
    onPress?: () => void
}

const TagComponent = (props: Props) => {
    const { text, color, tagStyles, textStyles, onPress } = props
    return (
        <TouchableOpacity
            disabled={!onPress}
            onPress={onPress}
            style={[globalStyles.tag, tagStyles, { backgroundColor: color ?? '#3618e0' }]}>
            <TextComponent text={text} style={textStyles} />
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({})

export default TagComponent;
