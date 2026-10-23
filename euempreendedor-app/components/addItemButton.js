import React from "react";
import {StyleSheet, Text, TouchableOpacity} from "react-native";

export default function AddItemButton({title, onPress}){
    return (
        <TouchableOpacity style={addStyle.btn} onPress={onPress}>
            <Text style={addStyle.text}>+  {title}</Text>
        </TouchableOpacity>
    );
}

const addStyle = StyleSheet.create({
    btn: {
        borderWidth: 1,
        borderStyle: 'dashed',
        borderColor: '#334155',
        borderRadius: 16,
        paddingVertical: 16,
        alignItems: 'center',
    },
    text: {
        color: '#94A3B8',
        fontSize: 14,
        fontFamily: 'PlusJakartaSans_700Bold',
    },
});
