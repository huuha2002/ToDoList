import React, { useEffect, useState } from 'react';
import { Keyboard, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Containers from '../../components/Containers';
import SectionComponent from '../../components/SectionComponent';
import TitleComponent from '../../components/TitleComponent';
import { fontFamilies } from '../../constants/fontFamilies';
import InputComponent from '../../components/InputComponent';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { colors } from '../../constants/color';
import ButtonComponent from '../../components/ButtonComponent';
import SpaceComponent from '../../components/SpaceComponent';
import { globalStyles } from '../../styles/globalStyles';
import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore';
import { HandleUser } from '../../utils/HandleUser';

const RegisterScreen = ({ navigation }: any) => {
    const [email, setemail] = useState('');
    const [password, setpassword] = useState('');
    const [rePassword, setRePassword] = useState('');
    const [loading, setloading] = useState(false);
    const [error, seterror] = useState('');
    const [isSecure, setIsSecure] = useState(true);

    useEffect(() => {
        if (email || password || rePassword)
            seterror('')
    }, [email, password, rePassword])

    const handleRegisterWithEmail = async () => {
        if (!email || !password || !rePassword) {
            seterror('Please enter your Email and Password!')
        }
        else {
            seterror('')
            setloading(true)
            await auth().createUserWithEmailAndPassword(email, password)
                .then(userCredential => {
                    const user = userCredential.user;
                    console.log('user: ' + user);
                    //save user to firestore
                    HandleUser.saveToDatabase(user);
                    setloading(false);
                }).catch((error): any => {
                    setloading(false);
                    seterror(error.message);
                }
                )
        }
    }
    return (
        <Containers back scrollEnable={false}>
            <SectionComponent
                onPress={() => Keyboard.dismiss()}
                styles={{
                    justifyContent: 'center',
                    flex: 1,
                }}>
                <TitleComponent
                    text='Register'
                    size={30}
                    font={fontFamilies.bold}
                    styles={{ textTransform: 'uppercase', textAlign: 'center' }}
                />
                <View style={{ marginVertical: 20, }}>
                    <InputComponent
                        value={email}
                        onChange={val => setemail(val)}
                        prefix={<Ionicons name="mail-outline" size={24} color={colors.text} />}
                        placeHolder='Email'
                        allowClear
                        title='Email'
                    />
                    <InputComponent
                        value={rePassword}
                        onChange={val => setRePassword(val)}
                        prefix={<Ionicons name="lock-closed-outline" size={22} color={colors.text} />}
                        placeHolder='Password'
                        title='Password'
                        secure={isSecure}
                        affix={<TouchableOpacity onPress={() => setIsSecure(val => !val)}>
                            {isSecure ?
                                (<Ionicons name="eye-off-outline" size={20} color={colors.text} />)
                                :
                                (<Ionicons name="eye-outline" size={20} color={colors.text} />)
                            }
                        </TouchableOpacity>}
                    />
                    <InputComponent
                        value={password}
                        onChange={val => setpassword(val)}
                        prefix={<Ionicons name="lock-closed-outline" size={22} color={colors.text} />}
                        placeHolder='Confirm Password'
                        title='Confirm Password'
                        secure={isSecure}
                        affix={<TouchableOpacity onPress={() => setIsSecure(val => !val)}>
                            {isSecure ?
                                (<Ionicons name="eye-off-outline" size={20} color={colors.text} />)
                                :
                                (<Ionicons name="eye-outline" size={20} color={colors.text} />)
                            }
                        </TouchableOpacity>}
                    />
                    {error && <Text style={{ color: 'coral' }}>{error}</Text>}

                </View>


                <ButtonComponent
                    text='Join now'
                    onPress={() => handleRegisterWithEmail()}
                    disabled={loading}
                ></ButtonComponent>
                <SpaceComponent height={20} />
                <Text style={[globalStyles.text, { textAlign: 'center' }]}>You're already have account?
                    <Text style={{ color: 'coral' }} onPress={() => navigation.navigate('LoginScreen')}> Login!</Text></Text>
            </SectionComponent>
        </Containers>
    );
}

const styles = StyleSheet.create({})

export default RegisterScreen;
