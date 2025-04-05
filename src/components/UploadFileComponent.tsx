import React, { useState } from 'react';
import { Modal, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Attachment } from '../Models/TaskModel';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { colors } from '../constants/color';
import DocumentPicker, { DocumentPickerResponse } from 'react-native-document-picker';

interface Props {
    onUpload: (file: DocumentPickerResponse) => void
}

const UploadFileComponent = (props: Props) => {
    const { onUpload } = props
    // const [file, setfile] = useState<DocumentPickerResponse>();
    const [isVisibleModelUpload, setisVisibleModelUpload] = useState(false);
    return (
        <>
            <TouchableOpacity onPress={() => DocumentPicker.pick({
                allowMultiSelection: false
            }).then(res => {
                // setfile(res[0])
                console.log(res[0]);
                onUpload(res[0])
            }
            )}>
                <AntDesign name="upload" size={20} color={colors.text} />
            </TouchableOpacity>
            {/* <Modal
                visible={isVisibleModelUpload}
                animationType='slide'
                style={{ flex: 1 }}
                transparent
            >

            </Modal> */}
        </>
    );
}

const styles = StyleSheet.create({})

export default UploadFileComponent;
