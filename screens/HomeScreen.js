import React from 'react';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import { Icon } from 'react-native-elements'
import Modal from "react-native-modal";
import HomeButton from '../components/HomeButton.js';
import DrawerComponent from '../components/DrawerComponent.js';
import { StackActions, NavigationActions } from 'react-navigation';
import {StorageService} from "../StorageService";
import Button from 'react-native-really-awesome-button/src/themes/rick';

export default class HomeScreen extends React.Component {

    static navigationOptions = {
        drawerLabel: (params) => {
            return (<DrawerComponent title="Home" type="home" focused={params.focused}/>)
        }
    };

    constructor(props) {
        super(props);
        this.state = {
            optionsVisible: false,
        };
        this.props.navigation.setParams({ navigationOptions: this.navigationOptions });
    }

    navigationOptions = ({navigation}) => {
        return {
            headerRight: (
                <TouchableOpacity onPress={this.showOptions}>
                    <View style={{ flex: 1, padding: 10, backgroundColor: "#B7ABA5", alignItems: "center", justifyContent: "center"}}>
                        <Icon name='ellipsis-v' type='font-awesome' color="black" />
                    </View>
                </TouchableOpacity>
            ),
        };
    };

    showOptions = () => {
        this.setState({optionsVisible: true});
    }

    hideOptions() {
        this.setState({optionsVisible: false});
    }    

    goToScreen = (screenName) => {
        this.props.navigation.navigate(screenName);
    };

    render() {

        return (
            <View style={styles.container}>
                <Modal isVisible={this.state.optionsVisible} onBackdropPress={() => this.hideOptions()}>
                    <View style={{ flex: 0.3, borderRadius: 10, flexDirection: 'column', alignItems: 'center', padding: 32, backgroundColor: '#fff' }}>
                        <Button onPress={StorageService.clearStorage} backgroundColor="#B7ABA5" backgroundDarker="#E5DED3">
                            <Text style={{fontWeight: 'bold', fontSize: 20}}>
                                Limpiar Datos
                            </Text>
                        </Button>
                    </View>
                </Modal>            
                <View style={styles.homeButtonsArea}>
                    <View style={styles.homeButtonsColumn}>
                        <HomeButton title="Balanza" type="balance" screen="Balance" onPress={this.goToScreen}/>
                        <HomeButton title="Consejos" type="info" screen="Advices" onPress={this.goToScreen}/>
                        <HomeButton title="Nuevo Gasto Fijo" type="expenditure" screen="FixedExpenditure" onPress={this.goToScreen}/>
                        <HomeButton title="Nuevo Gasto Variable" type="expenditure" screen="VariableExpenditure" onPress={this.goToScreen}/>                        
                        <HomeButton title="Nuevo Ingreso Fijo" type="income" screen="FixedIncome" onPress={this.goToScreen}/>
                        <HomeButton title="Nuevo Ingreso Variable" type="income" screen="VariableIncome" onPress={this.goToScreen}/>
                    </View>
                </View>
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
        alignItems: 'center'
    },
});
