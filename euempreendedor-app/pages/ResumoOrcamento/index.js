import React from "react";
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from "react-native";
import { Feather } from "@expo/vector-icons";
import getInitials from "../../utils/getInitials";
import { SafeAreaView } from "react-native-safe-area-context";
import StatusBadge from "../../components/statusBadge";

export default function ResumoOrcamento({ route, navigation }) {
    const formatMoeda = (valor) => {
        return Number(valor || 0).toLocaleString('pt-BR', {
            style: "currency",
            currency: "BRL"
        })
    };

    const formatData = (data) => {
        try {
            if (data){
                /* Formato data simples
                const [ano, mes, dia] = data.split("-");
                return `${dia}/${mes}/${ano}`; ou */ 

                /*Formato que o Django retorna */
                const apenasData = data.split("T")[0];
                const [ano, mes, dia] = apenasData.split("-");
                return `${dia}/${mes}/${ano}`;
            } else {
                /* Caso não retorne nada da API */
                const hoje = new Date();
                const dia = String(hoje.getDate()).padStart(2, "0");
                const mes = String(hoje.getMonth() + 1).padStart(2, "0");
                const ano = hoje.getFullYear();

                return `${dia}/${mes}/${ano}`;
            }
        } catch {
            return data;
        }
        
        
    };

    const { orcamento } = route.params || {};

    return (
        <SafeAreaView style={stylesResumo.container}>
            {/* CABEÇALHO */}
            <View style={stylesResumo.header}>
                <TouchableOpacity
                    onPress={() => navigation.navigate("Orcamentos")}
                    style={stylesResumo.backButton}
                >
                    <Feather name="arrow-left" size={22} color="#F8FAFC" />
                </TouchableOpacity>
                <Text style={stylesResumo.headerTitle}>Resumo do orçamento</Text>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={stylesResumo.scrollContent}>
                {/* CARD DO CLIENTE */}
                <View style={stylesResumo.clientCard}>
                    <View style={stylesResumo.avatarBox}>
                        <Text style={stylesResumo.avatarText}>
                            {getInitials(orcamento?.nome_cliente || "CL")}
                        </Text>
                    </View>

                    <View style={stylesResumo.clientInfo}>
                        <Text style={stylesResumo.clientName}>
                            {orcamento?.nome_cliente || "Cliente"}
                        </Text>
                        <Text style={stylesResumo.clientMeta}>
                            {orcamento?.telefone} • {formatData(orcamento?.data_emissao)}
                        </Text>
                    </View>

                    <StatusBadge status={orcamento?.status} />
                </View>

                {/* CARD DOS ITENS */}
                <View style={stylesResumo.itemsCard}>
                    {orcamento?.itens?.map((item, index) => (
                        <View
                            key={item.id || index}
                            style={[
                                stylesResumo.itemRow,
                                index < (orcamento?.itens?.length || 0) - 1 && stylesResumo.itemBorderBottom,
                            ]}
                        >
                            <Text style={stylesResumo.itemDescricao}>{item.descricao}</Text>
                            <Text style={stylesResumo.itemValor}>{formatMoeda(item.valor)}</Text>
                        </View>
                    ))}
                </View>

                {/* CARD DO TOTAL */}
                <View style={stylesResumo.totalCard}>
                    <View>
                        <Text style={stylesResumo.totalLabel}>Total do orçamento</Text>
                        <Text style={stylesResumo.totalValue}>{formatMoeda(orcamento?.calcular_total)}</Text>
                    </View>

                    <View style={stylesResumo.validadeBox}>
                        <Text style={stylesResumo.validadeLabel}>Validade</Text>
                        <Text style={stylesResumo.validadeDias}>30 dias</Text>
                    </View>
                </View>

                {/* BOTÕES DE AÇÃO */}
                <View style={stylesResumo.actionsContainer}>
                    <TouchableOpacity style={stylesResumo.btnPrimary}>
                        <Feather name="file-text" size={18} color="#0F172A" />
                        <Text style={stylesResumo.btnPrimaryText}>Gerar PDF</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={stylesResumo.btnSecondary}>
                        <Feather name="share-2" size={18} color="#F8FAFC" />
                        <Text style={stylesResumo.btnSecondaryText}>Compartilhar</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const stylesResumo = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#0F172A", // Dark Slate
        paddingHorizontal: 20,
        paddingTop: 10,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        paddingVertical: 16,
    },
    backButton: {
        padding: 4,
    },
    headerTitle: {
        color: "#F8FAFC",
        fontSize: 20,
        fontFamily: "PlusJakartaSans_700Bold",
    },
    scrollContent: {
        paddingBottom: 40,
        gap: 16,
    },
    clientCard: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FAF9F6",
        borderRadius: 20,
        padding: 16,
        gap: 12,
    },
    avatarBox: {
        width: 44,
        height: 44,
        borderRadius: 14,
        backgroundColor: "#E2E8F0",
        justifyContent: "center",
        alignItems: "center",
    },
    avatarText: {
        color: "#475569",
        fontSize: 15,
        fontFamily: "PlusJakartaSans_700Bold",
    },
    clientInfo: {
        flex: 1,
        gap: 2,
    },
    clientName: {
        color: "#0F172A",
        fontSize: 16,
        fontFamily: "PlusJakartaSans_700Bold",
    },
    clientMeta: {
        color: "#64748B",
        fontSize: 12,
        fontFamily: "PlusJakartaSans_700Bold",
    },
    itemsCard: {
        backgroundColor: "#FAF9F6",
        borderRadius: 20,
        paddingVertical: 8,
        paddingHorizontal: 18,
    },
    itemRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 14,
        gap: 12,
    },
    itemBorderBottom: {
        borderBottomWidth: 1,
        borderBottomColor: "#E2E8F0",
    },
    itemDescricao: {
        flex: 1,
        color: "#0F172A",
        fontSize: 14,
        fontFamily: "PlusJakartaSans_700Bold",
    },
    itemValor: {
        color: "#0F172A",
        fontSize: 14,
        fontFamily: "PlusJakartaSans_700Bold",
    },
    totalCard: {
        backgroundColor: "#1E293B",
        borderRadius: 20,
        padding: 20,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#334155",
    },
    totalLabel: {
        color: "#94A3B8",
        fontSize: 12,
        fontFamily: "PlusJakartaSans_700Bold",
        marginBottom: 4,
    },
    totalValue: {
        color: "#F8FAFC",
        fontSize: 24,
        fontFamily: "PlusJakartaSans_700Bold",
    },
    validadeBox: {
        alignItems: "flex-end",
    },
    validadeLabel: {
        color: "#94A3B8",
        fontSize: 12,
        fontFamily: "PlusJakartaSans_700Bold",
    },
    validadeDias: {
        color: "#94A3B8",
        fontSize: 13,
        fontFamily: "PlusJakartaSans_700Bold",
    },
    actionsContainer: {
        gap: 12,
        marginTop: 8,
    },
    btnPrimary: {
        backgroundColor: "#FAF9F6",
        borderRadius: 16,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 16,
        gap: 8,
    },
    btnPrimaryText: {
        color: "#0F172A",
        fontSize: 15,
        fontFamily: "PlusJakartaSans_700Bold",
    },
    btnSecondary: {
        backgroundColor: "transparent",
        borderRadius: 16,
        borderWidth: 1,
        borderColor: "#334155",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 16,
        gap: 8,
    },
    btnSecondaryText: {
        color: "#F8FAFC",
        fontSize: 15,
        fontFamily: "PlusJakartaSans_700Bold",
    },
});
