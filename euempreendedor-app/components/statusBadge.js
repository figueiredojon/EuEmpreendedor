import React from "react";
import {StyleSheet, View, Text} from "react-native";

const colors = {
    Aprovado: { bg: '#DCFCE7', text: '#15803D' },
    Pendente: { bg: '#FFEDD5', text: '#C2410C' },
    Recusado: { bg: '#FEE2E2', text: '#B91C1C' },
    Rascunho: { bg: '#E2E8F0', text: '#475569' },
};

export default function StatusBadge({status}){
    const palette = colors[status] || colors.Rascunho;

    return (
        <View style={[badgeStyle.badge, { backgroundColor: palette.bg }]}>
            <Text style={[badgeStyle.text, { color: palette.text }]}>{status}</Text>
        </View>
    );
}

const badgeStyle = StyleSheet.create({
    badge: {
        borderRadius: 12,
        paddingHorizontal: 12,
        paddingVertical: 4,
    },
    text: {
        fontSize: 12,
        fontFamily: 'PlusJakartaSans_700Bold',
    },
});
