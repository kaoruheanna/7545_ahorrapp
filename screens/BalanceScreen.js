import React from 'react';
import {Button, Text, View, StyleSheet} from 'react-native';
import {NavigationActions, StackActions} from "react-navigation";
import {StorageService} from "../StorageService";
import cloneDeep from "lodash/cloneDeep";

const styles = StyleSheet.create({
    mainView: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor:"yellow",
        alignItems: 'center',
    },
    barContainer: {
        flex: 0.8,
        flexDirection: 'row',
        justifyContent:'center',
        height: 100,
        backgroundColor:"powderblue",
        marginLeft: 10,
        marginRight: 10,
    },
    incomeBar: {
        height: 100,
        backgroundColor: '#a4c639',
        justifyContent: 'center',
        alignItems: 'center'
    },
    expenditureBar: {
        height: 100,
        backgroundColor: '#cc0000',
        justifyContent: 'center',
        alignItems: 'center'
    },
    barLabel: {
        flex: 1,
        fontSize: 20,
        fontWeight: 'bold',
        color: "white",
        justifyContent:'center',
        alignItems: 'center',
    }
});

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
            totalExpenditures: 0,
            flexIncomeBar: 0.5,
            flexExpenditureBar: 0.5,
        };

        // this.styles = StyleSheet.create({
        //     mainView: {
        //         flex: 1,
        //         flexDirection: 'column',
        //         backgroundColor:"yellow",
        //         alignItems: 'center',
        //     },
        //     barContainer: {
        //         flex: 0.8,
        //         flexDirection: 'row',
        //         justifyContent:'center',
        //         height: 100,
        //         backgroundColor:"powderblue",
        //         marginLeft: 10,
        //         marginRight: 10,
        //     },
        //     incomeBar: {
        //         height: 100,
        //         backgroundColor: '#a4c639'
        //     },
        //     expenditureBar: {
        //         height: 100,
        //         backgroundColor: '#cc0000'
        //     },
        // });

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

    getBalance = async () => {
        await this.getIncomes();
        await this.getExpenditures();
        this.setState({
            flexIncomeBar: 0.35,
            flexExpenditureBar: 0.65,
        });
    };

    // shouldComponentUpdate(nextProps, nextState) {
    //     return true;
    // }

    render() {
        this.getBalance();

        return (
            <View style={styles.mainView}>
                <Text> Esta es la pantalla de balanza </Text>

                <Text>Total Incomes: {this.state.totalIncomes}</Text>
                <Text>Total Expenditures: {this.state.totalExpenditures}</Text>

                <View style={styles.barContainer}>
                    <View style={{
                        ...styles.incomeBar,
                        ...{ flex: this.state.flexIncomeBar }
                    }}>
                        <Text style={styles.barLabel}>
                            ${this.state.totalIncomes}
                        </Text>
                    </View>
                    <View style={{
                        ...styles.expenditureBar,
                        ...{ flex: this.state.flexExpenditureBar}
                    }}>
                        <Text style={styles.barLabel}>
                            ${this.state.totalExpenditures}
                        </Text>
                    </View>
                </View>

            </View>
        );
    }
}