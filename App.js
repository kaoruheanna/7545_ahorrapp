import React from 'react';
import { View, Image, StatusBar, TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-elements'
import { createAppContainer, createDrawerNavigator, createStackNavigator} from 'react-navigation';
import HomeScreen from "./screens/HomeScreen";
import FixedIncomeScreen from "./screens/FixedIncomeScreen";
import AdvicesScreen from "./screens/AdvicesScreen";
import FixedExpenditureScreen from "./screens/FixedExpenditureScreen";
import VariableExpenditureScreen from "./screens/VariableExpenditureScreen";
import VariableIncomeScreen from "./screens/VariableIncomeScreen";
import BalanceScreen from "./screens/BalanceScreen";

const DrawerNavigator = createDrawerNavigator({
    HomeScreen: { screen: HomeScreen },
    Balance: { screen: BalanceScreen },
    Advices: { screen: AdvicesScreen },
    FixedExpenditure: { screen: FixedExpenditureScreen },
    VariableExpenditure: { screen: VariableExpenditureScreen },
    FixedIncome: { screen: FixedIncomeScreen },
    VariableIncome: { screen: VariableIncomeScreen },
}, {
    drawerWidth: 220,
    drawerBackgroundColor: '#E5DED3',
    drawerType: 'front'
});

DrawerNavigator.navigationOptions = ({ navigation }) => {
    const routeNavigation = navigation.state.routes[navigation.state.index];
    if (routeNavigation.params && routeNavigation.params.navigationOptions) {
        return routeNavigation.params.navigationOptions(navigation);    
    }
    return {};
};

const SharedHeader = createStackNavigator({
    Drawer: { screen: DrawerNavigator},
}, {
    headerMode: 'float',
    defaultNavigationOptions: ({navigation}) => ({
        headerStyle: {backgroundColor: '#B7ABA5'},
        headerLeft: <TouchableOpacity onPress={() => navigation.toggleDrawer()}>
                        <View style={{padding: 10, backgroundColor: "#B7ABA5", flex: 1, alignItems: "center", justifyContent: "center"}}>
                            <Icon name='bars' type='font-awesome' color="black" />
                        </View>
                        
                    </TouchableOpacity>,
        headerBackground:   <View style={{ paddingTop: StatusBar.currentHeight + 5, alignItems: 'center'}}> 
                                <Image style={{width: 45, height: 45}} source={require('./assets/icon.png')}/>
                            </View>,
    }),
});

export default createAppContainer(SharedHeader);