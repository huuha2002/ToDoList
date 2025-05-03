import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Containers from '../../components/Containers';
import SectionComponent from '../../components/SectionComponent';
import CardTask from '../../components/CardTask';
import { TaskModel } from '../../Models/TaskModel';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { CreateColor } from '../../utils/CreateColors';
import TaskDetail from './TaskDetail';

const AllTasksScreen = ({ navigation, route }: any) => {
    const user = auth().currentUser;
    // console.log("ID: ", user?.uid);
    const [tasks, setTasks] = useState<TaskModel[]>([]);
    const [userImg, setUserImg] = useState<String[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        getTasks();
    }, [])
    //GET ALL TASK
    const getTasks = async () => {
        setLoading(true);
        await firestore().collection('task').orderBy('dueDate').where('uids', 'array-contains', user?.uid)
            .onSnapshot(snap => {
                if (!snap) {
                    setLoading(false);
                    console.log('Tasks not found!');
                }
                else {
                    const items: TaskModel[] = [];
                    snap.forEach((item: any) => items.push({
                        id: item.id,
                        ...item.data()
                    }))
                    setLoading(false);
                    // console.log('New Tasks: ' + JSON.stringify(items));
                    // console.log('Task: ', items);
                    setTasks(items);
                }
            });
    }
    // console.log(tasks);
    return (
        <Containers back scrollEnable>
            <SectionComponent>
                {tasks && tasks.map((item, index) => (
                    // console.log(item);
                    <CardTask key={`item${index}`} taskDetail={item} color={CreateColor.getRandomColor()}
                        onPress={() => navigation.navigate('TaskDetail',
                            {
                                id: item.id,
                                color: 'rgba(25, 234, 112, 0.9)'
                            })} />
                ))}

            </SectionComponent>
        </Containers>
    );
}

const styles = StyleSheet.create({})

export default AllTasksScreen;
