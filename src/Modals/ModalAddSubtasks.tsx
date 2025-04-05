import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Modal, StyleSheet, TouchableOpacity, View } from 'react-native';
import { globalStyles } from '../styles/globalStyles';
import RowComponent from '../components/rowComponent';
import TextComponent from '../components/TextComponent';
import AntDesign from 'react-native-vector-icons/AntDesign';
import ButtonComponent from '../components/ButtonComponent';
import TitleComponent from '../components/TitleComponent';
import { colors } from '../constants/color';
import InputComponent from '../components/InputComponent';
import firestore from '@react-native-firebase/firestore';

interface Props {
    visible: boolean,
    subtask?: any,
    onClose: () => void,
    taskId: string
}

const initValue = {
    title: '',
    description: '',
    isCompleted: false
}

const ModalAddSubtasks = (props: Props) => {
    const [subTaskForm, setSubTaskForm] = useState(initValue);
    const [isUpdate, setIsUpdate] = useState(false);
    const { visible, subtask, onClose, taskId } = props;
    const handleChangeValue = (key: string, value: string | string[]) => {
        setSubTaskForm({
            ...subTaskForm, // Spread current state
            [key]: value    // Update the specific field
        });
    }
    useEffect(() => {
        if (subtask) {
            setSubTaskForm(subtask);
        } else {
            setSubTaskForm(initValue);
        }
    }, [visible, subtask]);
    const handleClose = () => {
        setSubTaskForm(initValue);
        onClose();
    }

    const handleSave = async () => {
        setIsUpdate(true);
        const data = {
            ...subTaskForm,
            createAt: Date.now(),
            updateAt: Date.now(),
            taskId,
        };
        console.log(data);
        await firestore().collection('subTasks').add(data);
        setIsUpdate(false)
        handleClose()
    }
    return (
        <Modal style={globalStyles.modal}
            visible={visible}
            transparent
            animationType='slide'>
            <View style={globalStyles.modelConatiner}>
                {isUpdate ? <ActivityIndicator style={{ backgroundColor: 'transparent' }} />
                    : <View style={globalStyles.modalContent}>
                        <TouchableOpacity onPress={handleClose}>
                            <AntDesign style={{ alignSelf: 'flex-end' }} name="close" size={24} color="black" />
                        </TouchableOpacity>
                        <TitleComponent styles={{ alignSelf: 'center' }} flex={0} text='Add Subtask' color={colors.bgColor} />
                        <InputComponent
                            title='Title'
                            value={subTaskForm.title}
                            bgColor={colors.desc}
                            textColor={colors.bgColor}
                            placeHolder='Title'
                            onChange={val => handleChangeValue('title', val)}
                        />
                        <InputComponent
                            title='Description'
                            value={subTaskForm.description}
                            bgColor={colors.desc}
                            textColor={colors.bgColor}
                            placeHolder='Description'
                            onChange={val => handleChangeValue('description', val)}
                            numberOfLine={3}
                            multible
                        />
                        <ButtonComponent text='Save' onPress={() => handleSave()} />
                    </View>
                }
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({})

export default ModalAddSubtasks;
