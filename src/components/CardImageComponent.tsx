import React, { ReactNode } from 'react';
import { ImageBackground, StyleSheet, View } from 'react-native';
import { globalStyles } from '../styles/globalStyles';

interface Props {
    children: ReactNode,
    color?: string
}

const CardImageComponent = (props: Props) => {
    const { children, color } = props
    return (
        <ImageBackground
            source={require('../asset/images/cardbg.png')}
            imageStyle={{ borderRadius: 12 }}
            style={[globalStyles.card, {}]}
        >
            <View style={[{
                backgroundColor: color ?? 'rgba(113, 77, 217, 0.9)',
                borderRadius: 12,
                flex: 1,
                padding: 12
            }]}>
                {children}
            </View>
        </ImageBackground>

    );
}

const styles = StyleSheet.create({})

export default CardImageComponent;
