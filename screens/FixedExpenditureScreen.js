import React from 'react';
import {Button, Text, View} from 'react-native';
import {NavigationActions, StackActions} from "react-navigation";

export default class FixedExpenditureScreen extends React.Component {

    static navigationOptions = {
        title: 'Gastos fijos',
    };

    render() {
        return (
            <View>
                <Text> Esta es la pantalla de gastos fijos </Text>

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