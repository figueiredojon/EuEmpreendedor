import React, { useState, useCallback } from "react";
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Alert, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import Feather from "@expo/vector-icons/Feather";
import Ionicons from "@expo/vector-icons/Ionicons";

import SearchInput from "../../components/searchInput";
import SegmentedTabs from "../../components/segmentedTabs";
import OrcamentoCard from "../../components/orcamentoCard";
import api from "../../services/api";

const TABS = ["Todos", "Pendentes", "Aprovados"];
const TAB_STATUS = { Pendentes: "PENDENTE", Aprovados: "APROVADO" };

export default function Orcamentos({ navigation }) {
    const [orcamentos, setOrcamentos] = useState([]);
    const [busca, setBusca] = useState("");
    const [aba, setAba] = useState("Todos");
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    const carregarOrcamentos = async () => {
        try {
            setLoading(true);
            const data = await api.get("/orcamentos/");
            const lista = Array.isArray(data) ? data : (data.results || []);
            setOrcamentos(lista);
        } catch (error) {
            Alert.alert("Erro", "Não foi possível carregar os orçamentos: " + error.message);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            carregarOrcamentos();
        }, [])
    );

    const onRefresh = () => {
        setRefreshing(true);
        carregarOrcamentos();
    };

    const handleExcluirOrcamento = (id, numero) => {
        Alert.alert(
            "Excluir Orçamento",
            `Deseja realmente excluir o Orçamento #${numero}?`,
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Excluir",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await api.delete(`/orcamentos/${id}/`);
                            carregarOrcamentos();
                        } catch (error) {
                            Alert.alert("Erro", "Não foi possível excluir: " + error.message);
                        }
                    }
                }
            ]
        );
    };

    const formatMoeda = (valor) => {
        return "R$ " + (Number(valor) || 0).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    };

    const formatDataExibicao = (dataStr) => {
        if (!dataStr) return "";
        try {
            const [ano, mes, dia] = dataStr.split("-");
            return `${dia}/${mes}/${ano}`;
        } catch {
            return dataStr;
        }
    };

    const termo = busca.trim().toLowerCase();

    const filtrados = orcamentos.filter((item) => {
        const statusItem = (item.status || "").toUpperCase();
        const passaAba = aba === "Todos" || statusItem === TAB_STATUS[aba];

        const nomeCliente = (item.nome_cliente || "").toLowerCase();
        const descricoes = (item.itens || []).map((i) => (i.descricao || "").toLowerCase()).join(" ");
        const numero = String(item.numero || "");

        const passaBusca = !termo || nomeCliente.includes(termo) || descricoes.includes(termo) || numero.includes(termo);

        return passaAba && passaBusca;
    });

    return (
        <SafeAreaView style={styles.background}>
            {/* CABEÇALHO */}
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                        <Feather name="arrow-left" size={22} color="#F8FAFC" />
                    </TouchableOpacity>
                    <Text style={styles.title}>Orçamentos</Text>
                </View>

                <TouchableOpacity style={styles.addBtn} onPress={() => navigation.navigate("NovoOrcamento")}>
                    <Feather name="plus" size={20} color="#0F172A" />
                </TouchableOpacity>
            </View>

            <SearchInput
                value={busca}
                onChangeText={setBusca}
                placeholder="Buscar cliente, serviço ou nº..."
            />

            <View style={styles.block}>
                <SegmentedTabs options={TABS} selected={aba} onSelect={setAba} />
            </View>

            {loading && !refreshing ? (
                <View style={styles.centerContainer}>
                    <ActivityIndicator size="large" color="#FAF9F6" />
                </View>
            ) : (
                <ScrollView
                    style={styles.list}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#FAF9F6" />
                    }
                >
                    {filtrados.map((item) => {
                        const primeiroServico = (item.itens && item.itens[0]?.descricao) || "Serviços diversos";
                        return (
                            <OrcamentoCard
                                key={item.id}
                                cliente={item.nome_cliente || `Orçamento #${item.numero}`}
                                servico={primeiroServico}
                                valor={formatMoeda(item.calcular_total)}
                                status={item.status}
                                data={formatDataExibicao(item.data_emissao)}
                                onEdit={() => {}}
                                onDelete={() => handleExcluirOrcamento(item.id, item.numero)}
                            />
                        );
                    })}

                    {filtrados.length === 0 && !loading && (
                        <View style={styles.emptyContainer}>
                            <Ionicons name="document-text-outline" size={48} color="#64748B" />
                            <Text style={styles.empty}>Nenhum orçamento encontrado.</Text>
                            <TouchableOpacity
                                style={styles.emptyBtn}
                                onPress={() => navigation.navigate("NovoOrcamento")}
                            >
                                <Text style={styles.emptyBtnText}>+ Criar Novo Orçamento</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </ScrollView>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        backgroundColor: "#0F172A",
        paddingHorizontal: 20,
        paddingTop: 10,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 16,
    },
    headerLeft: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },
    backBtn: {
        padding: 4,
    },
    title: {
        color: "#F8FAFC",
        fontSize: 24,
        fontFamily: "PlusJakartaSans_700Bold",
    },
    addBtn: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: "#FAF9F6",
        justifyContent: "center",
        alignItems: "center",
    },
    block: {
        marginTop: 12,
    },
    list: {
        marginTop: 16,
    },
    centerContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 40,
    },
    emptyContainer: {
        alignItems: "center",
        justifyContent: "center",
        marginTop: 60,
        gap: 12,
    },
    empty: {
        color: "#94A3B8",
        textAlign: "center",
        fontFamily: "PlusJakartaSans_700Bold",
        fontSize: 14,
    },
    emptyBtn: {
        marginTop: 8,
        paddingVertical: 10,
        paddingHorizontal: 18,
        borderRadius: 12,
        backgroundColor: "#1E293B",
    },
    emptyBtnText: {
        color: "#F8FAFC",
        fontSize: 13,
        fontFamily: "PlusJakartaSans_700Bold",
    },
});
