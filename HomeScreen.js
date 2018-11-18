import React from 'react';
import {StyleSheet, Button, View} from 'react-native';
import HomeButton from './HomeButton.js';
import { StackActions, NavigationActions } from 'react-navigation';


export default class HomeScreen extends React.Component {

    static navigationOptions = {
        title: 'AhorrApp',
    };

    goToScreen = (screenName) => {
        this.props.navigation.dispatch(StackActions.reset({
            index: 0,
            actions: [
                NavigationActions.navigate({ routeName: screenName })
            ],
        }))
    };

    render() {
        // const {navigate} = this.props.navigation;

        return (
            <View style={styles.container}>
                <View style={styles.homeButtonsArea}>
                    <View style={styles.homeButtonsColumn}>
                        <HomeButton title="Fijos" type="income" screen="FixedIncome" onPress={this.goToScreen}/>
                        {/*<HomeButton title="Variables" type="income"/>*/}
                        {/*<HomeButton title="Balanza" type="balance"/>*/}
                    </View>

                    <View style={styles.homeButtonsColumn}>
                        {/*<HomeButton title="Fijos" type="expenditure"/>*/}
                        {/*<HomeButton title="Variables" type="expenditure"/>*/}
                        {/*<HomeButton title="Consejos" type="info"/>*/}
                    </View>
                </View>
                <Button
                    title="Go to asdasd"
                    onPress={() => {
                        this.goToScreen('FixedIncome');
                    }}
                />
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
