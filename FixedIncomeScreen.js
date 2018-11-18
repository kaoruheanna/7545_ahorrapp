import React from 'react';
import {Button, StyleSheet, Text, View} from 'react-native';
import {NavigationActions, StackActions} from "react-navigation";

export default class FixedIncomeScreen extends React.Component {

    static navigationOptions = {
        title: 'Ingreso Fijo',
    };

    render() {
        return (
            <View>
                <Text> Esta es la pantalla de ingresos fijos </Text>

                <Button
                    title="Go to Home"
                    onPress={() => {
                        this.props.navigation.dispatch(StackActions.reset({
                            index: 0,
                            actions: [
                                NavigationActions.navigate({ routeName: 'Home' })
                            ],
                        }))
                    }}
                />
            </View>
        );
    }
}