import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import Containers from '../../components/Containers';
import { globalStyles } from '../../styles/globalStyles';
import RowComponent from '../../components/rowComponent';
import SectionComponent from '../../components/SectionComponent';
import TextComponent from '../../components/TextComponent';
import TitleComponent from '../../components/TitleComponent';
import CardContentComponent from '../../components/CardContentComponent';
import { colors } from '../../constants/color';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import SpaceComponent from '../../components/SpaceComponent';
import TagComponent from '../../components/TagComponent';
import CircularComponent from '../../components/CircularComponent';
import CardImageComponent from '../../components/CardImageComponent';
import AvatarGroup from '../../components/AvatarGroup';
import ProgressBarComponent from '../../components/ProgressBarComponent';
import { fontFamilies } from '../../constants/fontFamilies';
import ButtonComponent from '../../components/ButtonComponent';
import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore';
import { TaskModel } from '../../Models/TaskModel';
import { NativeModules } from 'react-native';

const HomeScreen = ({ navigation }: any) => {
    const { CameraModule } = NativeModules;
    const [isLoading, setisLoading] = useState(false);
    const [task, setTask] = useState<TaskModel[]>([]);
    const [imageUri, setImageUri] = useState();
    const user = auth().currentUser;

    //Camera Module
    const captureImage = async () => {
        try {
            const imageUri = await CameraModule.captureImage();
            setImageUri(imageUri)
            console.log('Image captured:', imageUri);
            return imageUri;
        } catch (error) {
            console.error('Failed to capture image:', error);
            throw error;
        }
    }

    //Get Task
    useEffect(() => {
        getNewTask();
    }, [])
    const getNewTask = async () => {
        setisLoading(true);
        await firestore().collection('task').orderBy('dueDate').limit(3).onSnapshot(snap => {
            if (!snap) {
                console.log('Tasks not found!');
            } else {
                const items: TaskModel[] = [];
                snap.forEach((item: any) => items.push({
                    id: item.id,
                    ...item.data()
                }))
                setisLoading(false);
                // console.log('New Tasks: ' + JSON.stringify(items));
                setTask(items);
            }
        })
    }
    return (
        <View style={{ flex: 1 }}>
            <Containers scrollEnable>
                {imageUri && <Image
                    source={{ uri: `data:image/png;base64,${imageUri}` }}
                    style={{ width: 200, height: 200 }}
                />}
                <SectionComponent>
                    <RowComponent justify='space-between'>
                        <TouchableOpacity onPress={captureImage}>
                            <Ionicons name="menu-sharp" size={24} color={colors.desc} />
                        </TouchableOpacity>
                        <Ionicons name="notifications" size={24} color={colors.desc} />
                    </RowComponent>
                </SectionComponent>
                <SectionComponent>
                    <RowComponent>
                        <View style={{ flex: 1 }}>
                            <TextComponent text={`Hi, ${user?.email}!`} />
                            <TitleComponent text='Be Productive today!' />
                        </View>
                        {/* <TouchableOpacity
                            style={{ alignSelf: 'flex-start' }}
                            onPress={async () => auth().signOut()}>
                            <Ionicons name="log-out-outline" size={24} color={colors.text} />
                        </TouchableOpacity> */}
                        <TouchableOpacity style={{ alignSelf: 'flex-start' }}
                            onPress={() => navigation.navigate('UserInfoScreen')}>
                            <Ionicons name="person-sharp" size={24} color={colors.text} />
                        </TouchableOpacity>
                    </RowComponent>
                </SectionComponent>
                <SectionComponent>
                    <RowComponent styles={[globalStyles.inputComponent]}
                        onPress={() => navigation.navigate('SearchScreen')}>
                        <TextComponent text='Search Task' />
                        <Ionicons name="search" size={24} color={colors.text} />
                    </RowComponent>
                </SectionComponent>
                <SectionComponent>
                    <CardContentComponent>
                        <RowComponent>
                            <View style={{ flex: 1 }}>
                                <TitleComponent text='Task process' />
                                <TextComponent text='30/40 task done!' />
                                <SpaceComponent height={12} />
                                <RowComponent justify='flex-start'>
                                    <TagComponent text='Match 22' onPress={() => console.log('Say hi')} />
                                </RowComponent>

                            </View>
                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                <CircularComponent value={60} />
                            </View>
                        </RowComponent>
                    </CardContentComponent>
                </SectionComponent>

                {/* Task - Card */}
                {isLoading ?
                    <ActivityIndicator></ActivityIndicator>
                    : task.length > 0 ?
                        <SectionComponent>
                            <RowComponent styles={{ alignItems: 'flex-start' }}>
                                {task[0] &&
                                    <View style={{ flex: 1, }}>
                                        <CardImageComponent onPress={() => navigation.navigate('TaskDetail',
                                            {
                                                id: task[0].id,
                                                color: 'rgba(113, 77, 217, 0.9)'
                                            })}>
                                            <TouchableOpacity
                                                style={[globalStyles.iconContainer]}>
                                                <MaterialIcons name="edit" size={20} color={colors.text} />
                                            </TouchableOpacity>
                                            <TitleComponent text={task[0].title} size={18} />
                                            <TextComponent
                                                numbOfLine={2}
                                                text={task[0].description} />
                                            <View style={{ marginVertical: 28 }}>
                                                {task[0].uids && <AvatarGroup uids={task[0].uids}></AvatarGroup>}
                                                {task[0]?.progress !== undefined && (
                                                    <ProgressBarComponent
                                                        title
                                                        percent={Math.floor((Number(task[0].progress ?? 0) * 100))}
                                                    />
                                                )}
                                            </View>
                                            <TextComponent
                                                text={`Due ${task[0].dueDate instanceof firestore.Timestamp
                                                    ? task[0].dueDate.toDate().toDateString() // Chuyển đổi Firestore Timestamp thành Date
                                                    : new Date(task[0].dueDate).toDateString() // Nếu dueDate đã là Date
                                                    }`}
                                                size={12}
                                            />
                                        </CardImageComponent>
                                    </View>
                                }

                                <SpaceComponent width={16} />

                                {task[1] && <View style={{ flex: 1 }}>
                                    <CardImageComponent
                                        onPress={() => navigation.navigate('TaskDetail',
                                            {
                                                id: task[1].id,
                                                color: 'rgba(50, 150, 243, 0.9)'
                                            })}
                                        color='rgba(50, 150, 243, 0.9)'>
                                        <TouchableOpacity
                                            style={[globalStyles.iconContainer]}>
                                            <MaterialIcons name="edit" size={20} color={colors.text} />
                                        </TouchableOpacity>
                                        <TitleComponent text={task[1].title} size={18} />
                                        <TextComponent text={task[1].description} />
                                        <AvatarGroup uids={task[1].uids}></AvatarGroup>
                                        {task[1]?.progress !== undefined && (
                                            <ProgressBarComponent
                                                title
                                                percent={Math.floor((Number(task[1].progress ?? 0) * 100))}
                                            />
                                        )}
                                        <TextComponent text={`Due ${task[1].dueDate instanceof firestore.Timestamp
                                            ? task[1].dueDate.toDate().toDateString() // Chuyển đổi Firestore Timestamp thành Date
                                            : new Date(task[1].dueDate).toDateString() // Nếu dueDate đã là Date
                                            }`} size={12} />
                                    </CardImageComponent>
                                    <SpaceComponent height={16} />
                                    {task[2] &&
                                        <CardImageComponent
                                            onPress={() => navigation.navigate('TaskDetail',
                                                {
                                                    id: task[2].id,
                                                    color: 'rgba(25, 234, 112, 0.9)'
                                                })}
                                            color='rgba(25, 234, 112, 0.9)'>
                                            <TouchableOpacity
                                                style={[globalStyles.iconContainer]}>
                                                <MaterialIcons name="edit" size={20} color={colors.text} />
                                            </TouchableOpacity>
                                            <TitleComponent text={task[2].title} size={18} />
                                            <TextComponent text={task[2].description} />
                                            <AvatarGroup uids={task[2].uids}></AvatarGroup>
                                            {task[2]?.progress !== undefined && (
                                                    <ProgressBarComponent
                                                        title
                                                        percent={Math.floor((Number(task[2].progress ?? 0) * 100))}
                                                    />
                                                )}
                                            <TextComponent text={`Due ${task[2].dueDate instanceof firestore.Timestamp
                                                ? task[2].dueDate.toDate().toDateString() // Chuyển đổi Firestore Timestamp thành Date
                                                : new Date(task[1].dueDate).toDateString() // Nếu dueDate đã là Date
                                                }`} size={12} />
                                        </CardImageComponent>}

                                </View>}

                            </RowComponent>
                        </SectionComponent>
                        : <></>
                }


                <SectionComponent>
                    <TitleComponent text='Urgent Tasks' />
                    <CardContentComponent>
                        <RowComponent>
                            <CircularComponent value={80} radius={80} borderWidth={10} Style={{ justifyContent: 'center' }} />
                            <View style={{ flex: 1, justifyContent: 'center', paddingLeft: 12 }}>
                                <TextComponent text='Title of Task' />
                            </View>
                        </RowComponent>
                    </CardContentComponent>
                </SectionComponent>
                <SpaceComponent height={60} />
            </Containers>
            <View style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                padding: 20
            }}>
                <ButtonComponent text='Add New Tasks'
                    onPress={() => navigation.navigate('AddNewTask')}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({})

export default HomeScreen;
