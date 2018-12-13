import React from 'react';
import {Text, View, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator} from 'react-native';
import { Icon } from 'react-native-elements'
import DrawerComponent from '../components/DrawerComponent.js';
import { Table, Row, TableWrapper, Cell } from 'react-native-table-component';
import Modal from "react-native-modal";
import {StorageService} from "../StorageService";
import moment from "moment";
import * as Progress from 'react-native-progress';
import t from "tcomb-form-native";
import Button from 'react-native-really-awesome-button/src/themes/rick';
import numbro from "numbro";
import DropdownAlert from 'react-native-dropdownalert';

const PERCENTAGE_VALUES = [0.1, 0.35, 0.5, 0.65, 0.9];
const LOADING_TIME = 1000;

numbro.setLanguage('es-AR');

const Form = t.form.Form;
Form.stylesheet.dateValue.normal.borderColor = '#d0d2d3';
Form.stylesheet.dateValue.normal.borderRadius = 4;
Form.stylesheet.dateValue.normal.borderWidth = 1;

const formOptions = {
    auto: 'none',
    i18n: {
        optional: '',
    },
    fields: {
        category: {
            label: 'Categoría',
        },        
        from: {
            label: 'Desde',
            placeholder: moment().startOf('month').format('DD-MM-YY'),
            mode: 'date',
            config: {
                format: (date) => moment(date).format('DD-MM-YY'),
                defaultValueText: "Desde",
                dialogMode: "spinner",
            },
        },
        to: {
            label: 'Hasta',
            placeholder: moment().format('DD-MM-YY'),
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
    category: t.maybe(t.enums({
        'Supermercado': 'Supermercado',
        'Alquiler': 'Alquiler',
        'Servicios': 'Servicios',
        'Transporte': 'Transporte',
        'Colegio': 'Colegio',
        'Auto': 'Auto',
        'Sueldo': 'Sueldo',
        'Honorarios': 'Honorarios',        
        'Otros': 'Otros',
    }, 'Category'))
});

export default class BalanceScreen extends React.Component {

    static navigationOptions = {
        drawerLabel: (params) => {
            return (<DrawerComponent title="Balanza" type="balance" focused={params.focused}/>)
        }
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
                    <Text style={{alignSelf: 'center', fontWeight: 'bold'}}>{displayTitle}</Text>
                </View>
            </TouchableOpacity>
        );
        this.props.navigation.setParams({ navigationOptions: this.navigationOptions });
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
            to: moment().endOf('month').toDate(),
            category: null
        }
    }

    async componentDidMount() {
        this.focusListener = this.props.navigation.addListener('willFocus', () => {
            this.getHistory();
        });
    }

    async componentWillMount() {
        if (this.focusListener) this.focusListener.remove();
    }

    navigationOptions = ({navigation}) => {
        return {
            headerRight: (
                <TouchableOpacity onPress={this.showFilters}>
                    <View style={{...styles.container, ...{backgroundColor: "#B7ABA5", flex: 1, alignItems: "center", justifyContent: "center"}}}>
                        <Icon name='filter' type='font-awesome' color="black" />
                    </View>
                </TouchableOpacity>
            ),
        };
    };

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
        const currentPeriod = this.history.filter((movement) => {
            return !movement.deleted && movement.date >= this.filter.from && movement.date <= this.filter.to;
        });

        const totalIncomes = currentPeriod.reduce((acum, movement) => {
            return acum + ( movement.money > 0 ? movement.money : 0 );
        }, 0);

        const totalExpenditures = currentPeriod.reduce((acum, movement) => {
            return acum - ( movement.money < 0 ? movement.money : 0 );
        }, 0);

        const beforeCurrentPeriod = this.history.filter((movement) => {
            return !movement.deleted && movement.date < this.filter.from;
        });

        let initialBalance = 0;

        if (beforeCurrentPeriod.length > 0) {
            initialBalance = beforeCurrentPeriod.reduce((acum, movement) => {
                return acum + movement.money;
            }, 0);
        }

        const total = totalIncomes + totalExpenditures;
        const periodBalance = totalIncomes - totalExpenditures;
        const finalBalance = initialBalance + periodBalance;

        let incomePercentage = 0.5;
        if (total > 0) {
            incomePercentage = totalIncomes / total;
            incomePercentage = PERCENTAGE_VALUES.reduce(function(carry, curr) {
              return (Math.abs(curr - incomePercentage) < Math.abs(carry - incomePercentage) ? curr : carry);
            });
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
            let show = !movement.deleted;
            if (this.filter.from && movement.date < this.filter.from) show = false;
            if (this.filter.to && movement.date > this.filter.to) show = false;
            if (this.filter.category && movement.category != this.filter.category) show = false;
            return show;
        });

        this.calculateBalance();
    };

    getHistory = async () => {
        this.reverse = false;
        this.currentSort = 'none';        
        this.setState({ isLoading: true });
        const incomes = await this.getIncomes();
        const expenditures = await this.getExpenditures();

        this.history = incomes.concat(expenditures);

        this.filterHistory();
        this.sortHistory('date');
        const displayData = this.displayFormatHistory();
        setTimeout(() => {this.setState({ tableData: displayData, isLoading: false })}, LOADING_TIME);
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
            return  { 
                        date: moment(movement.date).format('DD-MM-YY'), 
                        category: movement.category, 
                        money: this.formatCurrency(movement.money),
                        positive: movement.money > 0,
                    };
        });
    }

    showModal(index) {
        this.setState({modalVisible: true, modalIndex: index, modalData: this.shownHistory[index]});
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

    onEliminatePress = () => {
        this.setState({ isLoading: true, modalVisible: false });
        this.shownHistory[this.state.modalIndex].deleted = true;
        this.filterHistory();
        const displayData = this.displayFormatHistory();        
        setTimeout(() => {
            this.setState({ tableData: displayData, isLoading: false });
            this.dropdown.alertWithType('success', 'Eliminado!', "");
        }, LOADING_TIME);

    };

    formatCurrency = (value) => {
        return numbro(value).formatCurrency({thousandSeparated: true, mantissa: 2});
    };

    render() {
        const state = this.state;

        return (
            <View style={{ flex: 1, backgroundColor: '#fff' }}>
                <DropdownAlert successColor='#C5DD99' closeInterval={2000} ref={ref => this.dropdown = ref} />

                <Modal isVisible={state.isLoading}>
                    <ActivityIndicator animating={true} size="large" style={{ flex: 1, 
                    alignItems: 'center', justifyContent: 'center', height: 80 }}/>
                </Modal>

                <Modal isVisible={state.filtersVisible} onBackdropPress={() => this.hideFilters()}>
                    <View style={{ flex: 0.7, borderRadius: 10, flexDirection: 'column', alignItems: 'center', padding: 32, backgroundColor: '#fff' }}>
                        <View style={{flexDirection:'row'}}>
                            <View style={{flex:0.8}}>
                                <Form
                                    ref="form"
                                    type={BalanceFilters}
                                    value={this.filter}
                                    options={formOptions}
                                />                            
                            </View>
                        </View>
                        <Button onPress={this.onFilterPress} backgroundColor="#B7ABA5" backgroundDarker="#E5DED3">
                            <Text style={{fontWeight: 'bold', fontSize: 20}}>
                                Filtrar
                            </Text>
                        </Button>
                    </View>
                </Modal>

                <Modal isVisible={state.modalVisible} onBackdropPress={() => this.hideModal()}>
                    <View style={{ flex: 0.4, borderRadius: 10, flexDirection: 'column', alignItems: 'center', padding: 32, backgroundColor: '#fff' }}>
                        { state.modalData &&
                        <View>
                            <View style={{flexDirection:'row'}}>
                                <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between', padding:5}}>
                                    <Text>Fecha</Text>
                                    <Text> 
                                        {moment(state.modalData.date).format('DD-MM-YY')}
                                    </Text>
                                </View>
                            </View>
                            <View style={{flexDirection:'row'}}>
                                <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between', padding:5}}>
                                    <Text>Categoria</Text>
                                    <Text> 
                                        {state.modalData.category}
                                    </Text>
                                </View>
                            </View>
                            <View style={{flexDirection:'row'}}>
                                <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between', padding:5}}>
                                    <Text>Concepto</Text>
                                    <Text> 
                                        {state.concept}
                                    </Text>
                                </View>
                            </View>
                            <View style={{flexDirection:'row'}}>
                                <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between', padding:5, paddingBottom: 15}}>
                                    <Text>Monto</Text>
                                    <Text> 
                                        {this.formatCurrency(state.modalData.money)}
                                    </Text>
                                </View>
                            </View>
                            <Button onPress={this.onEliminatePress} backgroundColor="#E59092" backgroundDarker="#E5DED3">
                                <Text style={{fontWeight: 'bold', fontSize: 20}}>
                                    Eliminar
                                </Text>
                            </Button>
                        </View>
                        }
                    </View>
                </Modal>

                <View style={{ flex: 0.45, flexDirection:'column', justifyContent: 'center', alignItems: 'center' }}>
                    <View style={{flexDirection:'row'}}>
                        <View style={{flex: 0.9, flexDirection: 'row', justifyContent: 'center', padding: 20}}>
                            <Text style={{fontWeight:'bold', fontSize:20}}>
                                Periodo {moment(this.filter.from).format('DD/MM/YY')} - {moment(this.filter.to).format('DD/MM/YY')}
                            </Text>
                        </View>
                    </View>                
                    <View style={{flexDirection:'row', justifyContent: 'space-evenly'}}>
                        <View style={{flex: 0.5, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding:5}}>
                            <Text style={{fontWeight:'bold', fontSize:20}}>Balance Inicial</Text>
                            <Text style={[ (state.initialBalance < 0) ? 
                                {fontWeight:'bold', color:'red', fontSize:20} : 
                                {fontWeight:'bold', fontSize:20}]
                            }>
                                {this.formatCurrency(state.initialBalance)}
                            </Text>
                        </View>
                        <View style={{flex: 0.5, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding:5}}>
                            <Text style={{fontWeight:'bold', fontSize:20}}>Balance Final</Text>
                            <Text style={[ (state.finalBalance < 0) ? 
                                {fontWeight:'bold', color:'red', fontSize:20} : 
                                {fontWeight:'bold', fontSize:20}]
                            }>
                                {this.formatCurrency(state.finalBalance)}
                            </Text>
                        </View>                        
                    </View>
                    <View style={{flexDirection:'row', paddingTop:16, paddingBottom:16, justifyContent: 'center', alignItems: 'center'}}>
                        <Progress.Bar style={{flex:0.9}} 
                        progress={state.incomePercentage} 
                        color='#C5DD99' 
                        unfilledColor='#E59092'
                        borderColor='black'
                        width={null} 
                        height={30} 
                        borderRadius={10}/>
                        <View style={{width: '85%', position: 'absolute'}}>
                            <View style={{flexDirection:'row', justifyContent:'space-between', alignItems: 'center'}}>
                                <Text>{this.formatCurrency(state.totalIncomes)}</Text>
                                <Text style={{fontWeight: 'bold', fontSize: 36, paddingBottom: 8}}> | </Text>
                                <Text>{this.formatCurrency(state.totalExpenditures)}</Text>
                            </View>
                        </View>
                    </View>
                </View>            

                <View style={{...styles.container, ...{flex: 0.5}}}>
                    <Table borderStyle={{borderColor: 'black', borderRadius: 10, overflow:'hidden'}}>
                        <Row data={state.tableHead} style={styles.head}/>
                        <ScrollView style={styles.dataWrapper}>
                            {
                                state.tableData.map((rowData, index) => (
                                    <TouchableOpacity key={index} onPress={() => this.showModal(index)}>
                                        <TableWrapper key={index} style={[rowData.positive ? {flexDirection: 'row', backgroundColor: '#C5DD99'} : {flexDirection: 'row', backgroundColor: '#E59092'}]}>
                                            <Cell key={0} data={rowData.date} textStyle={styles.text}/>
                                            <Cell key={1} data={rowData.category} textStyle={styles.text}/>
                                            <Cell key={2} data={rowData.money} 
                                            textStyle={{...styles.text, ...{textAlign: 'right'}}}/>
                                        </TableWrapper>
                                    </TouchableOpacity>
                                ))
                            }
                            { state.tableData.length == 0 &&
                                <Cell key={0} data="No hay movimientos para este periodo"
                                textStyle={{fontWeight:'bold', alignSelf: 'center'}}/>
                            }
                            
                        </ScrollView>
                    </Table>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, backgroundColor: '#fff' },
  head: { height: 40, backgroundColor: '#E5DED3'},
  text: { margin: 6 }
})