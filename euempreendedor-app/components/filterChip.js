import React from "react";
import {StyleSheet, Text, TouchableOpacity} from "react-native";
import Feather from '@expo/vector-icons/Feather';

export default function FilterChip({label, active, onPress}){
    return (
        <TouchableOpacity
            style={[chipStyle.chip, active && chipStyle.chipActive]}
            onPress={onPress}
        >
            <Feather name="clock" size={13} color={active ? '#0F172A' : '#94A3B8'} />
            <Text style={[chipStyle.text, active && chipStyle.textActive]}>{label}</Text>
        </TouchableOpacity>
    );
}

const chipStyle = StyleSheet.create({
    chip: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        backgroundColor: '#1E293B',
        borderWidth: 1,
        borderColor: '#334155',
        borderRadius: 14,
        paddingVertical: 12,
    },
    chipActive: {
        backgroundColor: '#FAF9F6',
    },
    text: {
        color: '#94A3B8',
        fontSize: 13,
        fontFamily: 'PlusJakartaSans_700Bold',
    },
    textActive: {
        color: '#0F172A',
    },
});
