import React from 'react';
import HomeScreen from './screens/HomeScreen.js';
import { createAppContainer, createStackNavigator } from 'react-navigation';
import FixedIncomeScreen from "./screens/FixedIncomeScreen";
import AdvicesScreen from "./screens/AdvicesScreen";
import FixedExpenditureScreen from "./screens/FixedExpenditureScreen";
import VariableExpenditureScreen from "./screens/VariableExpenditureScreen";
import VariableIncomeScreen from "./screens/VariableIncomeScreen";
import BalanceScreen from "./screens/BalanceScreen";
import HistoryScreen from "./screens/HistoryScreen";

const AppNavigator = createStackNavigator({
    Home: { screen: HomeScreen },
    Advices: { screen: AdvicesScreen },
    Balance: { screen: BalanceScreen },
    FixedExpenditure: { screen: FixedExpenditureScreen },
    FixedIncome: { screen: FixedIncomeScreen },
    VariableExpenditure: { screen: VariableExpenditureScreen },
    VariableIncome: { screen: VariableIncomeScreen },
    History: { screen: HistoryScreen },

}, {
    initialRouteName: 'Home',
    defaultNavigationOptions: {
        headerStyle: {
            backgroundColor: '#f1f8ff',
        },
        headerTintColor: '#000',
        headerTitleStyle: {
            fontWeight: 'bold',
        },
    },
});

export default createAppContainer(AppNavigator);