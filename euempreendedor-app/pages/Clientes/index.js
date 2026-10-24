import React, { useState, useCallback } from "react";
import {
    StyleSheet,
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Modal,
    ActivityIndicator,
    Alert,
    RefreshControl
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import Feather from "@expo/vector-icons/Feather";
import Ionicons from "@expo/vector-icons/Ionicons";

import SearchInput from "../../components/searchInput";
import LabeledInput from "../../components/labeledInput";
import ButtonPrimary from "../../components/buttons/buttonPrimary";
import getInitials from "../../utils/getInitials";
import api from "../../services/api";

export default function Clientes({ navigation }) {
    const [clientes, setClientes] = useState([]);
    const [busca, setBusca] = useState("");
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    // Estado do Modal de Cadastro de Cliente
    const [modalVisible, setModalVisible] = useState(false);
    const [salvando, setSalvando] = useState(false);
    const [nome, setNome] = useState("");
    const [telefone, setTelefone] = useState("");
    const [cpfCnpj, setCpfCnpj] = useState("");
    const [endereco, setEndereco] = useState("");

    const carregarClientes = async () => {
        try {
            setLoading(true);
            const data = await api.get("/clientes/");
            setClientes(Array.isArray(data) ? data : (data.results || []));
        } catch (error) {
            Alert.alert("Erro", "Não foi possível carregar os clientes: " + error.message);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            carregarClientes();
        }, [])
    );

    const onRefresh = () => {
        setRefreshing(true);
        carregarClientes();
    };

    const handleSalvarCliente = async () => {
        if (!nome.trim() || !telefone.trim()) {
            Alert.alert("Atenção", "Preencha ao menos o Nome e o Telefone do cliente.");
            return;
        }

        setSalvando(true);
        try {
            await api.post("/clientes/", {
                nome_cliente: nome.trim(),
                telefone: telefone.trim(),
                cpf_cnpj: cpfCnpj.trim(),
                endereco: endereco.trim()
            });

            Alert.alert("Sucesso", "Cliente cadastrado com sucesso!");
            setModalVisible(false);
            setNome("");
            setTelefone("");
            setCpfCnpj("");
            setEndereco("");
            carregarClientes();
        } catch (error) {
            Alert.alert("Erro ao cadastrar", error.message || "Verifique os dados e tente novamente.");
        } finally {
            setSalvando(false);
        }
    };

    const handleExcluirCliente = (id, nomeCliente) => {
        Alert.alert(
            "Excluir Cliente",
            `Deseja realmente excluir "${nomeCliente}"? Isso também removerá os orçamentos vinculados a ele.`,
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Excluir",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await api.delete(`/clientes/${id}/`);
                            carregarClientes();
                        } catch (error) {
                            Alert.alert("Erro", "Não foi possível excluir o cliente: " + error.message);
                        }
                    }
                }
            ]
        );
    };

    const filtrados = clientes.filter((c) => {
        const termo = busca.trim().toLowerCase();
        if (!termo) return true;
        const nomeMatch = (c.nome_cliente || "").toLowerCase().includes(termo);
        const telMatch = (c.telefone || "").toLowerCase().includes(termo);
        return nomeMatch || telMatch;
    });

    return (
        <SafeAreaView style={styles.background}>
            {/* CABEÇALHO */}
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                        <Feather name="arrow-left" size={22} color="#F8FAFC" />
                    </TouchableOpacity>
                    <Text style={styles.title}>Clientes</Text>
                </View>

                <TouchableOpacity style={styles.addBtn} onPress={() => setModalVisible(true)}>
                    <Feather name="plus" size={20} color="#0F172A" />
                </TouchableOpacity>
            </View>

            <SearchInput
                value={busca}
                onChangeText={setBusca}
                placeholder="Buscar cliente ou telefone..."
            />

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
                    {filtrados.map((item) => (
                        <View key={item.id} style={styles.clientCard}>
                            <View style={styles.avatarBox}>
                                <Text style={styles.avatarText}>{getInitials(item.nome_cliente || "CL")}</Text>
                            </View>

                            <View style={styles.infoBox}>
                                <Text style={styles.nomeText}>{item.nome_cliente}</Text>
                                <View style={styles.rowInfo}>
                                    <Feather name="phone" size={12} color="#64748B" />
                                    <Text style={styles.subText}>{item.telefone}</Text>
                                </View>
                                {item.cpf_cnpj ? (
                                    <View style={styles.rowInfo}>
                                        <Feather name="file-text" size={12} color="#64748B" />
                                        <Text style={styles.subText}>{item.cpf_cnpj}</Text>
                                    </View>
                                ) : null}
                                {item.endereco ? (
                                    <View style={styles.rowInfo}>
                                        <Feather name="map-pin" size={12} color="#64748B" />
                                        <Text style={styles.subText} numberOfLines={1}>{item.endereco}</Text>
                                    </View>
                                ) : null}
                            </View>

                            <TouchableOpacity
                                style={styles.deleteBtn}
                                onPress={() => handleExcluirCliente(item.id, item.nome_cliente)}
                            >
                                <Feather name="trash-2" size={16} color="#EA580C" />
                            </TouchableOpacity>
                        </View>
                    ))}

                    {filtrados.length === 0 && !loading && (
                        <View style={styles.emptyContainer}>
                            <Ionicons name="people-outline" size={48} color="#64748B" />
                            <Text style={styles.emptyText}>Nenhum cliente cadastrado ainda.</Text>
                            <TouchableOpacity style={styles.emptyBtn} onPress={() => setModalVisible(true)}>
                                <Text style={styles.emptyBtnText}>+ Cadastrar Primeiro Cliente</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </ScrollView>
            )}

            {/* MODAL DE CADASTRO DE CLIENTE */}
            <Modal
                visible={modalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Novo Cliente</Text>
                            <TouchableOpacity onPress={() => setModalVisible(false)}>
                                <Feather name="x" size={22} color="#94A3B8" />
                            </TouchableOpacity>
                        </View>

                        <ScrollView showsVerticalScrollIndicator={false}>
                            <LabeledInput
                                label="Nome Completo *"
                                placeholder="Ex: João da Silva"
                                value={nome}
                                onChangeText={setNome}
                            />
                            <LabeledInput
                                label="Telefone / WhatsApp *"
                                placeholder="(11) 99999-9999"
                                value={telefone}
                                onChangeText={setTelefone}
                                keyboardType="phone-pad"
                            />
                            <LabeledInput
                                label="CPF ou CNPJ (opcional)"
                                placeholder="000.000.000-00"
                                value={cpfCnpj}
                                onChangeText={setCpfCnpj}
                            />
                            <LabeledInput
                                label="Endereço Completo (opcional)"
                                placeholder="Rua, número, bairro, cidade"
                                value={endereco}
                                onChangeText={setEndereco}
                            />

                            <ButtonPrimary
                                title={salvando ? "Salvando..." : "Salvar Cliente"}
                                onPress={handleSalvarCliente}
                                style={{ marginTop: 12, marginBottom: 12 }}
                            />
                        </ScrollView>
                    </View>
                </View>
            </Modal>
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
    list: {
        marginTop: 16,
    },
    centerContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 40,
    },
    clientCard: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FAF9F6",
        borderRadius: 16,
        padding: 14,
        marginBottom: 12,
    },
    avatarBox: {
        width: 44,
        height: 44,
        borderRadius: 14,
        backgroundColor: "#1E293B",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 12,
    },
    avatarText: {
        color: "#FAF9F6",
        fontSize: 14,
        fontFamily: "PlusJakartaSans_700Bold",
    },
    infoBox: {
        flex: 1,
        gap: 2,
    },
    nomeText: {
        color: "#0F172A",
        fontSize: 15,
        fontFamily: "PlusJakartaSans_700Bold",
        marginBottom: 2,
    },
    rowInfo: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
    },
    subText: {
        color: "#64748B",
        fontSize: 12,
        fontFamily: "PlusJakartaSans_700Bold",
    },
    deleteBtn: {
        width: 36,
        height: 36,
        borderRadius: 10,
        backgroundColor: "#FFEDD5",
        justifyContent: "center",
        alignItems: "center",
        marginLeft: 8,
    },
    emptyContainer: {
        alignItems: "center",
        justifyContent: "center",
        marginTop: 60,
        gap: 12,
    },
    emptyText: {
        color: "#94A3B8",
        fontSize: 14,
        fontFamily: "PlusJakartaSans_700Bold",
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
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.75)",
        justifyContent: "flex-end",
    },
    modalContent: {
        backgroundColor: "#1E293B",
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: 24,
        maxHeight: "85%",
    },
    modalHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 20,
    },
    modalTitle: {
        color: "#F8FAFC",
        fontSize: 18,
        fontFamily: "PlusJakartaSans_700Bold",
    },
});
