import { AsyncStorage } from "react-native"

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
        console.log("llame a saveFixedIncome:", income);
        await StorageService.addMovement('fixed_income', income);
    };

    static saveVariableIncome = async (income) => {
        console.log("llame a saveVariableIncome:", income);
        await StorageService.addMovement('variable_income', income);
    };

    static getIncomes = async () => {
        const fixedIncomes = await StorageService.getMovemements('fixed_income');
        return fixedIncomes;
    }

    static saveFixedExpenditure = async (expenditure) => {
        console.log("llame a saveFixedExpenditure:", expenditure);
        await StorageService.addMovement('fixed_expenditure', expenditure);
    };

}