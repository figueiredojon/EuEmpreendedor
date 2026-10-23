import React, { useState } from "react";
import {StyleSheet, View, Text, ScrollView, TouchableOpacity} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Feather from '@expo/vector-icons/Feather';
import SearchInput from "../../components/searchInput";
import SegmentedTabs from "../../components/segmentedTabs";
import FilterChip from "../../components/filterChip";
import OrcamentoCard from "../../components/orcamentoCard";

// Dados fictícios (serão substituídos pela API Django)
const orcamentos = [
    { id: '1', cliente: 'João Ferreira', servico: 'Instalação elétrica', valor: 'R$1.200', status: 'Aprovado', data: '2026-09-16' },
    { id: '2', cliente: 'Maria Santos', servico: 'Pintura sala + quartos', valor: 'R$2.800', status: 'Pendente', data: '2026-08-15' },
    { id: '3', cliente: 'Pedro Costa', servico: 'Encanamento banheiro', valor: 'R$650', status: 'Aprovado', data: '2026-05-14' },
    { id: '4', cliente: 'Carla Mendes', servico: 'Quadro de distribuição', valor: 'R$980', status: 'Pendente', data: '2026-06-16' },
    { id: '5', cliente: 'Roberto Alves', servico: 'Reforma de cozinha', valor: 'R$4.500', status: 'Aprovado', data: '2025-09-10' },
];

const TABS = ['Todos', 'Pendentes', 'Aprovados'];
// Mapeia o nome da aba para o status correspondente
const TAB_STATUS = { Pendentes: 'Pendente', Aprovados: 'Aprovado' };

const MESES = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
const anoAtual = 2026;
const qtdeAnos = 20;
const ANOS_ANTERIORES = [];

for (let i = anoAtual; i> anoAtual-qtdeAnos ;i--){
    ANOS_ANTERIORES.push(i);
};

export default function Orcamentos({navigation}){
    const [busca, setBusca] = useState('');
    const [aba, setAba] = useState('Todos');
    const [mesSelecionado, setmesSelecionado] = useState('null');
    const [anoSelecionado, setanoSelecionado] = useState('null');

    const termo = busca.trim().toLowerCase();

    const filtrados = orcamentos.filter((item) => {
        const passaAba = aba === 'Todos' || item.status === TAB_STATUS[aba];
        const passaBusca =
            item.cliente.toLowerCase().includes(termo) ||
            item.servico.toLowerCase().includes(termo);
        return passaAba && passaBusca;
    });

    return (
        <SafeAreaView style={styles.background}>
            {/* CABEÇALHO */}
            <View style={styles.header}>
                <Text style={styles.title}>Orçamentos</Text>
                <TouchableOpacity style={styles.addBtn} onPress={() => navigation.navigate('NovoOrcamento')}>
                    <Feather name="plus" size={20} color="#0F172A" />
                </TouchableOpacity>
            </View>

            <SearchInput
                value={busca}
                onChangeText={setBusca}
                placeholder="Buscar cliente ou serviço..."
            />

            <View style={styles.block}>
                <SegmentedTabs options={TABS} selected={aba} onSelect={setAba} />
            </View>

            <View style={[styles.block, styles.chipsRow]}>
                <FilterChip label="Setembro" active={false} onPress={() => {}} />
                <FilterChip label="2026" active={false} onPress={() => {}} />
            </View>

            <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
                {filtrados.map((item) => (
                    <OrcamentoCard
                        key={item.id}
                        cliente={item.cliente}
                        servico={item.servico}
                        valor={item.valor}
                        status={item.status}
                        data={item.data}
                        onEdit={() => {}}
                        onDelete={() => {}}
                    />
                ))}
                {filtrados.length === 0 && (
                    <Text style={styles.empty}>Nenhum orçamento encontrado.</Text>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        backgroundColor: '#0F172A',
        paddingHorizontal: 20,
        paddingTop: 10,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 16,
    },
    title: {
        color: '#F8FAFC',
        fontSize: 24,
        fontFamily: 'PlusJakartaSans_700Bold',
    },
    addBtn: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: '#FAF9F6',
        justifyContent: 'center',
        alignItems: 'center',
    },
    block: {
        marginTop: 12,
    },
    chipsRow: {
        flexDirection: 'row',
        gap: 10,
    },
    list: {
        marginTop: 16,
    },
    empty: {
        color: '#94A3B8',
        textAlign: 'center',
        marginTop: 24,
        fontFamily: 'PlusJakartaSans_700Bold',
    },
});
