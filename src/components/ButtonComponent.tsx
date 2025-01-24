import React from 'react';
import { ActivityIndicator, StyleProp, StyleSheet, TouchableOpacity, View, ViewStyle } from 'react-native';
import TextComponent from './TextComponent';
import { fontFamilies } from '../constants/fontFamilies';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../constants/color';

interface Props {
    bgColor?: string,
    text: string,
    size?: number,
    style?: StyleProp<ViewStyle>,
    onPress?: () => void,
    disabled?: boolean
}

const ButtonComponent = (props: Props) => {
    const { bgColor, text, size, style, onPress, disabled } = props
    return (
        <View style={{}}>
            <TouchableOpacity
                disabled={disabled}
                onPress={onPress ? () => onPress() : undefined}
                activeOpacity={1}
                style={[{
                    backgroundColor: disabled ? colors.gray : bgColor ?? '#3498db',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: 10,
                    borderRadius: 20
                },
                    style
                ]}>
                {disabled ? (
                    <ActivityIndicator />
                ) : (
                    <TextComponent text={text} flex={0} size={size} font={fontFamilies.semiBold} />
                )}
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({})

export default ButtonComponent;
