import React from 'react';
import {Button, Text, View} from 'react-native';
import {NavigationActions, StackActions} from "react-navigation";
import { StorageService } from "../StorageService";

export default class BalanceScreen extends React.Component {

    static navigationOptions = {
        title: 'Balanza',
    };

    getIncomes = async () => {
        console.log("tratando de obtener los incomes");
        const incomes = await StorageService.getIncomes();
        console.log("incomes guardados: ", incomes);
        return incomes;
    };

    render() {
        this.getIncomes();

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