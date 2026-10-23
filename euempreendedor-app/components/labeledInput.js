import React from "react";
import {StyleSheet, View, Text, TextInput} from "react-native";

export default function LabeledInput({label, style, ...inputProps}){
    return (
        <View style={[inputStyle.container, style]}>
            <Text style={inputStyle.label}>{label}</Text>
            <TextInput
                style={inputStyle.input}
                placeholderTextColor="#64748B"
                {...inputProps}
            />
        </View>
    );
}

const inputStyle = StyleSheet.create({
    container: {
        marginBottom: 14,
    },
    label: {
        color: '#F8FAFC',
        fontSize: 12,
        fontFamily: 'PlusJakartaSans_700Bold',
        marginBottom: 6,
    },
    input: {
        backgroundColor: '#1E293B',
        borderWidth: 1,
        borderColor: '#334155',
        borderRadius: 14,
        paddingHorizontal: 16,
        paddingVertical: 14,
        color: '#F8FAFC',
        fontSize: 15,
        fontFamily: 'PlusJakartaSans_700Bold',
    },
});
