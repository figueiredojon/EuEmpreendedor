import React from "react";
import {StyleSheet, View, Text, Alert, TouchableOpacity} from "react-native";



export default function ButtonPattern({children, style, onPress}){
    return (
        <View style={style}>
            <TouchableOpacity 
                style={buttonStyle.btnLogin}
                onPress={onPress}
            >
                <Text style={buttonStyle.title}>Login com Senha</Text>
            {children}
            </TouchableOpacity>
        </View>
    );
}


const buttonStyle = StyleSheet.create({
    title:{
        color: '#0F172A',
        fontSize: 20,
        fontFamily: 'PlusJakartaSans_700Bold',
    },
    
    btnLogin:{
        width:'100%',
        backgroundColor: '#F5F5F5',
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom:40,
        padding:20,
        paddingHorizontal: 40,
    }
})