import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import Containers from '../../components/Containers';
import SectionComponent from '../../components/SectionComponent';
import TextComponent from '../../components/TextComponent';
import { globalStyles } from '../../styles/globalStyles';
import RowComponent from '../../components/rowComponent';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { colors } from '../../constants/color';
import firestore, { Timestamp } from '@react-native-firebase/firestore';
import { TaskModel } from '../../Models/TaskModel';
import SpaceComponent from '../../components/SpaceComponent';
import AvatarGroup from '../../components/AvatarGroup';
import { HandleDateTime } from '../../utils/HandleDateTime';
import TitleComponent from '../../components/TitleComponent';
import CardContentComponent from '../../components/CardContentComponent';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { fontFamilies } from '../../constants/fontFamilies';
import ProgressBarComponent from '../../components/ProgressBarComponent';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

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
                        ...snap.data(),

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
                paddingTop: 40,
                borderBottomLeftRadius: 20,
                borderBottomRightRadius: 20
            }}>
                <RowComponent justify='space-between'>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Ionicons name="arrow-back" size={24} color={colors.text} />
                    </TouchableOpacity>
                </RowComponent>
                <SpaceComponent height={10} />
                <TextComponent text='Due Date' />
                <RowComponent justify='flex-start' styles={{ marginTop: 12 }}>
                    <RowComponent styles={{ flex: 1 }}>
                        <Ionicons name="alarm-outline" size={18} color={colors.text} />
                        <SpaceComponent width={5} />
                        <TextComponent
                            flex={0}
                            size={12}
                            text={`${HandleDateTime.GetHour(tasktDetail.start)}`} />
                        <TextComponent text=' : ' flex={0} />
                        <TextComponent
                            flex={0}
                            size={12}
                            text={`${HandleDateTime.GetHour(tasktDetail.end)}`} />
                    </RowComponent>
                    <RowComponent styles={{ flex: 1 }}>
                        <Ionicons name="calendar-outline" size={18} color={colors.text} />
                        <SpaceComponent width={5} />
                        <TextComponent flex={0} size={12} text={HandleDateTime.DateString(tasktDetail.dueDate)} />
                    </RowComponent>
                    <RowComponent justify='flex-end' styles={{ flex: 1 }}>
                        <AvatarGroup uids={tasktDetail.uids} />
                    </RowComponent>
                </RowComponent>
            </SectionComponent>
            <SectionComponent>
                <TitleComponent text='Description' />
                <CardContentComponent
                    styles={{
                        borderWidth: 1,
                        borderColor: colors.gray,
                        borderRadius: 12,
                        marginTop: 12,
                        padding: 20
                    }}
                    bgColor={colors.bgColor}>
                    <TextComponent text={tasktDetail.description} />
                </CardContentComponent>
            </SectionComponent>
            <SectionComponent>
                <CardContentComponent>
                    <RowComponent>
                        <TextComponent flex={0} text='Files & links' />
                        <RowComponent styles={{ flex: 1 }}>
                            <Ionicons name="document-text" size={42} color='#3618E0' />
                            <MaterialCommunityIcons name="file-excel" size={42} color="#00733b" />
                            <AntDesign name="pdffile1" size={38} color="#e5252a" />
                            <AntDesign name="addfile" size={38} color={colors.text} />
                        </RowComponent>
                    </RowComponent>
                </CardContentComponent>
            </SectionComponent>
            <SectionComponent>
                <RowComponent>
                    <View
                        style={{
                            width: 24,
                            height: 24,
                            borderColor: colors.success,
                            borderRadius: 100,
                            borderWidth: 2.5,
                            marginRight: 4,
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}
                    >
                        <View style={{
                            width: 16,
                            height: 16,
                            borderRadius: 100,
                            backgroundColor: colors.success
                        }} />
                    </View>
                    <TextComponent
                        text='Progress'
                        font={fontFamilies.medium}
                        size={18}
                        flex={1} />
                </RowComponent>
                <SpaceComponent height={10} />
                <RowComponent>
                    <View style={{ flex: 1 }}>
                        <TextComponent text='Slide' />
                    </View>
                    <TextComponent flex={0} text='70%' font={fontFamilies.bold} size={18} />
                </RowComponent>
                <ProgressBarComponent percent={70} />
            </SectionComponent>
            <SectionComponent>
                <RowComponent>
                    <TitleComponent flex={1} text='Sub Tasks' />
                    <TouchableOpacity>
                        <Ionicons name="add-circle-outline" size={24} color={colors.text} />
                    </TouchableOpacity>
                </RowComponent>
                {
                    Array.from({ length: 3 }).map((item, index) => (
                        <CardContentComponent key={`subtask${index}`} styles={{ marginBlock: 5 }}>
                            <RowComponent styles={{}}>
                                <FontAwesome style={{ flex: 1 }} name="check-circle" size={24} color={colors.success} />
                                <SpaceComponent width={10} />
                                <TextComponent text='ầdsgsg' />
                            </RowComponent>
                        </CardContentComponent>
                    ))
                }
            </SectionComponent>
        </ScrollView>

    ) : (<></>);
}

const styles = StyleSheet.create({})

export default TaskDetail;
