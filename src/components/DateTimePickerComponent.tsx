import React, { useState } from 'react';
import { Button, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import TitleComponent from './TitleComponent';
import RowComponent from './rowComponent';
import TextComponent from './TextComponent';
import { colors } from '../constants/color';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { globalStyles } from '../styles/globalStyles';
import { fontFamilies } from '../constants/fontFamilies';
import SpaceComponent from './SpaceComponent';
import DatePicker from 'react-native-date-picker';

interface Props {
    type?: 'date' | 'time' | 'datetime',
    title?: string,
    placeholder?: string,
    selected?: Date,
    onSelected: (val: Date) => void
}

const DateTimePickerComponent = (props: Props) => {
    const { type, title, placeholder, selected, onSelected } = props
    const [isVisibleModelDateTime, setisVisibleModelDateTime] = useState(false);
    const [date, setDate] = useState(selected ?? new Date())
    return (
        <>
            <View style={{ marginBottom: 16 }}>
                {title && <TitleComponent text={title}></TitleComponent>}
                <RowComponent
                    onPress={() => setisVisibleModelDateTime(true)}
                    styles={[globalStyles.inputComponent, { marginTop: title ? 8 : 0 }]}>
                    <TextComponent
                        flex={1}
                        text={selected ?
                            type === 'time' ?
                                `${selected.getHours()}:${selected.getMinutes()}`
                                :
                                `${selected.getDate()}/${selected.getMonth() + 1}/${selected.getFullYear()}`
                            :
                            placeholder ? placeholder : ''}
                        style={{ color: selected ? colors.text : '#676767' }}
                    />
                    <Ionicons name="chevron-down" size={24} color={colors.text} />
                </RowComponent>
            </View>
            <Modal
                visible={isVisibleModelDateTime}
                transparent
                animationType='slide'
            >
                <View style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: 'rgba(0,0,0,0.5)'
                }}>
                    <View style={{
                        backgroundColor: '#ffffff',
                        width: '90%',
                        margin: 20,
                        padding: 20,
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderRadius: 20
                    }}>
                        <TitleComponent text='Date Time' color='black' />
                        <View>
                            <DatePicker
                                mode={type ? type : 'datetime'}
                                date={date}
                                onDateChange={val => setDate(val)}
                                locale='vi'
                            />
                        </View>
                        <SpaceComponent height={20} />
                        <TouchableOpacity
                            onPress={() => {
                                onSelected(date)
                                setisVisibleModelDateTime(false)
                            }}
                            style={{
                                width: '100%',
                            }}>
                            <Text style={{
                                textAlign: 'center',
                                color: '#3498db',
                                fontSize: 20,
                                fontFamily: fontFamilies.regular
                            }}>Confirm</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => setisVisibleModelDateTime(false)}
                            style={{
                                width: '100%',
                            }}>
                            <Text style={{
                                textAlign: 'center',
                                color: '#3498db',
                                fontSize: 20,
                                fontFamily: fontFamilies.regular
                            }}>Close</Text>
                        </TouchableOpacity>
                    </View>

                </View>
            </Modal>
        </>

    );
}

const styles = StyleSheet.create({})

export default DateTimePickerComponent;
