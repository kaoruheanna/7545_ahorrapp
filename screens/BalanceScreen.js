import React from 'react';
import {Text, View, StyleSheet} from 'react-native';
import {StorageService} from "../StorageService";
import { Icon } from 'react-native-elements'


const styles = StyleSheet.create({
    mainView: {
        flexDirection: 'column',
        backgroundColor:"yellow",
        alignItems: 'center',
    },
    barContainer: {
        flexDirection: 'row',
        justifyContent:'center',
        height: 100,
        backgroundColor:"powderblue",
        marginLeft: 10,
        marginRight: 10,
    },
    incomeBar: {
        flex: 1,
        height: 100,
        backgroundColor: '#a4c639',
        justifyContent: 'center',
        alignItems: 'center'
    },
    expenditureBar: {
        flex: 1,
        height: 100,
        backgroundColor: '#cc0000',
        justifyContent: 'center',
        alignItems: 'center'
    },
    barLabel: {
        fontSize: 20,
        fontWeight: 'bold',
        color: "white",
    },
    balanceContainer: {
        flexDirection: 'row',
        justifyContent:'center',
        alignItems: 'center',
        marginTop: 30,
        height: 100,
        width: 200,
        backgroundColor: "blue",
    },
    balance: {
        flex: 1,
        height: 100,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    balanceIcon : {
        flex: 0.2,
        height: 100,
        marginRight: 5,
    },
    balanceText: {
        color: "white",
        fontSize: 20,
        fontWeight: 'bold',
    }
});

const MIN_FLEX = 0.25;
const MAX_FLEX = 1 - MIN_FLEX;
const POSITIVE_BALANCE_ICON = 'plus-circle';
const NEGATIVE_BALANCE_ICON = 'minus-circle';

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
            balance: 0,
            balanceIcon: POSITIVE_BALANCE_ICON,
            flexIncomeBar: 0.5,
            flexExpenditureBar: 0.5,
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

    getBalance = async () => {
        await this.getIncomes();
        await this.getExpenditures();
        const balance = this.state.totalIncomes - this.state.totalExpenditures;
        const balanceIcon = (balance >= 0) ? POSITIVE_BALANCE_ICON : NEGATIVE_BALANCE_ICON;
        this.setState({balance, balanceIcon});

        const total = this.state.totalIncomes + this.state.totalExpenditures;
        if (total === 0){
            this.setState({
                flexIncomeBar: 0.5,
                flexExpenditureBar: 0.5,
            });
            return;
        }

        let flexIncome = this.state.totalIncomes/total;
        flexIncome = Math.max(flexIncome, MIN_FLEX);
        flexIncome = Math.min(flexIncome, MAX_FLEX);

        let flexExpenditure = this.state.totalExpenditures/total;
        flexExpenditure = Math.max(flexExpenditure, MIN_FLEX);
        flexExpenditure = Math.min(flexExpenditure, MAX_FLEX);

        this.setState({
            flexIncomeBar: flexIncome,
            flexExpenditureBar: flexExpenditure,
        });
    };

    render() {
        this.getBalance();

        return (
            <View style={styles.mainView}>
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
                <View style={styles.balanceContainer}>
                    <View style={styles.balance}>
                        <Icon name={this.state.balanceIcon} type='font-awesome' color="white" containerStyle={styles.balanceIcon}/>
                        <Text style={styles.balanceText}>$ {Math.abs(this.state.balance)}</Text>
                    </View>
                </View>

            </View>
        );
    }
}