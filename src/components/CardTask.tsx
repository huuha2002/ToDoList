import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { TaskModel } from '../Models/TaskModel';
import SectionComponent from './SectionComponent';
import RowComponent from './rowComponent';
import TitleComponent from './TitleComponent';
import { CreateColor } from '../utils/CreateColors';
import { globalStyles } from '../styles/globalStyles';
import TextComponent from './TextComponent';
import AvatarGroup from './AvatarGroup';
import { HandleDateTime } from '../utils/HandleDateTime';
import SpaceComponent from './SpaceComponent';
import ProgressBarComponent from './ProgressBarComponent';

interface Props {
    taskDetail: TaskModel,
    color?:string,
    onPress?: () => void
}

const CardTask = (props: Props) => {
    const { taskDetail, color, onPress } = props;
    console.log('Card tasks: ', taskDetail);

    return (
        <SectionComponent onPress={onPress} styles={[
            globalStyles.card,
            {
                backgroundColor: color,
                padding: 10
            }
        ]}>
            <RowComponent>
                <TitleComponent numberOfLines={1} flex={1} text={taskDetail.title} />
                <TextComponent numbOfLine={1} text={`${HandleDateTime.GetHour(taskDetail.end)}-${HandleDateTime.DateString(taskDetail.dueDate)}`} />
            </RowComponent>
            <AvatarGroup uids={taskDetail.uids} />
            <SpaceComponent height={5} />
            <TextComponent numbOfLine={1} flex={0} text={taskDetail.description} />
            {taskDetail?.progress !== undefined && (
                <ProgressBarComponent
                    title
                    percent={Math.floor((Number(taskDetail?.progress ?? 0) * 100))}
                />
            )}
        </SectionComponent>
    );
}

const styles = StyleSheet.create({})

export default CardTask;
