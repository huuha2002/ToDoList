import React, { useEffect, useState } from 'react';
import { Button, StyleSheet, View } from 'react-native';
import Containers from '../../components/Containers';
import { TaskModel } from '../../Models/TaskModel';
import SectionComponent from '../../components/SectionComponent';
import InputComponent from '../../components/InputComponent';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { colors } from '../../constants/color';
import DateTimePickerComponent from '../../components/DateTimePickerComponent';
import RowComponent from '../../components/rowComponent';
import SpaceComponent from '../../components/SpaceComponent';
import DropDownPicker from '../../components/DropDownPicker';
import { SelectModel } from '../../Models/SelectModel';
import firestore from '@react-native-firebase/firestore'

const initValue: TaskModel = {
    title: '',
    description: '',
    dueDate: new Date(),
    start: new Date(),
    end: new Date(),
    uids: [],
    fileUrls: []
}
const AddNewTask = ({ navigation }: any) => {
    const [taskDetail, settaskDetail] = useState<TaskModel>(initValue);
    const [userSelect, setUserSelect] = useState<SelectModel[]>([]);

    //GET USER DATA
    useEffect(() => {
        handleGetAllUsers();
    }, [])
    const handleGetAllUsers = async () => {
        await firestore().collection('users')
            .get()
            .then(snap => {
                if (snap.empty) {
                    console.log('User data not found!');
                }
                else {
                    const items: SelectModel[] = [];
                    snap.forEach(item => {
                        items.push({
                            label: item.data().email,
                            value: item.id
                        })
                    });
                    setUserSelect(items);
                }
            })
    }

    const handleChangeValue = (id: string, value: string | Date) => {
        const item: any = { ...taskDetail }
        item[`${id}`] = value
        settaskDetail(item)
        console.log(id + ' : ' + value)
    }
    const handleAddNewTask = async () => {
        console.log(taskDetail)
    }
    return (
        <Containers back={true} title='Add New Task'>
            <SectionComponent>
                <InputComponent
                    // prefix={<Ionicons name="person-outline" size={22} color={colors.text} />}
                    value={taskDetail.title}
                    onChange={val => handleChangeValue('title', val)}
                    title='Title'
                    allowClear
                    placeHolder='Title'
                />
                <InputComponent

                    // prefix={<Ionicons name="person-outline" size={22} color={colors.text} />}
                    value={taskDetail.description}
                    onChange={val => handleChangeValue('description', val)}
                    title='Description'
                    allowClear
                    placeHolder='Description'
                    multible
                    numberOfLine={3}
                />
                <DateTimePickerComponent
                    onSelected={val => handleChangeValue('dueDate', val)}
                    selected={taskDetail.dueDate}
                    placeholder='Choose'
                    type='date'
                    title='dueDate'
                />
                <RowComponent>
                    <View style={{ flex: 1 }}>
                        <DateTimePickerComponent
                            selected={taskDetail.start}
                            onSelected={val => handleChangeValue('start', val)}
                            title='Start'
                            type='time'
                        />
                    </View>
                    <SpaceComponent width={10} />
                    <View style={{ flex: 1 }}>
                        <DateTimePickerComponent
                            selected={taskDetail.end}
                            onSelected={val => handleChangeValue('end', val)}
                            title='End'
                            type='time'
                        />
                    </View>
                </RowComponent>

                <DropDownPicker
                    title='Members'
                    selected={taskDetail.uids}
                    items={userSelect}
                    onSelect={val => console.log(val)}
                    multible
                />
            </SectionComponent>
            <SectionComponent>
                <Button title='Save'
                    onPress={handleAddNewTask}
                />
            </SectionComponent>
        </Containers>
    );
}

const styles = StyleSheet.create({})

export default AddNewTask;
