import React, { useEffect, useState } from 'react';
import { FlatList, Modal, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SelectModel } from '../Models/SelectModel';
import TitleComponent from './TitleComponent';
import RowComponent from './rowComponent';
import { globalStyles } from '../styles/globalStyles';
import TextComponent from './TextComponent';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { colors } from '../constants/color';
import ButtonComponent from './ButtonComponent';
import InputComponent from './InputComponent';
import { element } from 'prop-types';

interface Props {
    title?: string,
    items?: SelectModel[],
    selected?: string[],
    onSelect?: (val: string[]) => void,
    multible?: boolean
}

const DropDownPicker = (props: Props) => {
    const { title, items, selected, onSelect, multible } = props
    const [isVisible, setisVisible] = useState(false)
    const [searchKey, setSearchKey] = useState('')
    const [result, setResult] = useState<SelectModel[]>([])
    const [dataSelected, setDataSelected] = useState<string[]>([])

    //Handle Selected
    useEffect(() => {
        selected && setDataSelected(selected)
    }, [isVisible, selected])
    //Handle Search Result

    useEffect(() => {
        if (!searchKey)
            setResult([])
        else {
            const data = items?.filter(elements =>
                elements.label.toLowerCase().includes(searchKey.toLowerCase()))
            setResult(data ?? [])
        }
    }, [searchKey])

    //Handle Select Item
    const handleSelectItems = (id: string) => {
        if (multible) {
            const data = [...dataSelected]
            const index = data?.findIndex(element => element === id)
            if (index !== -1)
                data.splice(index, 1)
            else
                data.push(id)
            setDataSelected(data)
        } else {
            setDataSelected([id])
        }

    }

    //Handle Confirm Button
    const handleConfirm = () => {
        onSelect?.(dataSelected ?? []);
        setisVisible(false);
        setDataSelected([]);
    }

    //Handle Remove Selected
    const handleRemoveSelected = (index: number) => {
        if (selected) {
            selected.splice(index, 1)
            onSelect?.(selected)
        }
    }
    const renderSelectedItem = (id: string, index: number) => {
        const item = items?.find(element => element.value === id)
        return (
            item && (
                <RowComponent
                    styles={{
                        margin: 2,
                        padding: 4,
                        borderRadius: 100,
                        borderWidth: 0.4,
                        borderColor: colors.desc
                    }}
                    key={id}>
                    <TextComponent text={item.label} flex={0} />
                    <TouchableOpacity
                        onPress={() => handleRemoveSelected(index)}
                        style={{ alignSelf: 'flex-start' }}>
                        <Ionicons name="close-outline" size={15} color={colors.desc} />
                    </TouchableOpacity>
                </RowComponent>
            )
        )
    }
    // console.log(items)
    return (
        <View style={{ marginBottom: 16 }}>
            {title && <TitleComponent text={title} />}
            <RowComponent
                onPress={() => setisVisible(true)}
                styles={[
                    globalStyles.inputComponent,
                    {
                        marginTop: title ? 8 : 0,
                        paddingVertical: 14
                    }
                ]}>
                <View style={{ flex: 1, paddingRight: 12 }}>
                    {selected && selected.length > 0 ?
                        <RowComponent justify='flex-start' styles={{ flexWrap: 'wrap' }}>
                            {selected.map((id, index) => renderSelectedItem(id, index))}
                        </RowComponent> : <TextComponent text='Select' flex={0} style={{ color: colors.desc }} />

                    }
                </View>
                <Ionicons name="chevron-down" size={24} color={colors.text} />
            </RowComponent>
            <Modal
                visible={isVisible}
                style={{ flex: 1 }}
                transparent
                animationType='slide'
                statusBarTranslucent
            >
                <View style={[globalStyles.container, {
                    padding: 20,
                    paddingVertical: 60,
                }]}>
                    <FlatList
                        showsVerticalScrollIndicator={false}
                        ListHeaderComponent={
                            <RowComponent >
                                <View style={{ flex: 1, marginRight: 12 }}>
                                    <InputComponent
                                        value={searchKey}
                                        onChange={val => setSearchKey(val)}
                                        placeHolder='Search'
                                        prefix={<Ionicons name="search" size={20} color={colors.text} />}
                                        allowClear
                                    />
                                </View>
                                <TouchableOpacity onPress={() => setisVisible(false)}>
                                    <TextComponent text='Cancel' size={12} style={{ color: 'coral' }} flex={0} />
                                </TouchableOpacity>
                            </RowComponent>
                        }
                        style={{ flex: 1 }}
                        data={searchKey ? result : items}
                        renderItem={({ item }) => (
                            <RowComponent
                                key={item.value}
                                styles={{ paddingVertical: 16 }}
                                onPress={() => handleSelectItems(item.value)}
                            >
                                <TextComponent
                                    text={item.label}
                                    style={{ color: dataSelected.includes(item.value) ? 'coral' : colors.text }} />
                                {dataSelected.includes(item.value) && <Ionicons name="checkmark-circle-outline" size={22} color="coral" />}
                            </RowComponent>
                        )

                        }

                    />
                    <ButtonComponent
                        text='Confirm'
                        onPress={() => handleConfirm()}
                    />
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({})

export default DropDownPicker;
