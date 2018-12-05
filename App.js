import React from 'react';
import {Easing, Animated} from 'react-native';
import HomeScreen from './screens/HomeScreen.js';
import { createAppContainer, createStackNavigator } from 'react-navigation';
import FixedIncomeScreen from "./screens/FixedIncomeScreen";
import AdvicesScreen from "./screens/AdvicesScreen";
import FixedExpenditureScreen from "./screens/FixedExpenditureScreen";
import VariableExpenditureScreen from "./screens/VariableExpenditureScreen";
import VariableIncomeScreen from "./screens/VariableIncomeScreen";
import BalanceScreen from "./screens/BalanceScreen";
import HistoryScreen from "./screens/HistoryScreen";

const transitionConfig = () => {
    return {
        transitionSpec: {
            duration: 750,
            easing: Easing.out(Easing.poly(4)),
            timing: Animated.timing,
            useNativeDriver: true,
        },
        screenInterpolator: sceneProps => {      
            const { layout, position, scene } = sceneProps

            const thisSceneIndex = scene.index
            const width = layout.initWidth

            const translateX = position.interpolate({
                inputRange: [thisSceneIndex - 1, thisSceneIndex],
                outputRange: [width, 0],
        })

        return { transform: [ { translateX } ] }
        },
    }
}

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
    transitionConfig,
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