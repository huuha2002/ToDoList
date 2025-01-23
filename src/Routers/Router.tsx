import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../Screen/homes/HomeScreen';
import AddNewTask from '../Screen/tasks/AddNewTask';
import SearchScreen from '../Screen/tasks/SearchScreen';
import auth from '@react-native-firebase/auth'

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
        </Stack.Navigator>
    )
    return (
        MainRouter
    );
}

const styles = StyleSheet.create({})

export default Router;
