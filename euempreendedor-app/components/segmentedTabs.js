import React from "react";
import {StyleSheet, View, Text, TouchableOpacity} from "react-native";

export default function SegmentedTabs({options, selected, onSelect}){
    return (
        <View style={tabsStyle.container}>
            {options.map((option) => {
                const active = option === selected;
                return (
                    <TouchableOpacity
                        key={option}
                        style={[tabsStyle.tab, active && tabsStyle.tabActive]}
                        onPress={() => onSelect(option)}
                    >
                        <Text style={[tabsStyle.text, active && tabsStyle.textActive]}>{option}</Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
}

const tabsStyle = StyleSheet.create({
    container: {
        flexDirection: 'row',
        backgroundColor: '#1E293B',
        borderWidth: 1,
        borderColor: '#334155',
        borderRadius: 14,
        padding: 4,
    },
    tab: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 10,
        borderRadius: 10,
    },
    tabActive: {
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
