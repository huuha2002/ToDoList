import React, { ReactNode } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons'
import { colors } from '../constants/color';
import { globalStyles } from '../styles/globalStyles';
import TitleComponent from './TitleComponent';
import RowComponent from './rowComponent';


interface Props {
    value: string,
    onChange: (val: string) => void
    placeHolder?: string,
    title?: string,
    prefix?: ReactNode,
    affix?: ReactNode,
    allowClear?: boolean,
    multible?: boolean,
    numberOfLine?: number
}

const InputComponent = (props: Props) => {
    const { value, onChange, placeHolder, title, prefix, affix, allowClear, multible, numberOfLine } = props
    return (
        <View style={{ marginBottom: 16 }}>
            {title && <TitleComponent text={title} />}
            <RowComponent styles={[globalStyles.inputComponent, {
                marginTop: title ? 8 : 0,
                minHeight: multible && numberOfLine ? numberOfLine * 32 : 32,
                paddingVertical: 14,
                paddingHorizontal: 10,
                alignItems:'flex-start'
            }]}>
                {prefix && prefix}
                <View style={{ flex: 1, paddingLeft: prefix ? 8 : 0, paddingRight: prefix ? 8 : 0 }}>
                    <TextInput
                        style={[globalStyles.text, {
                            margin: 0,
                            padding: 0,
                            flex: 1,
                            paddingVertical: 4
                        }]}
                        placeholder={placeHolder ?? ''}
                        placeholderTextColor={'#676767'}
                        value={value}
                        onChangeText={val => onChange(val)}
                        multiline={multible}
                        numberOfLines={numberOfLine}
                    />
                </View>
                {affix && affix}

                {allowClear && value && (
                    <TouchableOpacity onPress={() => onChange('')}>
                        <Ionicons name="close-sharp" size={22} color={colors.text} />
                    </TouchableOpacity>
                )}
            </RowComponent>
        </View>
    );
}

const styles = StyleSheet.create({})

export default InputComponent;
