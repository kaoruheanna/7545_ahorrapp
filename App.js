import React from 'react';
import HomeScreen from './HomeScreen.js';
import { createAppContainer, createStackNavigator } from 'react-navigation';
import FixedIncomeScreen from "./FixedIncomeScreen";

const AppNavigator = createStackNavigator({
    Home: {
        screen: HomeScreen
    },
    FixedIncome: {
        screen: FixedIncomeScreen
    }
}, {
    initialRouteName: 'Home',
});

export default createAppContainer(AppNavigator);