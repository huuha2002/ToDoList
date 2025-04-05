import React, { ReactNode, useEffect, useRef } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons'
import { colors } from '../constants/color';
import { globalStyles } from '../styles/globalStyles';
import TitleComponent from './TitleComponent';
import RowComponent from './rowComponent';


interface Props {
    value: string,
    disable?: boolean,
    onChange?: (val: string) => void
    placeHolder?: string,
    title?: string,
    prefix?: ReactNode,
    affix?: ReactNode,
    allowClear?: boolean,
    multible?: boolean,
    numberOfLine?: number,
    secure?: boolean,
    bgColor?: string,
    textColor?: string
}

const InputComponent = (props: Props) => {
    const { value, disable, onChange, placeHolder, title, prefix, affix, allowClear, multible, numberOfLine, secure, bgColor, textColor } = props
    const inputRef = useRef<TextInput | null>(null);

    // Sử dụng useEffect để focus khi disable là true
    const handleFocus = () => {
        inputRef.current?.focus()
    }
    return (
        <View style={{ marginBottom: 16 }}>
            {title && <TitleComponent text={title} color={textColor ? textColor : colors.text} />}
            <RowComponent styles={[globalStyles.inputComponent, {
                marginTop: title ? 4 : 0,
                minHeight: multible && numberOfLine ? numberOfLine * 32 : 32,
                paddingVertical: 14,
                paddingHorizontal: 10,
                alignItems: 'flex-start',
                backgroundColor: bgColor ? bgColor : colors.gray
            }]}>
                {prefix && <View style={{ justifyContent: 'center', }}>{prefix}</View>}
                <View style={{ justifyContent: 'center', flex: 1, paddingLeft: prefix ? 8 : 0, paddingRight: prefix ? 8 : 0 }}>
                    <TextInput
                        // ref={inputRef}
                        // editable={disable}
                        style={[globalStyles.text, {
                            margin: 0,
                            padding: 0,
                            flex: 0,
                            // paddingVertical: 4,
                            color: textColor ? textColor : colors.text
                        }]}
                        placeholder={placeHolder ?? ''}
                        placeholderTextColor={'#676767'}
                        value={value}
                        onChangeText={val => onChange?.(val)}
                        multiline={multible}
                        numberOfLines={numberOfLine}
                        secureTextEntry={secure}
                    />
                </View>
                {affix && <TouchableOpacity onPress={handleFocus}>{affix}</TouchableOpacity>}

                {allowClear && value && (
                    <TouchableOpacity onPress={() => onChange?.('')}>
                        <Ionicons name="close-sharp" size={22} color={colors.text} />
                    </TouchableOpacity>
                )}
            </RowComponent>
        </View>
    );
}

const styles = StyleSheet.create({})

export default InputComponent;
