import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import RowComponent from './rowComponent';
import TextComponent from './TextComponent';

const AvatarGroup = () => {
    const uIdLength = 10
    const imageURL = 'https://s.abcnews.com/images/GMA/john-wick-ht-bb-230216_1676562305682_hpMain_1x1_608.jpg'
    return (
        <RowComponent styles={{ justifyContent: 'flex-start', paddingLeft:12 }}>
            {Array.from({ length: uIdLength }).map((item, index) =>
                index < 3 && (
                    <View key={`image${index}`}>
                        <Image source={{ uri: imageURL }}
                            key={`image${index}`}
                            style={[styles.image]}
                        />
                    </View>
                )
            )}
            {
                uIdLength > 3 && (
                    <View style={[styles.image,
                    {
                        backgroundColor: '#ffffff',
                        justifyContent: 'center',
                        alignItems: 'center',
                        margin: 0
                    }]}>
                        <TextComponent flex={0}
                            size={12}
                            style={{
                                color: 'black',
                                lineHeight: 19
                            }}
                            text={`+${uIdLength - 3 > 9 ? 9
                                :
                                uIdLength - 3}`} />
                    </View>
                )
            }
        </RowComponent>
    );
}

const styles = StyleSheet.create({
    image: {
        height: 30,
        width: 30,
        borderRadius: 100,
        borderWidth: 2,
        borderColor: '#ffffff',
        marginLeft: -10,
    }
})

export default AvatarGroup;
