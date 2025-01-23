import React, { ReactNode } from 'react';
import { StyleProp, StyleSheet, TouchableOpacity, View, ViewStyle } from 'react-native';
import { globalStyles } from '../styles/globalStyles';

interface Props {
    children: ReactNode;
    justify?: "flex-start"
    | "flex-end"
    | "center"
    | "space-between"
    | "space-around"
    | "space-evenly"
    | undefined;
    onPress?: () => void;
    styles?: StyleProp<ViewStyle>;
}

const RowComponent = (props: Props) => {
    const { children, justify, onPress, styles } = props
    return onPress ?
        (<TouchableOpacity
            onPress={onPress ? () => onPress() : undefined}
            style={[globalStyles.row, { justifyContent: justify ?? 'center', }, styles]}>
            {children}
        </TouchableOpacity>)
        :
        (
            <View style={[globalStyles.row, { justifyContent: justify ?? 'center' }, styles]}>
                {children}
            </View>
        );
}

const styles = StyleSheet.create({})

export default RowComponent;
