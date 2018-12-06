import React from 'react';
import {Text, View, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator} from 'react-native';
import { Icon } from 'react-native-elements'
import {NavigationActions, StackActions} from "react-navigation";
import { Table, Row } from 'react-native-table-component';
import Modal from "react-native-modal";
import {StorageService} from "../StorageService";
import moment from "moment";
import * as Progress from 'react-native-progress';
import t from "tcomb-form-native";
import Button from 'react-native-really-awesome-button/src/themes/rick';

const MIN_FLEX = 0.25;
const MAX_FLEX = 1 - MIN_FLEX;
const LOADING_TIME = 1000;

const Form = t.form.Form;
Form.stylesheet.dateValue.normal.borderColor = '#d0d2d3';
Form.stylesheet.dateValue.normal.borderRadius = 4;
Form.stylesheet.dateValue.normal.borderWidth = 1;

const formOptions = {
    auto: 'none',
    fields: {
        from: {
            placeholder: 'Desde',
            mode: 'date',
            config: {
                format: (date) => moment(date).format('DD-MM-YY'),
                defaultValueText: "Desde",
                dialogMode: "spinner",
            },
        },
        to: {
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
    from: t.maybe(t.Date),
    to: t.maybe(t.Date),
});

export default class HistoryScreen extends React.Component {

    static navigationOptions = ({navigation}) => {
        return {
            title: 'Balanza',
            headerRight: (
                <TouchableOpacity onPress={navigation.getParam('showFilters')}>
                    <View style={{...styles.container, ...{backgroundColor: "#f1f8ff", flex: 1, alignItems: "center", justifyContent: "center"}}}>
                        <Icon name='filter' type='font-awesome' color="black" />
                    </View>
                </TouchableOpacity>
            ),
        };
    };

    constructor(props){
        super(props);
        const tableHeader = (displayTitle, fieldName) => (
            <TouchableOpacity onPress={() => {
                this.setState({isLoading: true});
                this.sortHistory(fieldName);
                const displayData = this.displayFormatHistory();
                setTimeout(() => {
                    this.setState({ 
                        tableData: displayData, 
                        isLoading: false
                    })
                }, LOADING_TIME);
            }}>
                <View>
                    <Text>{displayTitle}</Text>
                </View>
            </TouchableOpacity>
        );
        this.state ={
            tableHead: [
                tableHeader('Fecha', 'date'), 
                tableHeader('Categoria', 'category'), 
                tableHeader('Monto', 'money')
            ],
            tableData: [],
            modalVisible: false,
            filtersVisible: false,
            incomePercentage: 0.5,
            totalIncomes: 0,
            totalExpenditures: 0,
            periodBalance: 0,
            isLoading: true,
        }
        this.reverse = false;
        this.currentSort = 'none';
        this.filter = {
            from: moment().startOf('month').toDate(),
            to: moment().toDate(),
            category: null
        }
    }

    async componentDidMount() {
        this.props.navigation.setParams({ showFilters: this.showFilters });
        this.getHistory();
    }

    getIncomes = async () => {
        const incomes = await StorageService.getIncomesAsVariable();
        return incomes;
    };

    getExpenditures = async () => {
        const expenditures = await StorageService.getExpendituresAsVariable();
        return expenditures.map((expenditure) => {
            expenditure.money = - expenditure.money;
            return expenditure;
        });
    };

    calculateBalance() {
        const totalIncomes = this.shownHistory.reduce((acum, movement) => {
            return acum + ( movement.money > 0 ? movement.money : 0 );
        }, 0);

        const totalExpenditures = this.shownHistory.reduce((acum, movement) => {
            return acum - ( movement.money < 0 ? movement.money : 0 );
        }, 0);

        const beforeShownHistory = this.history.filter((movement) => {
            return movement.date < this.filter.from;
        });

        let initialBalance = 0;

        if (beforeShownHistory.length > 0) {
            initialBalance = beforeShownHistory.reduce((acum, movement) => {
                return acum + movement.money;
            }, 0);
        }

        const total = totalIncomes + totalExpenditures;
        const periodBalance = totalIncomes - totalExpenditures;
        const finalBalance = initialBalance + periodBalance;

        let incomePercentage = 0.5;
        if (total > 0) {
            incomePercentage = totalIncomes / total;
            incomePercentage = Math.max(incomePercentage, MIN_FLEX);
            incomePercentage = Math.min(incomePercentage, MAX_FLEX);
        }

        this.setState({
            incomePercentage: incomePercentage,
            totalIncomes: totalIncomes,
            totalExpenditures: totalExpenditures,
            periodBalance: periodBalance,
            initialBalance: initialBalance,
            finalBalance: finalBalance
        });
    };

    filterHistory() {
        this.shownHistory = this.history.filter((movement) => {
            let show = true;
            if (this.filter.from && movement.date < this.filter.from) show = false;
            if (this.filter.to && movement.date > this.filter.to) show = false;
            if (this.filter.category && movement.category != this.filter.category) show = false;
            return show;
        });

        this.calculateBalance();
    };

    getHistory = async () => {
        const incomes = await this.getIncomes();
        const expenditures = await this.getExpenditures();

        this.history = incomes.concat(expenditures);

        this.filterHistory();
        this.sortHistory('date');
        const displayData = this.displayFormatHistory();
        setTimeout(() => {this.setState({ tableData: displayData, isLoading: false})}, LOADING_TIME);
    };

    getSort(key) {
        this.reverse = this.currentSort == key && !this.reverse;
        this.currentSort = key;
        return (a, b) => {
            if (a[key] < b[key]) return this.reverse? 1 : -1;
            if (a[key] > b[key]) return this.reverse? -1 : 1;
            return 0;
        }
    }

    sortHistory(fieldName) {
        this.shownHistory = this.shownHistory.sort(this.getSort(fieldName));
    }

    displayFormatHistory() {
        return this.shownHistory.map((movement) => {
            return [ moment(movement.date).format('DD-MM-YY'), 
                     movement.category, 
                     movement.money ];
        });
    }

    showModal(index) {
        this.setState({modalVisible: true, modalData: this.history[index]});
    }

    hideModal() {
        this.setState({modalVisible: false});
    }

    showFilters = () => {
        this.setState({filtersVisible: true});
    }

    hideFilters() {
        this.setState({filtersVisible: false});
    }

    onFilterPress = () => {
        this.setState({ isLoading: true, filtersVisible: false });        
        var value = this.refs.form.getValue();

        if (value) {
            this.filter = value;
            this.filterHistory();
            const displayData = this.displayFormatHistory();
            setTimeout(() => {this.setState({ tableData: displayData, isLoading: false})}, LOADING_TIME);
        }
    };

    render() {
        var state = this.state;

        return (
            <View style={{ flex: 1, backgroundColor: '#fff' }}>
                <Modal isVisible={state.isLoading}>
                    <ActivityIndicator animating={true} size="large" style={{ flex: 1, 
                    alignItems: 'center', justifyContent: 'center', height: 80 }}/>
                </Modal>

                <Modal isVisible={state.filtersVisible} onBackdropPress={() => this.hideFilters()}>
                    <View style={{ flex: 0.5, flexDirection: 'column', alignItems: 'center', padding: 32, paddingTop: 30, backgroundColor: '#fff' }}>
                        <View style={{flexDirection:'row'}}>
                            <View style={{flex:0.8}}>
                                <Form
                                    ref="form"
                                    type={BalanceFilters}
                                    value={this.state.filters}
                                    options={formOptions}
                                />                            
                            </View>
                        </View>
                        <Button type="primary" onPress={this.onFilterPress}>
                            <Text>Filtrar</Text>
                        </Button>
                    </View>
                </Modal>

                <Modal isVisible={state.modalVisible} onBackdropPress={() => this.hideModal()}>
                    <View style={{ flex: 0.7, padding: 32, paddingTop: 30, backgroundColor: '#fff' }}>
                        <Text> Something should go here</Text>
                    </View>
                </Modal>

                <View style={{flex: 0.1, flexDirection:'column', justifyContent: 'center', alignItems: 'center'}}>
                    <View style={{flexDirection:'row'}}>
                        <View style={{flex: 0.9, flexDirection: 'row', justifyContent: 'flex-start'}}>
                            <Text>Periodo {moment(this.filter.from).format('DD/MM/YY')} - {moment(this.filter.to).format('DD/MM/YY')}</Text>
                        </View>
                    </View>                                
                </View>
                <View style={{ flex: 0.3, flexDirection:'column', justifyContent: 'center', alignItems: 'center' }}>
                    <View style={{flexDirection:'row'}}>
                        <View style={{flex: 0.9, flexDirection: 'row', justifyContent: 'space-between'}}>
                            <Text>Balance Inicial</Text>
                            <Text>${this.state.initialBalance}</Text>
                        </View>
                    </View>
                    <View style={{flexDirection:'row'}}>
                        <View style={{flex: 0.9, flexDirection: 'row', justifyContent: 'space-between'}}>
                            <Text>Balance Final</Text>
                            <Text>${this.state.finalBalance}</Text>
                        </View>                        
                    </View>
                    <View style={{flexDirection:'row', paddingTop:16}}>
                        <Progress.Bar style={{flex:0.9}} progress={this.state.incomePercentage} color='#a4c639' unfilledColor = '#cc0000' width={null} height={30} borderRadius={10}/>
                    </View>
                    <View style={{flexDirection:'row', paddingBottom:16}}>
                        <View style={{flex:0.9, flexDirection:'row', justifyContent:"space-between"}}>
                            <Text>${this.state.totalIncomes}</Text>
                            <Text>${this.state.totalExpenditures}</Text>
                        </View>
                    </View>
                    
                </View>            

                <View style={{...styles.container, ...{flex: 0.7}}}>
                    <Table borderStyle={{borderColor: '#C1C0B9'}}>
                        <Row data={state.tableHead} style={styles.head} textStyle={styles.text}/>
                        <ScrollView style={styles.dataWrapper}>
                            {
                                state.tableData.map((rowData, index) => (
                                    <TouchableOpacity key={index} onPress={() => this.showModal(index)}>
                                        <Row data={rowData} textStyle={styles.text}/>
                                    </TouchableOpacity>
                                ))
                            }
                        </ScrollView>
                    </Table>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, paddingTop: 30, backgroundColor: '#fff' },
  head: { height: 40, backgroundColor: '#f1f8ff' },
  text: { margin: 6 }
})