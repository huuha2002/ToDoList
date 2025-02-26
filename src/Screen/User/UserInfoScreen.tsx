import React, { useEffect, useState } from 'react';
import { Button, StyleSheet, TouchableOpacity, View } from 'react-native';
import Containers from '../../components/Containers';
import SectionComponent from '../../components/SectionComponent';
import TitleComponent from '../../components/TitleComponent';
import AvataImage from '../../components/AvataImage';
import InputComponent from '../../components/InputComponent';
import DateTimePickerComponent from '../../components/DateTimePickerComponent';
import RowComponent from '../../components/rowComponent';
import { colors } from '../../constants/color';
import Ionicons from 'react-native-vector-icons/Ionicons';
import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore';
import ButtonComponent from '../../components/ButtonComponent';
import SpaceComponent from '../../components/SpaceComponent';
import axios from 'axios';

const UserInfoScreen = () => {
    const [currentUser, setcurrentUser] = useState<any>();
    const [email, setEmail] = useState('');
    const [name, setname] = useState('');
    const [dayOfBirth, setdayOfBirth] = useState<Date>();
    const [phoneNumber, setphoneNumber] = useState('');
    const [address, setaddress] = useState('');
    const [imageUri, setimageUri] = useState('');
    const [editEmail, seteditEmail] = useState(false);
    const [editName, seteditName] = useState(false);
    const [editBirthDay, seteditBirthDay] = useState(false);
    const [editPhoneNumber, seteditPhoneNumber] = useState(false);
    const [editAddress, seteditAddress] = useState(false);

    const user = auth().currentUser;
    // Lấy dữ liệu người dùng từ Firestore
    const getCurrentUser = async () => {
        if (user?.uid) {
            await firestore()
                .collection('users')
                .doc(user.uid)
                .get()
                .then(snap => {
                    if (snap.exists) {
                        const userData = snap.data();
                        console.log('User Data: ' + userData);
                        setcurrentUser(userData);
                        setEmail(userData?.email || '');
                        setname(userData?.name || '');
                        setdayOfBirth(userData?.dayOfBirth?.toDate() || new Date());
                        setphoneNumber(userData?.phoneNumber || '');
                        setaddress(userData?.address || '');
                        setimageUri(userData?.imageUri || '');
                    } else {
                        console.log('User not found');
                    }
                })
                .catch(error => {
                    console.log('Error fetching user data:', error);
                });
        }
    };

    // Gọi hàm getCurrentUser khi màn hình được tải
    useEffect(() => {
        console.log(user?.uid);
        getCurrentUser();
    }, []);

    //Xử lý cập nhật thông tin người dùng
    const handleSave = async () => {
        console.log('image Url: ' + imageUri);
        const formData = new FormData();
        formData.append('file', {
            uri: imageUri,
            name: `file${Date.now()}`,
            type: 'application/octet-stream', // Mặc định nếu không có type
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
        setimageUri(url)
        if (user?.uid) {
            await firestore()
                .collection('users')
                .doc(user.uid)
                .set({
                    email,
                    name,
                    dayOfBirth,
                    phoneNumber,
                    address,
                    imageUri: url,
                }, { merge: true })
                .then(() => {
                    console.log('User data updated successfully');
                })
                .catch(error => {
                    console.log('Error updating user data:', error);
                });
        }
    };

    return (
        <Containers scrollEnable back>
            <SectionComponent >
                <RowComponent>
                    <AvataImage uri={imageUri} onChange={val => setimageUri(val?.uri || '')} />
                </RowComponent>
                <RowComponent justify='space-between'>
                    <TitleComponent text='Email' />
                    {/* <TouchableOpacity onPress={() => seteditEmail(!editEmail)}>
                        <Ionicons name="pencil" size={20} color={colors.text} />
                    </TouchableOpacity> */}
                </RowComponent>
                <InputComponent
                    affix={<Ionicons name="pencil" size={20} color={colors.text} />}
                    disable={!editEmail} value={email} onChange={val => setEmail(val)} />
                <RowComponent justify='space-between'>
                    <TitleComponent text='Name' />
                    {/* <Ionicons name="pencil" size={20} color={colors.text} /> */}
                </RowComponent>
                <InputComponent value={name}
                    affix={<Ionicons name="pencil" size={20} color={colors.text} />}
                    onChange={val => setname(val)} />
                <DateTimePickerComponent
                    // disabled={false}
                    selected={dayOfBirth}
                    onSelected={val => setdayOfBirth(val)}
                    title='BirthDay'
                    type='date'
                />
                <RowComponent justify='space-between'>
                    <TitleComponent text='PhoneNumber' />
                    {/* <Ionicons name="pencil" size={20} color={colors.text} /> */}
                </RowComponent>
                <InputComponent value={phoneNumber}
                    affix={<Ionicons name="pencil" size={20} color={colors.text} />}
                    onChange={val => setphoneNumber(val)} />
                <RowComponent justify='space-between'>
                    <TitleComponent text='Address' />
                    {/* <Ionicons name="pencil" size={20} color={colors.text} /> */}
                </RowComponent>
                <InputComponent value={address}
                    affix={<Ionicons name="pencil" size={20} color={colors.text} />}
                    onChange={val => setaddress(val)} />
                <ButtonComponent text='Save' onPress={handleSave} />
            </SectionComponent>
        </Containers>
    );
}

const styles = StyleSheet.create({})

export default UserInfoScreen;
