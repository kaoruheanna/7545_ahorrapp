import React from 'react';
import {StyleSheet, Text, View, Alert} from 'react-native';
import { Button } from 'react-native-elements';

export default class App extends React.Component {
    render() {
        return (
            <View style={styles.container}>
                <Text>Hola!</Text>
                <View style={styles.homeButtonsArea}>
                    <View style={styles.homeButtonsColumn}>
                        <Button buttonStyle={{
                            backgroundColor: "rgba(92, 99,216, 1)",
                            width: 120,
                            height: 45,
                            borderColor: "transparent",
                            borderWidth: 0,
                            borderRadius: 5
                        }} containerStyle={{ marginTop: 20 }} title="Ingresos Fijos" onPress={() => {
                            Alert.alert('Le diste a ingresos fijos');
                        }}/>
                        <Button buttonStyle={{
                            backgroundColor: "rgba(92, 99,216, 1)",
                            width: 120,
                            height: 70,
                            borderColor: "transparent",
                            borderWidth: 0,
                            borderRadius: 5
                        }} containerStyle={{ marginTop: 20 }} title="Ingresos Variables" onPress={() => {
                            Alert.alert('Le diste a ingresos variables');
                        }}/>
                        <Button buttonStyle={{
                            backgroundColor: "rgba(92, 99,216, 1)",
                            width: 120,
                            height: 70,
                            borderColor: "transparent",
                            borderWidth: 0,
                            borderRadius: 5
                        }} containerStyle={{ marginTop: 20 }} title="Balanza" onPress={() => {
                            Alert.alert('Le diste a balanza');
                        }}/>
                    </View>

                    <View style={styles.homeButtonsColumn}>
                        <Button buttonStyle={{
                            backgroundColor: "rgba(92, 99,216, 1)",
                            width: 120,
                            height: 70,
                            borderColor: "transparent",
                            borderWidth: 0,
                            borderRadius: 5
                        }} containerStyle={{ marginTop: 20 }} title="Gastos Fijos" onPress={() => {
                            Alert.alert('Le diste a gastos fijos');
                        }}/>
                        <Button buttonStyle={{
                            backgroundColor: "rgba(92, 99,216, 1)",
                            width: 120,
                            height: 70,
                            borderColor: "transparent",
                            borderWidth: 0,
                            borderRadius: 5
                        }} containerStyle={{ marginTop: 20 }} title="Gastos Variables" onPress={() => {
                            Alert.alert('Le diste a gastos variables');
                        }}/>
                        <Button buttonStyle={{
                            backgroundColor: "rgba(92, 99,216, 1)",
                            width: 120,
                            height: 70,
                            borderColor: "transparent",
                            borderWidth: 0,
                            borderRadius: 5
                        }} containerStyle={{ marginTop: 20 }} title="Consejos" onPress={() => {
                            Alert.alert('Le diste a consejos');
                        }}/>
                    </View>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    homeButtonsArea: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
    },
    homeButtonsColumn: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-evenly',
    },
});
