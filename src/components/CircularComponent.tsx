import React from 'react';
import { StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import ProgressCircle from 'react-native-progress-circle';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { colors } from '../constants/color';

interface Props {
    color?: string,
    value: number,
    maxValue?: number,
    radius?: number,
    Style?: StyleProp<ViewStyle>,
    borderWidth?: number
}

const CircularComponent = (props: Props) => {
    const { color, value, maxValue, radius, Style, borderWidth } = props
    return (
        <View style={[styles.container, Style]}>
            {/* <ProgressCircle
                percent={value} // Phần trăm hoàn thành công việc
                radius={radius ?? 50} // Đường kính của biểu đồ
                borderWidth={borderWidth ?? 15} // Độ dày của đường viền
                color={color ?? "#3498db"} // Màu sắc của phần tròn đã hoàn thành
                shadowColor="#999" // Màu sắc của bóng đổ
                bgColor={colors.bgColor} // Màu sắc của phần còn lại của biểu đồ
            >
                <Text style={styles.text}>{value}%</Text>
            </ProgressCircle> */}
            <AnimatedCircularProgress
                size={radius ?? 120}
                width={borderWidth ?? 15}
                fill={value}
                tintColor="#00e0ff"
                backgroundColor="#3d5875"
            >
                {fill =>
                    <Text style={styles.text}>{`${Math.round(fill)}%`}</Text>
                }
            </AnimatedCircularProgress>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        fontSize: 20,
        color: colors.text,
    },
})

export default CircularComponent;
