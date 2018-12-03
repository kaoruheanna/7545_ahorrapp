import React from 'react';
import {Text, View, StyleSheet, Button} from 'react-native';
import {StorageService} from "../StorageService";
import { Icon } from 'react-native-elements'
import t from "tcomb-form-native";
import moment from "moment";

const styles = StyleSheet.create({
    mainView: {
        flexDirection: 'column',
        alignItems: 'center',
    },
    filterContainer: {
        width: 200,
        marginLeft: 10,
        marginRight: 10,
        marginBottom: 20,
        marginTop: 10,
    },
    barContainer: {
        flexDirection: 'row',
        justifyContent:'center',
        height: 100,
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

const Form = t.form.Form;
Form.stylesheet.dateValue.normal.borderColor = '#d0d2d3';
Form.stylesheet.dateValue.normal.borderRadius = 4;
Form.stylesheet.dateValue.normal.borderWidth = 1;


const formOptions = {
    auto: 'none',
    fields: {
        since: {
            placeholder: 'Desde',
            mode: 'date',
            config: {
                format: (date) => moment(date).format('DD-MM-YY'),
                defaultValueText: "Desde",
                dialogMode: "spinner",
            },
        },
        until: {
            placeholder: 'Hasta',
            mode: 'date',
            config: {
                format: (date) => moment(date).format('DD-MM-YY'),
                defaultValueText: "Hasta",
                dialogMode: "spinner",
            },
        }
    }
};

const BalanceFilters = t.struct({
    since: t.maybe(t.Date),
    until: t.maybe(t.Date),
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
            balance: 0,
            balanceIcon: POSITIVE_BALANCE_ICON,
            flexIncomeBar: 0.5,
            flexExpenditureBar: 0.5,
            filters: {
                since: null,
                until: null,
            }
        };

        this._isMounted = false;
    }

    getIncomes = async () => {
        const incomes = await StorageService.getIncomes();
        return incomes.reduce((carry, income) => {
            return carry + income.money;
        }, 0);
    };

    getExpenditures = async () => {
        const expenditures = await StorageService.getExpenditures();
        return expenditures.reduce((carry, income) => {
            return carry + income.money;
        }, 0);
    };

    getBalance = async () => {
        const totalIncomes = await this.getIncomes();
        const totalExpenditures = await this.getExpenditures();

        const balance = totalIncomes - totalExpenditures;
        const balanceIcon = (balance >= 0) ? POSITIVE_BALANCE_ICON : NEGATIVE_BALANCE_ICON;

        if (!this._isMounted) {
            return;
        }

        let flexIncomeBar = 0.5;
        let flexExpenditureBar = 0.5;

        const total = totalIncomes + totalExpenditures;
        if (total > 0) {
            flexIncomeBar = this.state.totalIncomes / total;
            flexIncomeBar = Math.max(flexIncomeBar, MIN_FLEX);
            flexIncomeBar = Math.min(flexIncomeBar, MAX_FLEX);

            flexExpenditureBar = this.state.totalExpenditures / total;
            flexExpenditureBar = Math.max(flexExpenditureBar, MIN_FLEX);
            flexExpenditureBar = Math.min(flexExpenditureBar, MAX_FLEX);
        }

        this.setState({
            totalIncomes: totalIncomes,
            totalExpenditures: totalExpenditures,
            balance: balance,
            balanceIcon: balanceIcon,
            flexIncomeBar: flexIncomeBar,
            flexExpenditureBar: flexExpenditureBar,
        });
    };

    onChange = (value) => {
        console.log("filters:", value);
        this.setState({ filters: value });
    };

    onPress = () => {
        var value = this.refs.form.getValue();
        if (value) {
            console.log("value:",value);
        }
    };

    render() {
        this.getBalance();

        return (
            <View style={styles.mainView}>
                <View style={styles.filterContainer}>
                    <Form
                        ref="form"
                        type={BalanceFilters}
                        value={this.state.filters}
                        onChange={this.onChange.bind(this)}
                        options={formOptions}
                    />
                    <Button title="Filtrar" onPress={this.onPress} styles={styles.container}/>
                </View>

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