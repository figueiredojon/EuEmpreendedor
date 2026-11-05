import React from "react";
import { StyleSheet,Text,View, TouchableOpacity, ScrollView } from "react-native";
import { Feather } from "@expo/vector-icons";
import getInitials from "../../utils/getInitials";
import {SafeAreaView} from "react-native-safe-area-context";
import StatusBadge from "../../components/statusBadge";


export default function ResumoOrcamento({route,navigation}){
    const {orcamento} = route.params || {};
    
    return (
        //CABEÇALHO
        
        //BOTÃO VOLTAR
        <SafeAreaView>
            <View>
                <View>
                    <TouchableOpacity
                        onPress={() => navigation.navigate("Orcamentos")}
                    >
                    <Feather name="arrow-left" size={22} color={"#F8FAFC"}/>
                    </TouchableOpacity>
                </View>
           

                <Text>Resumo do orçamento</Text>
            </View>

            <ScrollView>
                <View>
                    {/*Iniciais*/}
                    <View>
                        <Text>{getInitials(orcamento?.nome_cliente || "CL")}</Text>
                    </View>
                    <View>
                        <Text>{orcamento?.nome_cliente || "Cliente"}</Text>
                        <Text>{orcamento?.telefone} * {orcamento?.data_emissao}</Text>
                    </View>

                    <StatusBadge status={orcamento?.status}/>
                </View>
            </ScrollView>
        </SafeAreaView>

        
        
    );
}


const stylesResumo = StyleSheet.create({

});