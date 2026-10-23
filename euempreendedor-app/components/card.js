import React from "react";
import {StyleSheet, View} from "react-native";


export default function Card({children}){
    return (
        <View style={CardStyle.surfaceContainer}>
            <View style={CardStyle.Card}>
                {children}
            </View>
        </View>
    );
}


const CardStyle = StyleSheet.create({
        surfaceContainer: {
        flex:1,
        height: '100%',
        backgroundColor: '#0F172A',
        alignItems: 'center',
        justifyContent: 'center',
    },
    
    Card:{
        height:'98.5%',
        width:'96%',
        backgroundColor: '#192134',
        borderColor: 'rgba(255,255,255,0.08)',
        borderWidth: 1,
        borderRadius: 32.5,
        alignItems: 'center',
        justifyContent: 'center',
    },
})