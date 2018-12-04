import React from 'react';
import {Text, View, ScrollView, TouchableOpacity, StyleSheet} from 'react-native';
import {NavigationActions, StackActions} from "react-navigation";
import { Table, Row, Rows } from 'react-native-table-component';
import {StorageService} from "../StorageService";
import moment from "moment";

export default class HistoryScreen extends React.Component {

    static navigationOptions = {
        title: 'Historial',
    };

    constructor(props){
        super(props);
        const tableHeader = (displayTitle, fieldName) => (
            <TouchableOpacity onPress={() => this.sortHistory(fieldName)}>
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
            tableData: []
        }
        this.reverse = false;
        this.currentSort = 'none';
    }

    async componentDidMount() {
      return this.getHistory();
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
        this.history = this.history.sort(this.getSort(fieldName));
        this.setState({
            tableData: this.displayFormatHistory()
        });        
    }

    displayFormatHistory() {
        return this.history.map((movement) => {
            return [ moment(movement.date).format('DD-MM-YY'), 
                     movement.category, 
                     movement.money ];
        });
    }

    getHistory = async () => {
        const incomes = await this.getIncomes();
        const expenditures = await this.getExpenditures();
        this.history = incomes.concat(expenditures);

        this.sortHistory('date');
    };

    render() {
        const state = this.state;
        return (
            <View style={styles.container}>
                <Table borderStyle={{borderColor: '#C1C0B9'}}>
                    <Row data={state.tableHead} style={styles.head} textStyle={styles.text}/>
                </Table>
                <ScrollView style={styles.dataWrapper}>
                    <Table borderStyle={{borderColor: '#C1C0B9'}}>
                        <Rows data={state.tableData} textStyle={styles.text}/>
                    </Table>
                </ScrollView>
            </View>
        )
    }
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, paddingTop: 30, backgroundColor: '#fff' },
  head: { height: 40, backgroundColor: '#f1f8ff' },
  text: { margin: 6 }
})