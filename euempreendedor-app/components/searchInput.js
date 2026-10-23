import React from "react";
import {StyleSheet, View, TextInput} from "react-native";
import Feather from '@expo/vector-icons/Feather';

export default function SearchInput({value, onChangeText, placeholder}){
    return (
        <View style={searchStyle.container}>
            <Feather name="search" size={18} color="#64748B" />
            <TextInput
                style={searchStyle.input}
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                placeholderTextColor="#64748B"
            />
        </View>
    );
}

const searchStyle = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        backgroundColor: '#1E293B',
        borderWidth: 1,
        borderColor: '#334155',
        borderRadius: 14,
        paddingHorizontal: 16,
    },
    input: {
        flex: 1,
        paddingVertical: 14,
        color: '#F8FAFC',
        fontSize: 14,
        fontFamily: 'PlusJakartaSans_700Bold',
    },
});
