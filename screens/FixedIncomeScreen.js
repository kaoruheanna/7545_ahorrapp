import React from 'react';
import {Button, Text, View} from 'react-native';
import t from 'tcomb-form-native';
import moment from 'moment';
import { StorageService } from "../StorageService";
import cloneDeep from 'lodash/cloneDeep';

const Form = t.form.Form;

const Category = t.enums({
    'Sueldo': 'Sueldo',
    'Honorarios': 'Honorarios',
    'Otros': 'Otros'
}, 'Category');

const initState = {
    value: {
        money: null,
        category: 'Sueldo',
        concept: '',
        since: null,
        until: null,
    }
};

var options = {
    auto: 'placeholders',
    fields: {
        money: {
            label: 'Monto'
        },
        category: {
            label: 'Categoría',
            nullOption: false
        },
        concept: {
            label: 'Concepto'
        },
        since: {
            label: 'Desde',
            mode: 'date',
            config: {
                format: (date) => moment(date).format('DD-MM'),
            },
        },
        until: {
            label: 'Hasta',
            mode: 'date',
            config: {
                format: (date) => moment(date).format('DD-MM'),
            },
        }
    }
};

const FixedIncome = t.struct({
    money: t.Number,
    category: Category,
    concept: t.maybe(t.String),
    since: t.Date,
    until: t.Date,
});

export default class FixedIncomeScreen extends React.Component {

    static navigationOptions = {
        title: 'Ingreso Fijo',
    };

    constructor(props) {
        super(props);
        this.state = cloneDeep(initState);
        console.log("constructor:", this.state);
    }

    onChange = (value) => {
        this.setState({ value });
    };

    onPress = () => {
        var value = this.refs.form.getValue();
        if (value) {
            StorageService.saveFixedIncome(value);
            this.clearForm();
        }
    };

    clearForm = () => {
        this.setState(cloneDeep(initState));
    };

    render() {
        return (
            <View>
                <Text> Esta es la pantalla de ingresos fijos </Text>

                <Form
                    ref="form"
                    type={FixedIncome}
                    value={this.state.value}
                    onChange={this.onChange.bind(this)}
                    options={options}
                />

                <Button title="Guardar" onPress={this.onPress}/>
            </View>
        );
    }
}