import React from 'react';
import {Button, Text, View} from 'react-native';
import {NavigationActions, StackActions} from "react-navigation";
import { StorageService } from "../StorageService";
import cloneDeep from "lodash/cloneDeep";

export default class BalanceScreen extends React.Component {

    componentDidMount() {
        this._isMounted = true
    }
    componentWillUnmount() {
      this._isMounted = false
    }

  static navigationOptions = {
        title: 'Balanza',
    };

    constructor(props) {
        super(props);
        this.state = {
            totalIncomes: 0,
            totalExpenditures: 0
        };
        this._isMounted = false;
    }

    getIncomes = async () => {
        const incomes = await StorageService.getIncomes();
        if (this._isMounted) {
          const totalIncomes = incomes.reduce((carry, income) => {
            return carry + income.money;
          }, 0);
          this.setState({totalIncomes});
        }
    };

    getExpenditures = async () => {
        const expenditures = await StorageService.getExpenditures();
        if (this._isMounted) {
          const totalExpenditures = expenditures.reduce((carry, income) => {
            return carry + income.money;
          }, 0);
          this.setState({totalExpenditures});
        }
    };

    render() {
        this.getIncomes();
        this.getExpenditures();

        return (
            <View>
                <Text> Esta es la pantalla de balanza </Text>

                <Text>Total Incomes: {this.state.totalIncomes}</Text>
                <Text>Total Expenditures: {this.state.totalExpenditures}</Text>

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