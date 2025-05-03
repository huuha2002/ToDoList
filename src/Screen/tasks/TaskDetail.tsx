import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import Containers from '../../components/Containers';
import SectionComponent from '../../components/SectionComponent';
import TextComponent from '../../components/TextComponent';
import { globalStyles } from '../../styles/globalStyles';
import RowComponent from '../../components/rowComponent';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { colors } from '../../constants/color';
import firestore, { Timestamp } from '@react-native-firebase/firestore';
import { Attachment, TaskModel } from '../../Models/TaskModel';
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
import { Slider } from '@miblanchard/react-native-slider';
import ButtonComponent from '../../components/ButtonComponent';
import UploadFileComponent from '../../components/UploadFileComponent';
import { DocumentPickerResponse } from 'react-native-document-picker';
import axios from 'axios';
import { CalcFileSize } from '../../utils/CalcFileSize';
import ModalAddSubtasks from '../../Modals/ModalAddSubtasks';
import { string } from 'prop-types';

const TaskDetail = ({ navigation, route }: any) => {
    // console.log(route);
    const { id, color }: { id: string, color?: string } = route.params
    const [tasktDetail, settasktDetail] = useState<TaskModel>();
    const [progress, setprogress] = useState<any>(0);
    const [fileUrls, setfileUrl] = useState<Attachment[]>([]);
    const [subTasks, setsubTasks] = useState<any[]>([]);
    const [isChanged, setisChanged] = useState(false);
    const [files, setFiles] = useState<DocumentPickerResponse[]>([])
    const [loading, setloading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState<number[]>([]); // Mảng lưu tiến trình của từng file
    const [modelVisible, setModelVisible] = useState(false);
    // console.log('File: ', files.length);

    useEffect(() => {
        getTaskDetail();
        getSubTasks();
    }, []);
    useEffect(() => {
        if (tasktDetail)
            setfileUrl(tasktDetail?.attachments)
    }, [tasktDetail])
    useEffect(() => {
        if (tasktDetail) {
            setprogress(tasktDetail.progress ?? 0);
            setfileUrl(tasktDetail.attachments)
        }
    }, [tasktDetail]);
    useEffect(() => {
        if (
            progress !== tasktDetail?.progress ||
            fileUrls.length !== tasktDetail?.attachments.length ||
            files.length !== 0
        ) {
            setisChanged(true);
        } else {
            setisChanged(false);
        }
        // console.log('fileUrl', fileUrls);
    }, [progress, fileUrls, tasktDetail, files]);
    useEffect(() => {
        const calculateProgress = () => {
            if (!subTasks || subTasks.length === 0) {
                setprogress(0);
                return;
            }

            const completedTasks = subTasks.filter(e => e.isCompleted).length;
            const totalTasks = subTasks.length;
            const completedPercent = totalTasks > 0 ? completedTasks / totalTasks : 0;

            // Đảm bảo progress là số hợp lệ
            const safeProgress = Math.min(1, Math.max(0, Number(completedPercent) || 0))
            setprogress(safeProgress);
        };

        calculateProgress();
    }, [subTasks]);

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
        getSubTasks();
        // Trả về hàm unsubscribe để dọn dẹp listener khi không cần thiết
        return unsubscribe;
    };

    const getSubTasks = () => {
        const unsubscribe = firestore().collection('subTasks')
            .where('taskId', '==', id)
            .onSnapshot(
                (snap: any) => {
                    // console.log('subtasks: ', snap.data);
                    if (!snap.empty) {
                        const subtasksData: any[] = [];
                        snap.forEach((doc: any) => {
                            subtasksData.push({
                                id: doc.id,
                                ...doc.data()
                            });
                        });
                        setsubTasks(subtasksData);

                    } else {
                        console.log('Subtasks not found!');
                    }
                },
                (error) => {
                    console.error('Error listening to subtasks:', error);
                }
            );

        // Trả về hàm unsubscribe để dọn dẹp listener khi không cần thiết
        return unsubscribe;
    }
    // console.log(tasktDetail);
    const handleUploadFileToStorage = async (item: DocumentPickerResponse, index: number) => {
        const fileName = item.name ?? `file${Date.now()}`;
        const items = [...fileUrls];

        try {
            // Tạo FormData để gửi file lên Cloudinary
            const formData = new FormData();
            formData.append('file', {
                uri: item.uri,
                name: fileName,
                type: item.type || 'application/octet-stream', // Mặc định nếu không có type
            });
            formData.append('upload_preset', 'todolist_upload'); // Thay thế bằng upload preset của bạn
            formData.append('cloud_name', 'dnnv7kezk'); // Thay thế bằng cloud name của bạn
            // Gửi request upload lên Cloudinary
            const response = await axios.post(
                `https://api.cloudinary.com/v1_1/dnnv7kezk/upload`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                    onUploadProgress: (progressEvent) => {
                        if (progressEvent.total) {
                            const percentCompleted = Math.round(
                                (progressEvent.loaded * 100) / progressEvent.total
                            );
                            // Cập nhật tiến trình của file tại vị trí index
                            setUploadProgress((prevProgress) => {
                                const newProgress = [...prevProgress];
                                newProgress[index] = percentCompleted;
                                return newProgress;
                            });
                        }
                    },
                }
            );

            // Lấy URL từ phản hồi của Cloudinary
            const url = await response.data.secure_url;

            // Cập nhật danh sách URL
            const fileData: Attachment = {
                name: '',
                url: '',
                size: 0
            };
            fileData.name = item?.name ?? '';
            fileData.url = url;
            fileData.size = item?.size ?? 0;
            fileData.type = item?.type ?? '';
            // console.log('FILE DATA: ', fileData);
            items.push(fileData);

            setfileUrl(items);

            // Cập nhật taskDetail với URL file mới
            // const updatedTaskDetail = { ...taskDetail, fileUrls: items };
            // settaskDetail(updatedTaskDetail);

            console.log('File uploaded successfully:', url);
            return fileData
        } catch (error) {
            console.error('Upload File Error:', error);
            Alert.alert('Upload Failed', 'An error occurred while uploading the file. Please try again.');
        }

    }

    //Update Task
    const handleUpdateTask = async () => {
        try {
            setloading(true);
            const URL = []
            // Sử dụng vòng lặp for...of để có thể dùng await
            for (let i = 0; i < files.length; i++) {
                const fileUrl = await handleUploadFileToStorage(files[i], i); // Truyền index của file
                if (fileUrl) {
                    URL.push(fileUrl);
                }
            }
            // Wait for state to update
            await new Promise(resolve => setTimeout(resolve, 0));
            const data = { ...tasktDetail, progress, attachments: [...fileUrls, ...URL], updateAt: Date.now() };
            await firestore()
                .doc(`task/${id}`)
                .update(data)
                .then(() => {
                    Alert.alert('Task updated');
                }).catch(error => console.log('Update Task Error: ' + error))
            setFiles([]);
        } catch (error) {
            console.log(error)
        };
        setloading(false)
    }

    const handleTaskCompleted = async (id: string, isCompleted: boolean) => {
        try {
            // Cập nhật UI trước
            const updatedSubtasks = subTasks.map(task =>
                task.id === id ? { ...task, isCompleted: !isCompleted } : task
            );
            setsubTasks(updatedSubtasks);

            // Sau đó mới cập nhật Firestore
            await firestore().doc(`subTasks/${id}`).update({
                isCompleted: !isCompleted
            });
        } catch (error) {
            console.log('Update task completed error: ', error);
            // Rollback nếu có lỗi
            setsubTasks(subTasks);
        }
    }

    //DELETE ATTACHMENTS
    const deleteAttachment = (type: String, index: any, id?: any) => {
        if (type === 'fileUrls') {
            const newData = fileUrls.filter((_, i) => i !== index);
            setfileUrl(newData);
        }
        if (type === 'files') {
            const newData = files.filter((_, i) => i !== index);
            setFiles(newData);
        }
        if (type === 'subTasks' && id) {
            const newData = subTasks.filter((_, i) => i !== index);
            setsubTasks(newData);
            firestore().collection('subTasks').doc(id).delete();
        }
    }


    return tasktDetail ? (
        // !loading ?
        <View style={[globalStyles.container, { paddingTop: 0 }]}>
            <ScrollView >
                <SectionComponent styles={{
                    backgroundColor: color,
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
                        <TextComponent text={tasktDetail?.description || 'No description'} />
                    </CardContentComponent>
                </SectionComponent>
                <SectionComponent>
                    <RowComponent>
                        <TitleComponent text='Files & Links' flex={1} />
                        <UploadFileComponent onUpload={file => {
                            setFiles([...files, file])
                        }} />
                    </RowComponent>
                    {
                        fileUrls && fileUrls.map((item, index) => (
                            <CardContentComponent key={`fileUrl-${item.url}-${index}`} styles={{ marginBlock: 5 }}>
                                <RowComponent justify='flex-start'>
                                    <FontAwesome style={{ flex: 0 }} name="check-circle" size={24} color={colors.success} />
                                    <SpaceComponent width={10} />
                                    <View style={{ flex: 1 }}>
                                        <TextComponent size={11} numbOfLine={1} text={item.name ?? ''} />
                                        <TextComponent size={11} text={CalcFileSize(item.size)} />
                                    </View>
                                    <TouchableOpacity onPress={() => deleteAttachment('fileUrls', index)}>
                                        <AntDesign name="close" size={22} color={colors.text} />
                                    </TouchableOpacity>
                                </RowComponent>
                            </CardContentComponent>
                        ))
                    }
                    {
                        files && files.map((item, index) => (
                            <CardContentComponent key={`file${index}`} styles={{ marginBlock: 5 }}>
                                <RowComponent styles={{}}>
                                    <FontAwesome style={{ flex: 0 }} name="check-circle" size={24} color={colors.text} />
                                    <SpaceComponent width={10} />
                                    <View style={{ flex: 1 }}>
                                        <TextComponent size={11} numbOfLine={1} text={item.name ?? ''} />
                                        <TextComponent size={11} text={CalcFileSize(item.size ?? 0)} />
                                    </View>
                                    <TouchableOpacity onPress={() => deleteAttachment('files', index)}>
                                        <AntDesign name="close" size={22} color={colors.text} />
                                    </TouchableOpacity>
                                </RowComponent>
                                {uploadProgress[index] > 0 &&
                                    <View >
                                        <ProgressBarComponent
                                            percent={uploadProgress[index] || 0} // Sử dụng tiến trình của file tại index
                                            color={colors.success}
                                            size="small"
                                        />
                                        {/* <TextComponent
                                        text={`${uploadProgress[index] || 0}%`}
                                        size={12}
                                        color={colors.text}
                                        style={{ textAlign: 'center', marginTop: 5 }}
                                    /> */}
                                    </View>
                                }
                            </CardContentComponent>
                        ))
                    }
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
                        <View style={{ flex: 1, marginRight: 5 }}>
                            <Slider
                                disabled
                                value={progress}
                                onValueChange={val => setprogress(val[0])}
                                maximumTrackTintColor={colors.gray}
                                minimumTrackTintColor={colors.success}
                                thumbTintColor={colors.success}
                                trackStyle={{
                                    height: 10,
                                    borderRadius: 100
                                }}
                                thumbStyle={{
                                    borderWidth: 2,
                                    borderColor: colors.text
                                }}
                            />
                        </View>
                        <TextComponent
                            flex={0}
                            text={`${Math.round((Number(progress) || 0) * 100)}%`}
                            font={fontFamilies.bold}
                            size={18}
                        />
                    </RowComponent>

                </SectionComponent>
                <SectionComponent>
                    <RowComponent>
                        <TitleComponent flex={1} text='Sub Tasks' />
                        <TouchableOpacity onPress={() => setModelVisible(true)}>
                            <Ionicons name="add-circle-outline" size={24} color={colors.text} />
                        </TouchableOpacity>
                    </RowComponent>
                    {
                        subTasks && subTasks.map((item, index) => (
                            <TouchableOpacity
                                key={item.id}
                                onPress={() => handleTaskCompleted(item.id, item.isCompleted)}>
                                <CardContentComponent key={`subtask${index}`} styles={{ marginBlock: 5 }}>
                                    <RowComponent styles={{}}>
                                        {item.isCompleted ? <FontAwesome style={{ flex: 0 }} name="check-circle" size={24} color={colors.success} />
                                            : <FontAwesome style={{ flex: 0 }} name="check-circle-o" size={24} color={colors.success} />}

                                        <SpaceComponent width={10} />
                                        <View style={{ flex: 1 }}>
                                            <TextComponent numbOfLine={1} text={item.title ?? 'No title'} />
                                            <TextComponent size={12} text={HandleDateTime.DateString(new Date(item.createAt))} />
                                        </View>
                                        <TouchableOpacity onPress={() => deleteAttachment('subTasks', index, item.id)}>
                                            <AntDesign name="close" size={22} color={colors.text} />
                                        </TouchableOpacity>
                                    </RowComponent>
                                </CardContentComponent>
                            </TouchableOpacity>
                        ))
                    }

                </SectionComponent>
                <SpaceComponent height={100} />
            </ScrollView>
            {isChanged &&
                <View style={{
                    position: 'absolute',
                    bottom: 60,
                    left: 20,
                    right: 20,
                    flex: 1
                }}>
                    <ButtonComponent text='UPDATE' onPress={handleUpdateTask} />
                </View>
            }
            <ModalAddSubtasks taskId={tasktDetail.id} visible={modelVisible} onClose={() => setModelVisible(false)} />
        </View>
        // : <ActivityIndicator style={{ flex: 1 }} />
    ) : (<></>);
}

const styles = StyleSheet.create({})

export default TaskDetail;
