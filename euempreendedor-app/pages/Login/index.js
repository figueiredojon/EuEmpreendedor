import React from "react";
import {StyleSheet, View, Image, Text} from "react-native";
import Card from "../../components/card";
import ButtonLogin from "../../components/buttons/buttonLogin";

export default function Login({navigation}){
    return (
        <Card>
            <View style={LoginStyle.logoCtn}>
                <Image
                    source={require('../../assets/logo_euempreendedor_azul.png')}
                    style={LoginStyle.logo}
                />
            <Text style={LoginStyle.titleStyle}>EuEmpreendedor</Text>
            </View>

            <View>
                <ButtonLogin onPress={() => navigation.navigate('Dashboard')}/>
            </View>
        </Card>
    );
}


const LoginStyle = StyleSheet.create({
    titleStyle:{
        color: '#FFFFFF',
        fontSize: 22,
        fontFamily: 'PlusJakartaSans_700Bold',
    },

    logoCtn:{
        flex:1,
        alignItems: 'center',
        justifyContent: 'center',
    },

    logo:{
        width:150,
        height:150,
        resizeMode: 'contain',
    },

})