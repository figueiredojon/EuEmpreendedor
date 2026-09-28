import React from "react";
import {StyleSheet, View, Text, TouchableOpacity, FlatList, ScrollView} from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import Entypo from '@expo/vector-icons/Entypo';
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import AntDesign from '@expo/vector-icons/AntDesign';



export default function Dashboard(){
    const recentes = [
        { id: '1', cliente: 'João Silva', valor: 'R$ 1.200,00', status: 'Aprovado', data: 'Hoje'},
        { id: '2', cliente: 'Maria Souza', valor: 'R$ 850,00', status: 'Pendente', data: 'Ontem'},
        { id: '3', cliente: 'Carlos Mendes', valor: 'R$ 3.400,00', status: 'Aprovado', data: '14 Set'},
    ];

    const getInitials = (cliente) => {
        const clienteParts = cliente.split(' ');

        const LetterfirstName = clienteParts[0][0];

        const LetterSurName = clienteParts[clienteParts.length - 1][0];

        return `${LetterfirstName}${LetterSurName}`.toUpperCase();
    }

    return (
        <SafeAreaView style={dashboardStyles.backGround}>
            
            {/* CABEÇALHO */}
            <View style={dashboardStyles.headerContainer}>
                <View>
                    <Text style={dashboardStyles.greetingSub}>Bom dia,</Text>
                    <Text style={dashboardStyles.greetingName}>Jonatas Figueiredo</Text>
                </View>
                <View style={dashboardStyles.avatarContainer}>
                    <Text style={dashboardStyles.avatarText}>JF</Text>
                </View>
            </View>

            {/* MÉTRICAS */}
            <View style={dashboardStyles.rowContainer}>
                <View style={dashboardStyles.metricsCard}>
                    <Text style={dashboardStyles.metricsTitle}>Orçamentos no mês</Text>
                    <Text style={dashboardStyles.metricsValue}>12</Text>
                </View>
                <View style={dashboardStyles.metricsCard}>
                    <Text style={dashboardStyles.metricsTitle}>Faturamento est.</Text>
                    <Text style={dashboardStyles.metricsValue}>R$ 4.500</Text>
                </View>
            </View>
                
            {/* ATALHOS */}
            <View style={dashboardStyles.sectionContainer}>
                <Text style={dashboardStyles.sectionTitle}>ATALHOS</Text>
                
                <View style={dashboardStyles.rowContainer}>
                    <TouchableOpacity style={dashboardStyles.shortcutBtn}>
                        <View style={dashboardStyles.shortcutIconBox}>
                            <Entypo name="squared-plus" size={22} color="#0F172A"/>
                        </View>
                        <Text style={dashboardStyles.shortcutText}>Novo Orçamento</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity style={dashboardStyles.shortcutBtn}>
                        <View style={dashboardStyles.shortcutIconBox}>
                            <SimpleLineIcons name="people" size={20} color="#0F172A" />
                        </View>
                        <Text style={dashboardStyles.shortcutText}>Clientes</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity style={dashboardStyles.shortcutBtn}>
                        <View style={dashboardStyles.shortcutIconBox}>
                            <MaterialIcons name="attach-money" size={24} color="#0F172A" />
                        </View>
                        <Text style={dashboardStyles.shortcutText}>Despesas</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity style={dashboardStyles.shortcutBtn}>
                        <View style={dashboardStyles.shortcutIconBox}>
                            <AntDesign name="area-chart" size={24} color="black" />
                        </View>
                        <Text style={dashboardStyles.shortcutText}>Relatórios</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView style={dashboardStyles.sectionContainer}>
                <Text style={dashboardStyles.sectionTitle}>RECENTES</Text>
                
                {recentes.map((item) => (
                    <View key={item.id} style={dashboardStyles.recentesCard}>
                        <View style={dashboardStyles.recentAvatarContainer}>
                            <Text style={dashboardStyles.textAvatar}>{getInitials(item.cliente)}</Text>
                        </View>
                        <View style={dashboardStyles.recentesTitleCtn}>
                            <Text style={dashboardStyles.recentesTitle}>{item.cliente}</Text>
                            <Text style={dashboardStyles.recentesTitle}>{item.data}</Text>
                        </View>
                    
                        <View style={dashboardStyles.recentesValueCtn}>
                            <Text style={dashboardStyles.value}>{item.valor}</Text>
                            <Text style={dashboardStyles.recentesTitle}>{item.status}</Text>
                        </View>
                        
                    </View>
                ))}

            </ScrollView>
            
        </SafeAreaView>
    )
}

