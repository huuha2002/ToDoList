import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import Containers from '../../components/Containers';
import SectionComponent from '../../components/SectionComponent';
import TextComponent from '../../components/TextComponent';
import { globalStyles } from '../../styles/globalStyles';
import RowComponent from '../../components/rowComponent';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { colors } from '../../constants/color';
import firestore from '@react-native-firebase/firestore';
import { TaskModel } from '../../Models/TaskModel';
import SpaceComponent from '../../components/SpaceComponent';
import AvatarGroup from '../../components/AvatarGroup';
import { HandleDateTime } from '../../utils/HandleDateTime';

const TaskDetail = ({ navigation, route }: any) => {
    // console.log(route);
    const { id, color }: { id: string, color?: string } = route.params
    const [tasktDetail, settasktDetail] = useState<TaskModel>();
    useEffect(() => {
        getTaskDetail();
    }, [])
    const getTaskDetail = () => {
        const unsubscribe = firestore().doc(`task/${id}`).onSnapshot(
            (snap: any) => {
                if (snap.exists) {
                    settasktDetail({
                        id,
                        ...snap.data()
                    });
                } else {
                    console.log('Task detail not found!');
                }
            },
            (error) => {
                console.error('Error listening to task detail:', error);
            }
        );

        // Trả về hàm unsubscribe để dọn dẹp listener khi không cần thiết
        return unsubscribe;
    };
    console.log(tasktDetail);

    return tasktDetail ? (
        <ScrollView style={[globalStyles.container, { paddingTop: 0 }]}>
            <SectionComponent styles={{
                backgroundColor: 'rgba(113, 77, 217, 0.9)',
                paddingVertical: 20,
                paddingTop: 40
            }}>
                <RowComponent justify='space-between'>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Ionicons name="arrow-back" size={24} color={colors.text} />
                    </TouchableOpacity>
                </RowComponent>
                <SpaceComponent height={10} />
                <TextComponent text='Due Date' />
                <RowComponent styles={{ marginTop: 12 }}>
                    <RowComponent styles={{ flex: 1 }}>
                        <Ionicons name="alarm-outline" size={18} color={colors.text} />
                        <SpaceComponent width={8} />
                        <TextComponent flex={0} size={12} text={`${HandleDateTime.GetHour(tasktDetail.start?.toDate())}`} />
                    </RowComponent>
                    <RowComponent styles={{ flex: 1 }}>
                        <Ionicons name="calendar-outline" size={18} color={colors.text} />
                        <SpaceComponent width={8} />
                        <TextComponent flex={0} size={12} text='June 4th' />
                    </RowComponent>
                    <RowComponent justify='flex-end' styles={{ flex: 1 }}>
                        <AvatarGroup uids={tasktDetail.uids} />
                    </RowComponent>
                </RowComponent>
            </SectionComponent>
        </ScrollView>

    ) : (<></>);
}

const styles = StyleSheet.create({})

export default TaskDetail;
