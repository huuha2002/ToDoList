import React, { useEffect, useState } from 'react';
import { Alert, Button, StyleSheet, TouchableOpacity, View } from 'react-native';
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
import TitleComponent from '../../components/TitleComponent';
import DocumentPicker, { DocumentPickerOptions, DocumentPickerResponse } from 'react-native-document-picker';
import TextComponent from '../../components/TextComponent';
import storage from '@react-native-firebase/storage';
import axios from 'axios';
import ButtonComponent from '../../components/ButtonComponent';

const initValue: TaskModel = {
    id: '',
    title: '',
    description: '',
    dueDate: new Date(),
    start: new Date(),
    end: new Date(),
    uids: [],
    fileUrls: [],
    progress: 0
}
const AddNewTask = ({ navigation }: any) => {
    const [taskDetail, settaskDetail] = useState<TaskModel>(initValue);
    const [userSelect, setUserSelect] = useState<SelectModel[]>([]);
    const [attachments, setAttachments] = useState<DocumentPickerResponse[]>([])
    const [attachmentUrl, setAttachmentUrl] = useState<string[]>([])
    const [isLoading, setIsLoading] = useState(false)
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

    const handleChangeValue = (id: string, value: string | string[] | Date) => {
        const item: any = { ...taskDetail }
        item[`${id}`] = value
        settaskDetail(item)

    }

    //Add New Task
    const handleAddNewTask = async () => {
        setIsLoading(true);
        navigation.goBack();
        const URL = []
        // Sử dụng vòng lặp for...of để có thể dùng await
        for (const item of attachments) {
            const fileUrl = await handleUploadFileToStorage(item); // Đợi kết quả upload
            URL.push(fileUrl); // Thêm URL vào mảng
        }
        console.log('AttachmentsURL: ' + [...URL]);
        const data = {
            ...taskDetail,
            fileUrls: [...URL]
        }
        await firestore().collection('task').add(data).then(() => {
            console.log('Add New Task Successful!');
            setIsLoading(false);
        }).catch(error => console.log('Add new task error: ' + error))

    }

    //Document Picker
    const handleDocumentPicker = () => {
        DocumentPicker.pick({})
            .then(res => {
                setAttachments(prev => prev.concat(res));
                // res.forEach(item => handleUploadFileToStorage(item))
                // console.log(attachments);
            }).catch(error => {
                console.log('DocumentPicker Error: ' + error);
            })
    }
    const handleRemoveDocument = async (index: number) => {
        if (attachments) {
            // Tạo một mảng mới không chứa phần tử cần xóa
            const newAttachments = attachments.filter((_, i) => i !== index);
            setAttachments(newAttachments); // Cập nhật state với mảng mới
            console.log(newAttachments);
        }
    };
    const handleUploadFileToStorage = async (item: DocumentPickerResponse) => {
        // const fileName = item.name ?? `file${Date.now()}`;
        // const path = `documents/${fileName}`
        // const items = [...attachmentUrl]
        // await storage().ref(path).putFile(item.uri);
        // await storage().ref(path).getDownloadURL().then(url => {
        //     items.push(url);
        //     setAttachmentUrl(items)
        // }).catch(err =>
        //     console.log('Upload File Error: ' + err))
        const fileName = item.name ?? `file${Date.now()}`;
        const items = [...attachmentUrl];

        setIsLoading(true); // Bắt đầu quá trình upload, hiển thị loading

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
                }
            );

            // Lấy URL từ phản hồi của Cloudinary
            const url = response.data.secure_url;

            // Cập nhật danh sách URL
            items.push(url);
            setAttachmentUrl(items);

            // Cập nhật taskDetail với URL file mới
            const updatedTaskDetail = { ...taskDetail, fileUrls: items };
            settaskDetail(updatedTaskDetail);

            console.log('File uploaded successfully:', url);
            return url
        } catch (error) {
            console.error('Upload File Error:', error);
            Alert.alert('Upload Failed', 'An error occurred while uploading the file. Please try again.');
        } finally {
            setIsLoading(false); // Kết thúc quá trình upload, tắt loading
        }

    }

    return (
        <Containers scrollEnable back={true} title='Add New Task'>
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
                    onSelect={val => handleChangeValue('uids', val)}
                    multible
                />
                <View>
                    <RowComponent justify='flex-start'>
                        <TitleComponent text='Attachments' flex={0} styles={{ marginRight: 3 }} />
                        <TouchableOpacity style={{}}
                            onPress={() => handleDocumentPicker()}
                        >
                            <Ionicons name="document-attach" size={20} color={colors.desc} />
                        </TouchableOpacity>
                    </RowComponent>
                    {
                        attachments.length > 0 && attachments.map((item, index) =>
                            <RowComponent key={index} styles={{ paddingVertical: 12 }} justify='flex-start'>
                                <TextComponent text={item.name ?? ''} flex={0} />
                                <TouchableOpacity
                                    onPress={() => handleRemoveDocument(index)}
                                    style={{ alignSelf: 'flex-start' }}>
                                    <Ionicons name="close-circle-outline" size={15} color={colors.desc} />
                                </TouchableOpacity>
                            </RowComponent>
                        )
                    }
                </View>
            </SectionComponent>
            <SectionComponent>
                {isLoading ? <ButtonComponent text='Saving...' />
                    : <ButtonComponent text='Save' onPress={handleAddNewTask} />}
            </SectionComponent>
        </Containers>
    );
}

const styles = StyleSheet.create({})

export default AddNewTask;
