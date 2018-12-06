import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import t from 'tcomb-form-native';
import moment from 'moment';
import { StorageService } from "../StorageService";
import cloneDeep from 'lodash/cloneDeep';
import DropdownAlert from 'react-native-dropdownalert';
import Button from 'react-native-really-awesome-button/src/themes/rick';

const Form = t.form.Form;
Form.stylesheet.dateValue.normal.borderColor = '#d0d2d3';
Form.stylesheet.dateValue.normal.borderRadius = 4;
Form.stylesheet.dateValue.normal.borderWidth = 1;

const Category = t.enums({
    'Supermercado': 'Supermercado',
    'Alquiler': 'Alquiler',
    'Servicios': 'Servicios',
    'Transporte': 'Transporte',
    'Colegio': 'Colegio',
    'Auto': 'Auto',
    'Otros': 'Otros',
}, 'Category');

const initState = {
    value: {
        money: null,
        category: 'Supermercado',
        concept: '',
        date: null,
    }
};

var options = {
    i18n: {
        optional: ' (opcional)',
        required: '',
        add: 'Add',   // add button
        remove: '✘',  // remove button
        up: '↑',      // move up button
        down: '↓'     // move down button        
    },    
    fields: {
        money: {
            label: 'Monto',
            placeholder: '$',
        },
        category: {
            label: 'Categoría',
            nullOption: false,
        },
        concept: {
            label: 'Concepto',
            placeholder: '',
        },
        date: {
            label: 'Fecha',
            mode: 'date',
            config: {
                format: (date) => moment(date).format('DD-MM'),
                defaultValueText: " ",
                dialogMode: "spinner",
            },
        },
    }
};

const VariableExpenditure = t.struct({
    money: t.Number,
    category: Category,
    concept: t.maybe(t.String),
    date: t.Date,
});

const styles = StyleSheet.create({
    container: {
        marginTop: 20,
        marginLeft: 20,
        marginRight: 20,
    }
});

export default class VariableExpenditureScreen extends React.Component {

    static navigationOptions = {
        title: 'Gastos variables',
    };

    constructor(props) {
        super(props);
        this.state = cloneDeep(initState);
    }

    onChange = (value) => {
        this.setState({ value });
    };

    onPress = () => {
        var value = this.refs.form.getValue();
        if (value) {
            StorageService.saveVariableExpenditure(value);
            this.clearForm();
            this.dropdown.alertWithType('success', 'Guardado!', "");
        }
    };

    clearForm = () => {
        this.setState(cloneDeep(initState));
    };

    render() {
        return (
            <View>
                <View style={styles.container}>
                    <Form
                        ref="form"
                        type={VariableExpenditure}
                        value={this.state.value}
                        onChange={this.onChange.bind(this)}
                        options={options}
                    />
                    <Button backgroundColor="#B7ABA5" backgroundDarker="#E5DED3" 
                    style={{alignSelf:'center'}} onPress={this.onPress}>
                        <Text style={{fontWeight: 'bold', fontSize: 20}}>Guardar</Text>
                    </Button>
                </View>
                <DropdownAlert successColor='#C5DD99' ref={ref => this.dropdown = ref} />
            </View>
        );
    }
}