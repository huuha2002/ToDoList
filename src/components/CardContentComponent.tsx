import React, { ReactNode } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { globalStyles } from '../styles/globalStyles';
import { colors } from '../constants/color';
interface Props{
    children: ReactNode,
    bgColor?: string,
    styles?: StyleProp<ViewStyle>
}
const CardContentComponent = (props:Props) => {
    const {children, bgColor, styles}= props
    return (
        <View style = {[globalStyles.inputComponent,{padding:12, backgroundColor:bgColor??colors.gray}, styles]}>
            {children}
        </View>
    );
}

const styles = StyleSheet.create({})

export default CardContentComponent;
