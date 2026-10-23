import React from "react";
import {StyleSheet, View, Text, TouchableOpacity} from "react-native";
import Feather from '@expo/vector-icons/Feather';
import StatusBadge from "./statusBadge";
import getInitials from "../utils/getInitials";

export default function OrcamentoCard({cliente, servico, valor, status, data, onEdit, onDelete}){
    return (
        <View style={cardStyle.card}>
            <View style={cardStyle.avatar}>
                <Text style={cardStyle.avatarText}>{getInitials(cliente)}</Text>
            </View>

            <View style={cardStyle.info}>
                <View style={cardStyle.topRow}>
                    <Text style={cardStyle.cliente}>{cliente}</Text>
                    <Text style={cardStyle.valor}>{valor}</Text>
                </View>

                <View style={cardStyle.middleRow}>
                    <Text style={cardStyle.servico}>{servico}</Text>
                    <StatusBadge status={status} />
                </View>

                <View style={cardStyle.bottomRow}>
                    <Text style={cardStyle.data}>{data}</Text>
                    <View style={cardStyle.actions}>
                        <TouchableOpacity style={cardStyle.actionBtn} onPress={onEdit}>
                            <Feather name="edit-2" size={14} color="#475569" />
                        </TouchableOpacity>
                        <TouchableOpacity style={[cardStyle.actionBtn, cardStyle.deleteBtn]} onPress={onDelete}>
                            <Feather name="trash-2" size={14} color="#EA580C" />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    );
}

const cardStyle = StyleSheet.create({
    card: {
        flexDirection: 'row',
        gap: 12,
        backgroundColor: '#FAF9F6',
        borderRadius: 16,
        padding: 14,
        marginBottom: 12,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: '#E5E7EB',
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarText: {
        color: '#64748B',
        fontSize: 13,
        fontFamily: 'PlusJakartaSans_700Bold',
    },
    info: {
        flex: 1,
        gap: 6,
    },
    topRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    cliente: {
        color: '#0F172A',
        fontSize: 15,
        fontFamily: 'PlusJakartaSans_700Bold',
    },
    valor: {
        color: '#0F172A',
        fontSize: 15,
        fontFamily: 'PlusJakartaSans_700Bold',
    },
    middleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    servico: {
        flex: 1,
        color: '#64748B',
        fontSize: 12,
        fontFamily: 'PlusJakartaSans_700Bold',
    },
    bottomRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    data: {
        color: '#64748B',
        fontSize: 11,
        fontFamily: 'PlusJakartaSans_700Bold',
    },
    actions: {
        flexDirection: 'row',
        gap: 8,
    },
    actionBtn: {
        width: 32,
        height: 32,
        borderRadius: 10,
        backgroundColor: '#E5E7EB',
        justifyContent: 'center',
        alignItems: 'center',
    },
    deleteBtn: {
        backgroundColor: '#FFEDD5',
    },
});
