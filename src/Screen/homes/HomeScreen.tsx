import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
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

const HomeScreen = ({ navigation }: any) => {
    const user = auth().currentUser;
    return (
        <View style={{ flex: 1 }}>
            <Containers scrollEnable>
                <SectionComponent>
                    <RowComponent justify='space-between'>
                        <Ionicons name="menu-sharp" size={24} color={colors.desc} />
                        <Ionicons name="notifications" size={24} color={colors.desc} />
                    </RowComponent>
                </SectionComponent>
                <SectionComponent>
                    <RowComponent>
                        <View style={{ flex: 1 }}>
                            <TextComponent text={`Hi, ${user?.email}!`} />
                            <TitleComponent text='Be Productive today!' />
                        </View>
                        <TouchableOpacity
                        style={{alignSelf:'flex-start'}}
                        onPress={async () => auth().signOut()}>
                            <Ionicons name="log-out-outline" size={24} color={colors.text} />
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

                <SectionComponent>
                    <RowComponent styles={{ alignItems: 'flex-start' }}>
                        <View style={{ flex: 1, }}>
                            <CardImageComponent>
                                <TouchableOpacity
                                    style={[globalStyles.iconContainer]}>
                                    <MaterialIcons name="edit" size={20} color={colors.text} />
                                </TouchableOpacity>
                                <TitleComponent text='UX Design' size={18} />
                                <TextComponent text='Task managements mobile app' />
                                <View style={{ marginVertical: 28 }}>
                                    <AvatarGroup></AvatarGroup>
                                    <ProgressBarComponent percent={75} />
                                </View>
                                <TextComponent text='Due , December 2024' size={12} />
                            </CardImageComponent>
                        </View>
                        <SpaceComponent width={16} />
                        <View style={{ flex: 1 }}>
                            <CardImageComponent color='rgba(50, 150, 243, 0.9)'>
                                <TouchableOpacity
                                    style={[globalStyles.iconContainer]}>
                                    <MaterialIcons name="edit" size={20} color={colors.text} />
                                </TouchableOpacity>
                                <TitleComponent text='API Payment' size={18} />
                                <AvatarGroup></AvatarGroup>
                                <ProgressBarComponent percent={15} color='coral' size='large' />
                            </CardImageComponent>
                            <SpaceComponent height={16} />
                            <CardImageComponent color='rgba(25, 234, 112, 0.9)'>
                                <TouchableOpacity
                                    style={[globalStyles.iconContainer]}>
                                    <MaterialIcons name="edit" size={20} color={colors.text} />
                                </TouchableOpacity>
                                <TitleComponent text='Update Work' size={18} />
                                <TextComponent text='Revision homepage' />
                            </CardImageComponent>
                        </View>
                    </RowComponent>
                </SectionComponent>

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
                <SpaceComponent height={90} />
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
