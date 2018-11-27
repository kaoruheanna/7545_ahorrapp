import { AsyncStorage } from "react-native"
import concat from 'lodash/concat'

export class StorageService {

    static addMovement = async (key, movement) => {
        try {
            let movements = await StorageService.getMovemements(key);
            movements.push(movement);
            await AsyncStorage.setItem(key, JSON.stringify(movements));
        } catch (error) {
            console.error("error saving: ",error);
        }
    };

    static getMovemements = async (key) => {
        try {
            const movements = await AsyncStorage.getItem(key);
            return (movements === null) ? [] : JSON.parse(movements);
        } catch (error) {
            console.error("error retrieving: ",error);
        }
    };

    static saveFixedIncome = async (income) => {
        await StorageService.addMovement('fixed_income', income);
    };

    static saveVariableIncome = async (income) => {
        await StorageService.addMovement('variable_income', income);
    };

    static getIncomes = async () => {
        const fixedIncomes = await StorageService.getMovemements('fixed_income');
        const variableIncomes = await StorageService.getMovemements('variable_income');
        return concat(fixedIncomes, variableIncomes)
    }

    static saveFixedExpenditure = async (expenditure) => {
        await StorageService.addMovement('fixed_expenditure', expenditure);
    };

    static saveVariableExpenditure = async (expenditure) => {
        await StorageService.addMovement('variable_expenditure', expenditure);
    };

    static getExpenditures = async () => {
        const fixedExpenditures = await StorageService.getMovemements('fixed_expenditure');
        const variableExpenditures = await StorageService.getMovemements('variable_expenditure');
        return concat(fixedExpenditures, variableExpenditures)
    }
}