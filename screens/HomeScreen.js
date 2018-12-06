import React from 'react';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import { Icon } from 'react-native-elements'
import Modal from "react-native-modal";
import HomeButton from '../components/HomeButton.js';
import { StackActions, NavigationActions } from 'react-navigation';
import {StorageService} from "../StorageService";
import Button from 'react-native-really-awesome-button/src/themes/rick';

export default class HomeScreen extends React.Component {

    static navigationOptions = ({navigation}) => {
        return {
            title: 'AhorrApp',
            headerRight: (
                <TouchableOpacity onPress={navigation.getParam('showOptions')}>
                    <View style={{ flex: 1, padding: 10, backgroundColor: "#E5DED3", alignItems: "center", justifyContent: "center"}}>
                        <Icon name='ellipsis-v' type='font-awesome' color="black" />
                    </View>
                </TouchableOpacity>
            ),            
        };
    };

    constructor(props) {
        super(props);
        this.state = {
            optionsVisible: false,
        };
    }

    async componentDidMount() {
        this.props.navigation.setParams({ showOptions: this.showOptions });
    }

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
                                Clear Storage
                            </Text>
                        </Button>
                    </View>
                </Modal>            
                <View style={styles.homeButtonsArea}>
                    <View style={styles.homeButtonsColumn}>
                        <HomeButton title="Fijos" type="income" screen="FixedIncome" onPress={this.goToScreen}/>
                        <HomeButton title="Variables" type="income" screen="VariableIncome" onPress={this.goToScreen}/>
                        <HomeButton title="Balanza" type="balance" screen="History" onPress={this.goToScreen}/>
                    </View>

                    <View style={styles.homeButtonsColumn}>
                        <HomeButton title="Fijos" type="expenditure" screen="FixedExpenditure" onPress={this.goToScreen}/>
                        <HomeButton title="Variables" type="expenditure" screen="VariableExpenditure" onPress={this.goToScreen}/>
                        <HomeButton title="Consejos" type="info" screen="Advices" onPress={this.goToScreen}/>
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
