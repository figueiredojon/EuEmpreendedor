import React from "react";
import {StyleSheet, View, Text} from "react-native";
import Card from "../../components/card";


export default function Login(){
    return (
        <Card>
            <Text style={LoginStyle.titleStyle}>EuEmpreendedor</Text>
        </Card>
    );
}


const LoginStyle = StyleSheet.create({
    titleStyle:{
        color: '#FFFFFF',
        fontSize: 22,
        fontFamily: 'PlusJakartaSans_700Bold',
    },
})