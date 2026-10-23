import React from "react";
import {StyleSheet, View, Text, TouchableOpacity} from "react-native";

export default function SectionHeader({title, actionLabel, onActionPress}){
    return (
        <View style={sectionStyle.container}>
            <Text style={sectionStyle.title}>{title}</Text>
            {actionLabel && (
                <TouchableOpacity onPress={onActionPress}>
                    <Text style={sectionStyle.action}>+ {actionLabel}</Text>
                </TouchableOpacity>
            )}
        </View>
    );
}

const sectionStyle = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    title: {
        color: '#94A3B8',
        fontSize: 12,
        letterSpacing: 1,
        fontFamily: 'PlusJakartaSans_700Bold',
    },
    action: {
        color: '#F8FAFC',
        fontSize: 13,
        fontFamily: 'PlusJakartaSans_700Bold',
    },
});
