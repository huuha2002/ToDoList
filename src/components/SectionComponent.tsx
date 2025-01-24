import React, { ReactNode } from 'react';
import { StyleProp, StyleSheet, TouchableWithoutFeedback, View, ViewStyle } from 'react-native';
import { globalStyles } from '../styles/globalStyles';

interface Props {
    children: ReactNode,
    styles?: StyleProp<ViewStyle>,
    onPress?: () => void
}

const SectionComponent = (props: Props) => {
    const { children, styles, onPress } = props
    return (
        <TouchableWithoutFeedback onPress={onPress ? () => onPress() : undefined}>
            <View style={[globalStyles.section, styles]}>
                {children}
            </View>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({})

export default SectionComponent;
