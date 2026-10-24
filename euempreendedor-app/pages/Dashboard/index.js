import React, { useState, useCallback } from "react";
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, RefreshControl, ActivityIndicator, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import Entypo from "@expo/vector-icons/Entypo";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";

import api from "../../services/api";
import authStorage from "../../services/auth";
import getInitials from "../../utils/getInitials";

export default function Dashboard({ navigation }) {
    const [orcamentos, setOrcamentos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [usuario, setUsuario] = useState(authStorage.getUser());

    const carregarDados = async () => {
        try {
            setLoading(true);
            const user = authStorage.getUser();
            if (user) {
                setUsuario(user);
            }

            const data = await api.get("/orcamentos/");
            const lista = Array.isArray(data) ? data : (data.results || []);
            setOrcamentos(lista);
        } catch (error) {
            console.log("Erro ao carregar orçamentos no Dashboard:", error.message);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            carregarDados();
        }, [])
    );

    const onRefresh = () => {
        setRefreshing(true);
        carregarDados();
    };

    const handleLogout = () => {
        Alert.alert("Sair da conta", "Deseja encerrar sua sessão?", [
            { text: "Cancelar", style: "cancel" },
            {
                text: "Sair",
                style: "destructive",
                onPress: () => {
                    authStorage.clearSession();
                    navigation.replace("Login");
                }
            }
        ]);
    };

    // Cálculos das Métricas Reais do mês atual
    const mesAtual = new Date().getMonth();
    const anoAtual = new Date().getFullYear();

    const orcamentosMes = orcamentos.filter((orc) => {
        if (!orc.data_emissao) return false;
        const [ano, mes] = orc.data_emissao.split("-").map(Number);
        return ano === anoAtual && mes - 1 === mesAtual;
    });

    const faturamentoEst = orcamentosMes.reduce((acc, orc) => {
        const val = parseFloat(orc.calcular_total) || 0;
        return acc + val;
    }, 0);

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

    const recentes = orcamentos.slice(0, 5);
    const nomeExibicao = usuario?.nome || usuario?.username || "Empreendedor";

    return (
        <SafeAreaView style={dashboardStyles.backGround}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#FAF9F6" />}
            >
                {/* CABEÇALHO */}
                <View style={dashboardStyles.headerContainer}>
                    <View>
                        <Text style={dashboardStyles.greetingSub}>Bom dia,</Text>
                        <Text style={dashboardStyles.greetingName}>{nomeExibicao}</Text>
                    </View>
                    <TouchableOpacity style={dashboardStyles.avatarContainer} onPress={handleLogout}>
                        <Text style={dashboardStyles.avatarText}>{getInitials(nomeExibicao)}</Text>
                    </TouchableOpacity>
                </View>

                {/* MÉTRICAS */}
                <View style={dashboardStyles.rowContainer}>
                    <View style={dashboardStyles.metricsCard}>
                        <Text style={dashboardStyles.metricsTitle}>Orçamentos no mês</Text>
                        <Text style={dashboardStyles.metricsValue}>{orcamentosMes.length}</Text>
                    </View>
                    <View style={dashboardStyles.metricsCard}>
                        <Text style={dashboardStyles.metricsTitle}>Faturamento est.</Text>
                        <Text style={dashboardStyles.metricsValue}>{formatMoeda(faturamentoEst)}</Text>
                    </View>
                </View>

                {/* ATALHOS */}
                <View style={dashboardStyles.sectionContainer}>
                    <Text style={dashboardStyles.sectionTitle}>ATALHOS</Text>

                    <View style={dashboardStyles.rowContainer}>
                        <TouchableOpacity
                            style={dashboardStyles.shortcutBtn}
                            onPress={() => navigation.navigate("NovoOrcamento")}
                        >
                            <View style={dashboardStyles.shortcutIconBox}>
                                <Entypo name="squared-plus" size={22} color="#0F172A" />
                            </View>
                            <Text style={dashboardStyles.shortcutText}>Novo Orçamento</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={dashboardStyles.shortcutBtn}
                            onPress={() => navigation.navigate("Clientes")}
                        >
                            <View style={dashboardStyles.shortcutIconBox}>
                                <SimpleLineIcons name="people" size={20} color="#0F172A" />
                            </View>
                            <Text style={dashboardStyles.shortcutText}>Clientes</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={dashboardStyles.shortcutBtn}
                            onPress={() => navigation.navigate("Orcamentos")}
                        >
                            <View style={dashboardStyles.shortcutIconBox}>
                                <MaterialIcons name="attach-money" size={24} color="#0F172A" />
                            </View>
                            <Text style={dashboardStyles.shortcutText}>Orçamentos</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={dashboardStyles.shortcutBtn}
                            onPress={() => navigation.navigate("Orcamentos")}
                        >
                            <View style={dashboardStyles.shortcutIconBox}>
                                <AntDesign name="area-chart" size={24} color="#0F172A" />
                            </View>
                            <Text style={dashboardStyles.shortcutText}>Relatórios</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* SEÇÃO RECENTES */}
                <View style={dashboardStyles.sectionContainer}>
                    <View style={dashboardStyles.recentesHeader}>
                        <Text style={dashboardStyles.sectionTitle}>RECENTES</Text>
                        <TouchableOpacity onPress={() => navigation.navigate("Orcamentos")}>
                            <Text style={dashboardStyles.verTodosText}>Ver todos</Text>
                        </TouchableOpacity>
                    </View>

                    {loading && !refreshing ? (
                        <ActivityIndicator color="#FAF9F6" style={{ marginTop: 20 }} />
                    ) : recentes.length > 0 ? (
                        recentes.map((item) => (
                            <View key={item.id} style={dashboardStyles.recentesCard}>
                                <View style={dashboardStyles.recentAvatarContainer}>
                                    <Text style={dashboardStyles.textAvatar}>
                                        {getInitials(item.nome_cliente || item.cliente_nome || `Orç #${item.numero}`)}
                                    </Text>
                                </View>
                                <View style={dashboardStyles.recentesTitleCtn}>
                                    <Text style={dashboardStyles.recentesTitle}>
                                        {item.nome_cliente || `Orçamento #${item.numero}`}
                                    </Text>
                                    <Text style={dashboardStyles.recentesSubTitle}>
                                        {formatDataExibicao(item.data_emissao)}
                                    </Text>
                                </View>

                                <View style={dashboardStyles.recentesValueCtn}>
                                    <Text style={dashboardStyles.value}>
                                        {formatMoeda(item.calcular_total)}
                                    </Text>
                                    <Text style={dashboardStyles.statusText}>
                                        {item.status}
                                    </Text>
                                </View>
                            </View>
                        ))
                    ) : (
                        <View style={dashboardStyles.emptyRecentes}>
                            <Text style={dashboardStyles.emptyText}>Nenhum orçamento cadastrado ainda.</Text>
                            <TouchableOpacity
                                style={dashboardStyles.emptyBtn}
                                onPress={() => navigation.navigate("NovoOrcamento")}
                            >
                                <Text style={dashboardStyles.emptyBtnText}>+ Criar Primeiro Orçamento</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const dashboardStyles = StyleSheet.create({
    backGround: {
        flex: 1,
        backgroundColor: "#0F172A",
        paddingHorizontal: 20,
        paddingTop: 10,
    },
    headerContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingTop: 10,
        paddingBottom: 20,
    },
    greetingSub: {
        color: "#94A3B8",
        fontSize: 14,
        fontFamily: "PlusJakartaSans_700Bold",
        marginBottom: 2,
    },
    greetingName: {
        color: "#F8FAFC",
        fontSize: 22,
        fontFamily: "PlusJakartaSans_700Bold",
    },
    avatarContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: "#1E293B",
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#334155",
    },
    avatarText: {
        color: "#F8FAFC",
        fontSize: 16,
        fontFamily: "PlusJakartaSans_700Bold",
    },
    rowContainer: {
        flexDirection: "row",
        gap: 12,
    },
    sectionContainer: {
        marginTop: 26,
    },
    recentesHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 16,
    },
    sectionTitle: {
        color: "#94A3B8",
        fontSize: 12,
        fontFamily: "PlusJakartaSans_700Bold",
        letterSpacing: 1,
    },
    verTodosText: {
        color: "#F8FAFC",
        fontSize: 12,
        fontFamily: "PlusJakartaSans_700Bold",
    },
    metricsCard: {
        flex: 1,
        backgroundColor: "#FAF9F6",
        padding: 16,
        borderRadius: 16,
        minHeight: 104,
        justifyContent: "space-between",
    },
    metricsTitle: {
        fontSize: 12,
        color: "#64748B",
        fontFamily: "PlusJakartaSans_700Bold",
    },
    metricsValue: {
        fontSize: 22,
        color: "#0F172A",
        fontFamily: "PlusJakartaSans_700Bold",
    },
    shortcutBtn: {
        flex: 1,
        alignItems: "center",
    },
    shortcutIconBox: {
        width: 56,
        height: 56,
        backgroundColor: "#FAF9F6",
        borderRadius: 16,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 8,
    },
    shortcutText: {
        color: "#F8FAFC",
        fontSize: 11,
        fontFamily: "PlusJakartaSans_700Bold",
        textAlign: "center",
    },
    recentesCard: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FAF9F6",
        borderRadius: 16,
        padding: 14,
        marginBottom: 12,
    },
    recentAvatarContainer: {
        width: 38,
        height: 38,
        borderRadius: 12,
        backgroundColor: "#1E293B",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 12,
    },
    textAvatar: {
        color: "#FAF9F6",
        fontSize: 13,
        fontFamily: "PlusJakartaSans_700Bold",
    },
    recentesTitleCtn: {
        flex: 1,
    },
    recentesTitle: {
        fontSize: 14,
        color: "#0F172A",
        fontFamily: "PlusJakartaSans_700Bold",
    },
    recentesSubTitle: {
        fontSize: 11,
        color: "#64748B",
        fontFamily: "PlusJakartaSans_700Bold",
        marginTop: 2,
    },
    recentesValueCtn: {
        alignItems: "flex-end",
    },
    value: {
        fontSize: 15,
        color: "#0F172A",
        fontFamily: "PlusJakartaSans_700Bold",
    },
    statusText: {
        fontSize: 11,
        color: "#EA580C",
        fontFamily: "PlusJakartaSans_700Bold",
        marginTop: 2,
    },
    emptyRecentes: {
        backgroundColor: "#1E293B",
        borderRadius: 16,
        padding: 24,
        alignItems: "center",
        gap: 10,
    },
    emptyText: {
        color: "#94A3B8",
        fontSize: 13,
        fontFamily: "PlusJakartaSans_700Bold",
    },
    emptyBtn: {
        backgroundColor: "#FAF9F6",
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 12,
    },
    emptyBtnText: {
        color: "#0F172A",
        fontSize: 12,
        fontFamily: "PlusJakartaSans_700Bold",
    },
});
