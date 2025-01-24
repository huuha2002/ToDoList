import React, { ReactNode } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { globalStyles } from '../styles/globalStyles';
import SectionComponent from './SectionComponent';
import RowComponent from './rowComponent';
import TextComponent from './TextComponent';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { colors } from '../constants/color';
import { useNavigation } from '@react-navigation/native';
import { screensEnabled } from 'react-native-screens';


interface Props {
    title?: string;
    back?: boolean;
    right?: ReactNode;
    children: ReactNode;
    scrollEnable?: boolean
}

const Containers = (props: Props) => {
    const { title, back, right, children, scrollEnable } = props
    const navigation = useNavigation();  // Sử dụng hook để lấy navigation
    return (
        <View style={[globalStyles.container]}>
            {back && (
                <SectionComponent>
                    <RowComponent justify='space-between'>
                        <TouchableOpacity
                            onPress={() => navigation.goBack()}
                            style={{ flex: 0 }}>
                            <Ionicons name="arrow-back" size={24} color={colors.text} />
                        </TouchableOpacity>
                        {title && <TextComponent style={{ textAlign: 'center', }} text={title} flex={1} />}
                    </RowComponent>
                </SectionComponent>
            )}
            {scrollEnable ?
                (
                    <ScrollView style={{ flex: 1 }}>{children}</ScrollView>
                ) : (
                    <View style={{ flex: 1 }}>{children}</View>)}

        </View>
    );
}

const styles = StyleSheet.create({})

export default Containers;
