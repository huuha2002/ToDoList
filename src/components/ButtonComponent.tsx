import React from 'react';
import { StyleProp, StyleSheet, TouchableOpacity, View, ViewStyle } from 'react-native';
import TextComponent from './TextComponent';
import { fontFamilies } from '../constants/fontFamilies';
import { useNavigation } from '@react-navigation/native';

interface Props {
    bgColor?: string,
    text: string,
    style?: StyleProp<ViewStyle>,
    onPress?: () => void
}

const ButtonComponent = (props: Props) => {
    const { bgColor, text, style, onPress } = props
    return (
        <View>
            <TouchableOpacity
                onPress={onPress ? () => onPress() : undefined}
                activeOpacity={1}
                style={[{
                    backgroundColor: bgColor ?? '#3498db',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: 10,
                    borderRadius: 20
                },
                    style
                ]}>
                <TextComponent text={text} font={fontFamilies.semiBold} />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({})

export default ButtonComponent;
