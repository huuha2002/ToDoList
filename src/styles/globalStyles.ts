import { Platform, StyleSheet } from "react-native";
import { colors } from "../constants/color";
import { fontFamilies } from "../constants/fontFamilies";
export const globalStyles = StyleSheet.create({
    container: {
        backgroundColor: colors.bgColor,
        paddingTop: Platform.OS === 'ios' ? 42 : 32,
        flex: 1
    },
    text: {
        fontSize: 15,
        fontFamily: fontFamilies.regular,
        color: colors.text,

    },
    row: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    section: {
        marginBottom: 16,
        paddingHorizontal: 20
    },
    inputComponent: {
        backgroundColor: colors.gray,
        borderRadius: 12,
        paddingHorizontal: Platform.OS === 'ios' ? 12 : 10,
        paddingVertical: Platform.OS === 'ios' ? 12 : 10
    },
    tag: {
        paddingHorizontal: 20,
        paddingVertical: 6,
        borderRadius: 100,
        backgroundColor: colors.blue
    },
    card: {
        borderRadius: 12,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 100,
        backgroundColor: 'rgba(0,0,0,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12
    }
})