const dashboardStyles = StyleSheet.create({
    backGround:{
        flex: 1,
        backgroundColor: '#0F172A', // Slate 900
        paddingHorizontal: 20,
        paddingTop: 10,
    },

    // --- CABEÇALHO ---
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 10,
        paddingBottom: 20,
    },
    greetingSub: {
        color: '#94A3B8', // Slate 400
        fontSize: 14,
        fontFamily: 'PlusJakartaSans_700Bold',
        marginBottom: 2,
    },
    greetingName: {
        color: '#F8FAFC', // Slate 50
        fontSize: 22,
        fontFamily: 'PlusJakartaSans_700Bold',
    },
    avatarContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#1E293B', // Slate 800
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#334155', // Slate 700
    },
    avatarText: {
        color: '#F8FAFC',
        fontSize: 16,
        fontFamily: 'PlusJakartaSans_700Bold',
    },

    // --- CONTAINERS GERAIS ---
    rowContainer:{
        flexDirection: 'row',
        gap: 12,
    },
    sectionContainer: {
        marginTop: 32,
    },
    sectionTitle:{
        color: '#94A3B8', // Slate 400
        fontSize: 12,
        fontFamily: 'PlusJakartaSans_700Bold',
        letterSpacing: 1, // Dá um ar sofisticado para textos maiúsculos
        marginBottom: 16,
    },

    // --- MÉTRICAS ---
    metricsCard:{
        flex: 1,
        backgroundColor: '#FAF9F6', // O off-white que você escolheu
        padding: 16,
        borderRadius: 16,
        minHeight: 104,
        justifyContent: 'space-between',
    },
    metricsTitle: {
        fontSize: 12,
        color: '#64748B', // Slate 500 para contraste suave no fundo claro
        fontFamily: 'PlusJakartaSans_700Bold',
    },
    metricsValue: {
        fontSize: 24,
        color: '#0F172A',
        fontFamily: 'PlusJakartaSans_700Bold',
    },

    // --- ATALHOS ---
    shortcutBtn: {
        flex: 1, // Substitui os 22%. Faz os 4 botões dividirem o espaço perfeitamente!
        alignItems: 'center',
    },
    shortcutIconBox: {
        width: 56,
        height: 56,
        backgroundColor: '#FAF9F6',
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    shortcutText: {
        color: '#F8FAFC',
        fontSize: 11,
        fontFamily: 'PlusJakartaSans_700Bold',
        textAlign: 'center',
    },

    // --- RECENTES ---
    recentesCard:{
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FAF9F6',
        borderRadius: 16,
        padding: 14,
        marginBottom: 12,
    },

    recentesTitle:{
        fontSize: 12,
        color: '#0F172A',
        fontFamily: 'PlusJakartaSans_700Bold',
        paddingLeft: 12,
    },

    recentesTitleCtn:{
        flex: 1,
    },

    recentesValueCtn:{
        alignItems:'flex-end',
    },

    value:{
        fontSize: 16,
        color: '#0F172A',
        fontFamily: 'PlusJakartaSans_700Bold',
        paddingLeft: 12,
    },

    recentAvatarContainer:{
        width: 32,
        height: 32,
        borderRadius: 14,
        backgroundColor: '#1E293B', // Slate 800
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },

    textAvatar:{
        color: '#FAF9F6',
    }
})