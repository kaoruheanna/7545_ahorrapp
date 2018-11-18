import React from 'react';
import {Button, Text, View} from 'react-native';
import {NavigationActions, StackActions} from "react-navigation";

export default class BalanceScreen extends React.Component {

    static navigationOptions = {
        title: 'Balanza',
    };

    render() {
        return (
            <View>
                <Text> Esta es la pantalla de balanza </Text>

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