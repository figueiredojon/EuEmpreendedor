import React, { useState } from "react";
import { StyleSheet, View, Image, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import api from "../../services/api";
import authStorage from "../../services/auth";

export default function Login({ navigation }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        if (!username.trim() || !password.trim()) {
            Alert.alert("Atenção", "Por favor, preencha o usuário e a senha.");
            return;
        }

        setLoading(true);
        try {
            const data = await api.post("/login/", {
                username: username.trim(),
                password: password.trim(),
            });

            authStorage.setSession(data.token, {
                id: data.user_id,
                username: data.username,
                nome: data.nome,
                email: data.email,
            });

            navigation.replace("Dashboard");
        } catch (error) {
            Alert.alert("Erro ao entrar", error.message || "Usuário ou senha incorretos.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
            <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
                <View style={styles.card}>
                    <View style={styles.logoCtn}>
                        <Image
                            source={require("../../assets/logo_euempreendedor_azul.png")}
                            style={styles.logo}
                        />
                        <Text style={styles.titleStyle}>EuEmpreendedor</Text>
                        <Text style={styles.subtitleStyle}>Gestão prática para autônomos</Text>
                    </View>

                    <View style={styles.formContainer}>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Usuário</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Digite seu usuário"
                                placeholderTextColor="#64748B"
                                value={username}
                                onChangeText={setUsername}
                                autoCapitalize="none"
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Senha</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Digite sua senha"
                                placeholderTextColor="#64748B"
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry
                            />
                        </View>

                        <TouchableOpacity
                            style={[styles.btnLogin, loading && styles.btnDisabled]}
                            onPress={handleLogin}
                            disabled={loading}
                        >
                            {loading ? (
                                <ActivityIndicator color="#0F172A" />
                            ) : (
                                <Text style={styles.btnLoginText}>Entrar</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#0F172A",
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 16,
    },
    card: {
        width: "100%",
        maxWidth: 420,
        backgroundColor: "#192134",
        borderColor: "rgba(255,255,255,0.08)",
        borderWidth: 1,
        borderRadius: 28,
        padding: 24,
        alignItems: "center",
    },
    logoCtn: {
        alignItems: "center",
        marginBottom: 28,
    },
    logo: {
        width: 110,
        height: 110,
        resizeMode: "contain",
        marginBottom: 10,
    },
    titleStyle: {
        color: "#FFFFFF",
        fontSize: 24,
        fontFamily: "PlusJakartaSans_700Bold",
    },
    subtitleStyle: {
        color: "#94A3B8",
        fontSize: 13,
        fontFamily: "PlusJakartaSans_700Bold",
        marginTop: 4,
    },
    formContainer: {
        width: "100%",
    },
    inputGroup: {
        marginBottom: 16,
    },
    label: {
        color: "#F8FAFC",
        fontSize: 13,
        fontFamily: "PlusJakartaSans_700Bold",
        marginBottom: 6,
    },
    input: {
        backgroundColor: "#0F172A",
        borderWidth: 1,
        borderColor: "#334155",
        borderRadius: 14,
        paddingHorizontal: 16,
        paddingVertical: 14,
        color: "#F8FAFC",
        fontSize: 15,
        fontFamily: "PlusJakartaSans_700Bold",
    },
    btnLogin: {
        width: "100%",
        backgroundColor: "#FAF9F6",
        borderRadius: 16,
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 16,
        marginTop: 12,
    },
    btnDisabled: {
        opacity: 0.7,
    },
    btnLoginText: {
        color: "#0F172A",
        fontSize: 16,
        fontFamily: "PlusJakartaSans_700Bold",
    },
});
