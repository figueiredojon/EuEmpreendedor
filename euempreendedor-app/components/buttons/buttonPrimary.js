import React from "react";
import {StyleSheet, Text, TouchableOpacity} from "react-native";

export default function ButtonPrimary({title, style, onPress}){
    return (
        <TouchableOpacity style={[buttonStyle.btn, style]} onPress={onPress}>
            <Text style={buttonStyle.title}>{title}</Text>
        </TouchableOpacity>
    );
}

const buttonStyle = StyleSheet.create({
    btn: {
        backgroundColor: '#FAF9F6',
        borderRadius: 16,
        paddingVertical: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        color: '#0F172A',
        fontSize: 16,
        fontFamily: 'PlusJakartaSans_700Bold',
    },
});
