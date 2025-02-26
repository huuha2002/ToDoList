import React, { ReactNode, useState } from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { colors } from '../constants/color';
import DocumentPicker, { DocumentPickerResponse } from 'react-native-document-picker';

interface Props {
    uri?: string,
    width?: number,
    height?: number,
    affix?: ReactNode,
    onChange?: (val: DocumentPickerResponse | null) => void
}

const AvataImage = (props: Props) => {
    const { uri, width, height, affix, onChange } = props;
    const [image, setImage] = useState<DocumentPickerResponse | null>(null);

    const handleDocumentPicker = () => {
        DocumentPicker.pick({
            type: [DocumentPicker.types.images], // Chỉ cho phép chọn ảnh
        })
            .then(res => {
                setImage(res[0]); // Lưu ảnh được chọn vào state
                onChange?.(res[0])
            })
            .catch(error => {
                console.log('DocumentPicker Error: ' + error);
            });
    };

    return (
        <View style={{
            flex: 1,
            alignItems: 'center',
            marginBottom: 20
        }}>
            <Image
                style={{
                    width: width ?? 150,
                    height: height ?? 150,
                    borderRadius: 100,
                    alignItems: 'center'
                }}
                source={image ? { uri: image.uri } : (uri ? { uri: uri } : require('../asset/images/avatar.png'))}
            />
            <TouchableOpacity
                style={{ alignSelf: 'center' }}
                onPress={handleDocumentPicker} // Thêm sự kiện onPress để mở DocumentPicker
            >
                <Ionicons name="cloud-upload" size={24} color={colors.text} />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({});

export default AvataImage;