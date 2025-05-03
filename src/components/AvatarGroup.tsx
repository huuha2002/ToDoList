import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import RowComponent from './rowComponent';
import TextComponent from './TextComponent';
import firestore from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';

interface Props {
    uids?: string[]
}
const AvatarGroup = (props: Props) => {
    const { uids } = props
    const navigation = useNavigation()
    const imageURL = 'https://s.abcnews.com/images/GMA/john-wick-ht-bb-230216_1676562305682_hpMain_1x1_608.jpg'
    const [imgUrls, setImgUrls] = useState<string[]>([]);

    // console.log(uids);
    useEffect(() => {
        // Kiểm tra nếu uids tồn tại và không rỗng
        if (uids && uids.length > 0) {
            getUserImageUris(uids);
        } else {
            // Xử lý trường hợp uids là undefined hoặc rỗng
            console.log('No UIDs provided');
            setImgUrls([]); // Reset state nếu cần
        }
    }, [uids]);

    //Get user imgUrl
    const getUserImageUris = async (uids: string[]) => {
        try {
            uids.forEach((uid, index) => {
                const unsubscribe = firestore()
                    .collection('users')
                    .doc(uid)
                    .onSnapshot({
                        next: (snapshot) => {
                            if (snapshot.exists) {
                                const imageUri = snapshot.data()?.imageUri;
                                if (imageUri) {
                                    // Update the specific index
                                    setImgUrls(prev => {
                                        const updated = [...prev];
                                        updated[index] = imageUri;
                                        return updated;
                                    });
                                }
                            }
                        },
                        error: (error) => {
                            console.error(`Error fetching user ${uid}:`, error);
                        }
                    });
    
            });
            
        } catch (error) {
            console.error('Error fetching image URIs:', error);
            throw error;
        }
    };

    return (
        <RowComponent styles={{ justifyContent: 'flex-start', paddingLeft: 12 }}>
            {imgUrls.map((item, index) =>
                index < 3 && (
                    <View key={`image${index}`}>
                        <Image source={{ uri: item ?? imageURL }}
                            key={`image${index}`}
                            style={[styles.image]}
                        />
                    </View>
                )
            )}
            {
                uids && uids?.length > 3 && (
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
                            text={`+${uids.length - 3 > 9 ? 9
                                :
                                uids.length - 3}`} />
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
