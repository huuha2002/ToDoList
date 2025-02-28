import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../Screen/homes/HomeScreen';
import AddNewTask from '../Screen/tasks/AddNewTask';
import SearchScreen from '../Screen/tasks/SearchScreen';
import auth from '@react-native-firebase/auth'
import LoginScreen from '../Screen/auth/LoginScreen';
import RegisterScreen from '../Screen/auth/RegisterScreen';
import UserInfoScreen from '../Screen/User/UserInfoScreen';
import TaskDetail from '../Screen/tasks/TaskDetail';

const Router = () => {
    const [isLogin, setIsLogin] = useState(false)

    useEffect(() => {
        auth().onAuthStateChanged(user => {
            if (user)
                setIsLogin(true)
            else
                setIsLogin(false)
        })
    }, [])

    const Stack = createNativeStackNavigator();
    const MainRouter = (
        <Stack.Navigator screenOptions={{
            headerShown: false
        }}>
            <Stack.Screen name='HomeScreen' component={HomeScreen} />
            <Stack.Screen name='AddNewTask' component={AddNewTask} />
            <Stack.Screen name='SearchScreen' component={SearchScreen} />
            <Stack.Screen name='UserInfoScreen' component={UserInfoScreen} />
            <Stack.Screen name='TaskDetail' component={TaskDetail} />
        </Stack.Navigator>
    )

    const AuthRouter = (
        <Stack.Navigator
            screenOptions={{
                headerShown: false
            }}>
            <Stack.Screen name='LoginScreen' component={LoginScreen} />
            <Stack.Screen name='RegisterScreen' component={RegisterScreen} />
        </Stack.Navigator>
    )
    return (
        isLogin ?
            MainRouter
            :
            AuthRouter
    );
}

const styles = StyleSheet.create({})

export default Router;
