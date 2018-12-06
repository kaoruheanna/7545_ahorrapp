import React from 'react';
import {StyleSheet, View} from 'react-native';
import HomeButton from '../components/HomeButton.js';
import { StackActions, NavigationActions } from 'react-navigation';

export default class HomeScreen extends React.Component {

    static navigationOptions = {
        title: 'AhorrApp',
    };

    goToScreen = (screenName) => {
        this.props.navigation.navigate(screenName);
    };

    render() {

        return (
            <View style={styles.container}>
                <View style={styles.homeButtonsArea}>
                    <View style={styles.homeButtonsColumn}>
                        <HomeButton title="Fijos" type="income" screen="FixedIncome" onPress={this.goToScreen}/>
                        <HomeButton title="Variables" type="income" screen="VariableIncome" onPress={this.goToScreen}/>
                        <HomeButton title="Balanza" type="balance" screen="History" onPress={this.goToScreen}/>
                    </View>

                    <View style={styles.homeButtonsColumn}>
                        <HomeButton title="Fijos" type="expenditure" screen="FixedExpenditure" onPress={this.goToScreen}/>
                        <HomeButton title="Variables" type="expenditure" screen="VariableExpenditure" onPress={this.goToScreen}/>
                        <HomeButton title="Consejos" type="info" screen="Advices" onPress={this.goToScreen}/>
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
        alignItems: 'center'
    },
});
