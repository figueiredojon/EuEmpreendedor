import React, { useState, useEffect } from "react";
import {
    StyleSheet,
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Modal,
    ActivityIndicator,
    Alert
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Feather from "@expo/vector-icons/Feather";

import LabeledInput from "../../components/labeledInput";
import SectionHeader from "../../components/sectionHeader";
import ItemCard from "../../components/itemCard";
import AddItemButton from "../../components/addItemButton";
import ButtonPrimary from "../../components/buttons/buttonPrimary";
import api from "../../services/api";

const parseValor = (texto) => {
    if (!texto) return 0;
    const limpo = String(texto).replace(/\./g, "").replace(",", ".");
    const numero = parseFloat(limpo);
    return isNaN(numero) ? 0 : numero;
};

const formatMoeda = (numero) =>
    "R$ " + numero.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export default function NovoOrcamento({ navigation }) {
    const [clientes, setClientes] = useState([]);
    const [clienteSelecionado, setClienteSelecionado] = useState(null);
    const [modalClientesVisible, setModalClientesVisible] = useState(false);

    // Campos de novo cliente rápido
    const [modoNovoCliente, setModoNovoCliente] = useState(false);
    const [novoNome, setNovoNome] = useState("");
    const [novoTelefone, setNovoTelefone] = useState("");

    // Itens
    const [itens, setItens] = useState([
        { id: "1", descricao: "Instalação / Reparo elétrico", valor: "150,00" },
    ]);

    const [salvando, setSalvando] = useState(false);
    const [loadingClientes, setLoadingClientes] = useState(false);

    useEffect(() => {
        carregarClientes();
    }, []);

    const carregarClientes = async () => {
        try {
            setLoadingClientes(true);
            const data = await api.get("/clientes/");
            const lista = Array.isArray(data) ? data : (data.results || []);
            setClientes(lista);
            if (lista.length > 0) {
                setClienteSelecionado(lista[0]);
                setModoNovoCliente(false);
            } else {
                setModoNovoCliente(true);
            }
        } catch (error) {
            console.log("Erro ao buscar clientes:", error.message);
            setModoNovoCliente(true);
        } finally {
            setLoadingClientes(false);
        }
    };

    const total = itens.reduce((soma, item) => soma + parseValor(item.valor), 0);

    const addItem = () => {
        setItens([...itens, { id: String(Date.now()), descricao: "", valor: "" }]);
    };

    const updateItem = (id, campo, valor) => {
        setItens(itens.map((item) => (item.id === id ? { ...item, [campo]: valor } : item)));
    };

    const removeItem = (id) => {
        if (itens.length === 1) {
            Alert.alert("Atenção", "O orçamento precisa de pelo menos 1 item.");
            return;
        }
        setItens(itens.filter((item) => item.id !== id));
    };

    const handleSalvarOrcamento = async () => {
        // Validação de Itens
        const itensValidos = itens.filter((i) => i.descricao.trim() && parseValor(i.valor) > 0);
        if (itensValidos.length === 0) {
            Alert.alert("Atenção", "Adicione ao menos um item de serviço com descrição e valor maior que zero.");
            return;
        }

        setSalvando(true);
        try {
            let clienteId = null;

            // Se estiver em modo de criar cliente rápido
            if (modoNovoCliente) {
                if (!novoNome.trim() || !novoTelefone.trim()) {
                    Alert.alert("Atenção", "Preencha o Nome e o Telefone do cliente.");
                    setSalvando(false);
                    return;
                }

                const novoCliente = await api.post("/clientes/", {
                    nome_cliente: novoNome.trim(),
                    telefone: novoTelefone.trim(),
                });
                clienteId = novoCliente.id;
            } else {
                if (!clienteSelecionado) {
                    Alert.alert("Atenção", "Selecione um cliente para o orçamento.");
                    setSalvando(false);
                    return;
                }
                clienteId = clienteSelecionado.id;
            }

            // Gera número automático baseado no minuto/dia para ficar único e legível
            const numeroGerado = Math.floor(1000 + Math.random() * 9000);

            // Monta o payload no padrão do Writable Nested Serializer do Django
            const payload = {
                cliente: clienteId,
                numero: numeroGerado,
                status: "PENDENTE",
                itens: itensValidos.map((i) => ({
                    descricao: i.descricao.trim(),
                    valor: parseValor(i.valor).toFixed(2),
                })),
            };

            await api.post("/orcamentos/", payload);

            Alert.alert(
                `Orçamento #${numeroGerado} salvo com sucesso no banco de dados.`,
                [
                    {
                        text: "Ver Orçamentos",
                        onPress: () => navigation.navigate("Orcamentos"),
                    },
                ]
            );
        } catch (error) {
            Alert.alert("Erro ao salvar orçamento", error.message || "Tente novamente.");
        } finally {
            setSalvando(false);
        }
    };

    return (
        <SafeAreaView style={styles.background}>
            <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
                {/* CABEÇALHO */}
                <View style={styles.header}>
                    <View style={styles.headerLeft}>
                        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                            <Feather name="arrow-left" size={22} color="#F8FAFC" />
                        </TouchableOpacity>
                        <Text style={styles.title}>Novo orçamento</Text>
                    </View>
                    <View style={styles.badge}>
                        <Text style={styles.badgeText}>Pendente</Text>
                    </View>
                </View>

                {/* SEÇÃO DO CLIENTE */}
                <View style={styles.clienteSectionHeader}>
                    <SectionHeader title="CLIENTE" />
                    {clientes.length > 0 && (
                        <TouchableOpacity
                            onPress={() => setModoNovoCliente(!modoNovoCliente)}
                            style={styles.toggleModoBtn}
                        >
                            <Text style={styles.toggleModoText}>
                                {modoNovoCliente ? "Selecionar existente" : "+ Novo cliente"}
                            </Text>
                        </TouchableOpacity>
                    )}
                </View>

                {!modoNovoCliente && clienteSelecionado ? (
                    <TouchableOpacity
                        style={styles.clienteCardSelector}
                        onPress={() => setModalClientesVisible(true)}
                    >
                        <View style={styles.clienteCardInfo}>
                            <Text style={styles.clienteCardNome}>{clienteSelecionado.nome_cliente}</Text>
                            <Text style={styles.clienteCardTel}>{clienteSelecionado.telefone}</Text>
                        </View>
                        <View style={styles.trocarBtnBox}>
                            <Text style={styles.trocarBtnText}>Trocar</Text>
                            <Feather name="chevron-down" size={16} color="#94A3B8" />
                        </View>
                    </TouchableOpacity>
                ) : (
                    <View style={styles.novoClienteBox}>
                        <LabeledInput
                            label="Nome completo do cliente *"
                            value={novoNome}
                            onChangeText={setNovoNome}
                            placeholder="Ex: Carlos Eduardo"
                        />
                        <LabeledInput
                            label="Telefone / WhatsApp *"
                            value={novoTelefone}
                            onChangeText={setNovoTelefone}
                            placeholder="(00) 00000-0000"
                            keyboardType="phone-pad"
                        />
                    </View>
                )}

                <View style={styles.divider} />

                {/* ITENS DO SERVIÇO */}
                <SectionHeader title="ITENS DO SERVIÇO" actionLabel="Adicionar" onActionPress={addItem} />
                {itens.map((item) => (
                    <ItemCard
                        key={item.id}
                        descricao={item.descricao}
                        valor={item.valor}
                        onChangeDescricao={(texto) => updateItem(item.id, "descricao", texto)}
                        onChangeValor={(texto) => updateItem(item.id, "valor", texto)}
                        onRemove={() => removeItem(item.id)}
                    />
                ))}
                <AddItemButton title="Adicionar outro item" onPress={addItem} />

                <View style={styles.divider} />

                {/* TOTAL */}
                <View style={styles.totalRow}>
                    <Text style={styles.totalLabel}>Total estimado</Text>
                    <Text style={styles.totalValue}>{formatMoeda(total)}</Text>
                </View>

                <ButtonPrimary
                    title={salvando ? "Salvando orçamento..." : "Salvar Orçamento na API"}
                    onPress={handleSalvarOrcamento}
                    style={salvando && { opacity: 0.7 }}
                />
            </ScrollView>

            {/* MODAL DE SELEÇÃO DE CLIENTE */}
            <Modal
                visible={modalClientesVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setModalClientesVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Selecione o Cliente</Text>
                            <TouchableOpacity onPress={() => setModalClientesVisible(false)}>
                                <Feather name="x" size={22} color="#94A3B8" />
                            </TouchableOpacity>
                        </View>

                        <ScrollView style={{ maxHeight: 350 }}>
                            {clientes.map((c) => (
                                <TouchableOpacity
                                    key={c.id}
                                    style={[
                                        styles.itemClienteModal,
                                        clienteSelecionado?.id === c.id && styles.itemClienteModalActive,
                                    ]}
                                    onPress={() => {
                                        setClienteSelecionado(c);
                                        setModalClientesVisible(false);
                                    }}
                                >
                                    <View>
                                        <Text style={styles.itemClienteNome}>{c.nome_cliente}</Text>
                                        <Text style={styles.itemClienteTel}>{c.telefone}</Text>
                                    </View>
                                    {clienteSelecionado?.id === c.id && (
                                        <Feather name="check" size={18} color="#0F172A" />
                                    )}
                                </TouchableOpacity>
                            ))}
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
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 32,
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
    badge: {
        backgroundColor: "#FFEDD5",
        borderRadius: 12,
        paddingHorizontal: 12,
        paddingVertical: 4,
    },
    badgeText: {
        color: "#C2410C",
        fontSize: 12,
        fontFamily: "PlusJakartaSans_700Bold",
    },
    clienteSectionHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 8,
    },
    toggleModoBtn: {
        paddingVertical: 4,
        paddingHorizontal: 8,
    },
    toggleModoText: {
        color: "#94A3B8",
        fontSize: 12,
        fontFamily: "PlusJakartaSans_700Bold",
    },
    clienteCardSelector: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#1E293B",
        borderWidth: 1,
        borderColor: "#334155",
        borderRadius: 16,
        padding: 16,
        marginBottom: 14,
    },
    clienteCardNome: {
        color: "#F8FAFC",
        fontSize: 16,
        fontFamily: "PlusJakartaSans_700Bold",
    },
    clienteCardTel: {
        color: "#94A3B8",
        fontSize: 13,
        fontFamily: "PlusJakartaSans_700Bold",
        marginTop: 4,
    },
    trocarBtnBox: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
        backgroundColor: "#0F172A",
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 10,
    },
    trocarBtnText: {
        color: "#94A3B8",
        fontSize: 12,
        fontFamily: "PlusJakartaSans_700Bold",
    },
    novoClienteBox: {
        marginTop: 4,
    },
    divider: {
        height: 1,
        backgroundColor: "#1E293B",
        marginVertical: 20,
    },
    totalRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 20,
    },
    totalLabel: {
        color: "#94A3B8",
        fontSize: 14,
        fontFamily: "PlusJakartaSans_700Bold",
    },
    totalValue: {
        color: "#F8FAFC",
        fontSize: 24,
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
    },
    modalHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 16,
    },
    modalTitle: {
        color: "#F8FAFC",
        fontSize: 18,
        fontFamily: "PlusJakartaSans_700Bold",
    },
    itemClienteModal: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 14,
        borderRadius: 12,
        backgroundColor: "#0F172A",
        marginBottom: 8,
    },
    itemClienteModalActive: {
        backgroundColor: "#FAF9F6",
    },
    itemClienteNome: {
        color: "#F8FAFC",
        fontSize: 15,
        fontFamily: "PlusJakartaSans_700Bold",
    },
    itemClienteTel: {
        color: "#94A3B8",
        fontSize: 12,
        fontFamily: "PlusJakartaSans_700Bold",
        marginTop: 2,
    },
});
