import React, { useState } from "react";
import {StyleSheet, View, Text, ScrollView} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import LabeledInput from "../../components/labeledInput";
import SectionHeader from "../../components/sectionHeader";
import ItemCard from "../../components/itemCard";
import AddItemButton from "../../components/addItemButton";
import ButtonPrimary from "../../components/buttons/buttonPrimary";

// Dados fictícios (serão substituídos pela API Django)
const clienteInicial = { nome: 'João Ferreira', telefone: '(11) 99876-5432' };
const itensIniciais = [
    { id: '1', descricao: 'Troca de disjuntor', valor: '120,00' },
    { id: '2', descricao: 'Instalação de tomadas (5 un.)', valor: '350,00' },
];

// "120,00" -> 120 (itens com valor inválido contam como 0)
const parseValor = (texto) => {
    const numero = parseFloat(String(texto).replace(/\./g, '').replace(',', '.'));
    return isNaN(numero) ? 0 : numero;
};

const formatMoeda = (numero) =>
    'R$' + numero.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export default function NovoOrcamento({navigation}){
    const [nome, setNome] = useState(clienteInicial.nome);
    const [telefone, setTelefone] = useState(clienteInicial.telefone);
    const [itens, setItens] = useState(itensIniciais);

    const total = itens.reduce((soma, item) => soma + parseValor(item.valor), 0);

    const addItem = () => {
        setItens([...itens, { id: String(Date.now()), descricao: '', valor: '' }]);
    };

    const updateItem = (id, campo, valor) => {
        setItens(itens.map((item) => item.id === id ? { ...item, [campo]: valor } : item));
    };

    const removeItem = (id) => {
        setItens(itens.filter((item) => item.id !== id));
    };

    return (
        <SafeAreaView style={styles.background}>
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
            >
                {/* CABEÇALHO */}
                <View style={styles.header}>
                    <Text style={styles.title}>Novo orçamento</Text>
                    <View style={styles.badge}>
                        <Text style={styles.badgeText}>Rascunho</Text>
                    </View>
                </View>

                {/* CLIENTE */}
                <SectionHeader title="CLIENTE" />
                <LabeledInput
                    label="Nome completo"
                    value={nome}
                    onChangeText={setNome}
                    placeholder="Nome do cliente"
                />
                <LabeledInput
                    label="Telefone / WhatsApp"
                    value={telefone}
                    onChangeText={setTelefone}
                    placeholder="(00) 00000-0000"
                    keyboardType="phone-pad"
                />

                <View style={styles.divider} />

                {/* ITENS */}
                <SectionHeader title="ITENS DO SERVIÇO" actionLabel="Adicionar" onActionPress={addItem} />
                {itens.map((item) => (
                    <ItemCard
                        key={item.id}
                        descricao={item.descricao}
                        valor={item.valor}
                        onChangeDescricao={(texto) => updateItem(item.id, 'descricao', texto)}
                        onChangeValor={(texto) => updateItem(item.id, 'valor', texto)}
                        onRemove={() => removeItem(item.id)}
                    />
                ))}
                <AddItemButton title="Adicionar item" onPress={addItem} />

                <View style={styles.divider} />

                {/* TOTAL */}
                <View style={styles.totalRow}>
                    <Text style={styles.totalLabel}>Total estimado</Text>
                    <Text style={styles.totalValue}>{formatMoeda(total)}</Text>
                </View>

                <ButtonPrimary title="Gerar resumo" onPress={() => {}} />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        backgroundColor: '#0F172A',
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 32,
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
    badge: {
        backgroundColor: '#1E293B',
        borderWidth: 1,
        borderColor: '#334155',
        borderRadius: 12,
        paddingHorizontal: 12,
        paddingVertical: 4,
    },
    badgeText: {
        color: '#94A3B8',
        fontSize: 12,
        fontFamily: 'PlusJakartaSans_700Bold',
    },
    divider: {
        height: 1,
        backgroundColor: '#1E293B',
        marginVertical: 20,
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    totalLabel: {
        color: '#94A3B8',
        fontSize: 14,
        fontFamily: 'PlusJakartaSans_700Bold',
    },
    totalValue: {
        color: '#F8FAFC',
        fontSize: 24,
        fontFamily: 'PlusJakartaSans_700Bold',
    },
});
