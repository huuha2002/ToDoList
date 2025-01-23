import React from 'react';
import { StyleSheet, View } from 'react-native';
import RowComponent from './rowComponent';
import TextComponent from './TextComponent';
import { fontFamilies } from '../constants/fontFamilies';
interface Props {
    size?: 'small' | 'default' | 'large',
    color?: string,
    percent: number
}
const ProgressBarComponent = (props: Props) => {
    const { size, color, percent } = props
    const heightSize = size === 'small' ? 6 : size === 'large' ? 10 : 8;
    return (
        <View style={{ marginTop: 12, marginBottom: 16 }}>
            <View style={{
                height: heightSize ?? 8,
                width: '100%',
                backgroundColor: 'rgba(86,61,159,0.8)',
                borderRadius: 100,
            }}>
                <View style={{
                    height: heightSize ?? 8,
                    width: `${percent}%`,
                    backgroundColor: color ?? '#3498db',
                    borderRadius: 100
                }} />
            </View>
            <RowComponent justify='space-between' styles={{ marginTop: 4 }}>
                <TextComponent text='Progress' size={12} />
                <TextComponent font={fontFamilies.bold} text={percent + '%'} size={12} flex={0} />
            </RowComponent>
        </View>

    );
}

const styles = StyleSheet.create({})

export default ProgressBarComponent;
