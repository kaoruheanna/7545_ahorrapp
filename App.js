import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import HomeButton from './HomeButton.js';

export default class App extends React.Component {
    render() {
        return (
            <View style={styles.container}>
                <Text>Hola!</Text>
                <View style={styles.homeButtonsArea}>
                    <View style={styles.homeButtonsColumn}>
                        <HomeButton title="Fijos" type="income"/>
                        <HomeButton title="Variables" type="income"/>
                        <HomeButton title="Balanza" type="balance"/>
                    </View>

                    <View style={styles.homeButtonsColumn}>
                        <HomeButton title="Fijos" type="expenditure"/>
                        <HomeButton title="Variables" type="expenditure"/>
                        <HomeButton title="Consejos" type="info"/>
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
