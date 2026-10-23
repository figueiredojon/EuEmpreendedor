import React from "react";
import {StyleSheet, View, Text, TextInput, TouchableOpacity} from "react-native";
import Feather from '@expo/vector-icons/Feather';

export default function ItemCard({descricao, valor, onChangeDescricao, onChangeValor, onRemove}){
    return (
        <View style={itemStyle.card}>
            <View style={itemStyle.topRow}>
                <TextInput
                    style={itemStyle.descricao}
                    value={descricao}
                    onChangeText={onChangeDescricao}
                    placeholder="Descrição do serviço"
                    placeholderTextColor="#64748B"
                />
                <TouchableOpacity onPress={onRemove} hitSlop={10}>
                    <Feather name="trash-2" size={16} color="#94A3B8" />
                </TouchableOpacity>
            </View>

            <View style={itemStyle.valueRow}>
                <Text style={itemStyle.currency}>R$</Text>
                <TextInput
                    style={itemStyle.valor}
                    value={valor}
                    onChangeText={onChangeValor}
                    placeholder="0,00"
                    placeholderTextColor="#64748B"
                    keyboardType="decimal-pad"
                />
            </View>
        </View>
    );
}

const itemStyle = StyleSheet.create({
    card: {
        backgroundColor: '#1E293B',
        borderWidth: 1,
        borderColor: '#334155',
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
    },
    topRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
    },
    descricao: {
        flex: 1,
        color: '#F8FAFC',
        fontSize: 15,
        fontFamily: 'PlusJakartaSans_700Bold',
        padding: 0,
    },
    valueRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginTop: 12,
    },
    currency: {
        color: '#94A3B8',
        fontSize: 14,
        fontFamily: 'PlusJakartaSans_700Bold',
    },
    valor: {
        flex: 1,
        color: '#F8FAFC',
        fontSize: 15,
        fontFamily: 'PlusJakartaSans_700Bold',
        padding: 0,
    },
});
