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

    static getIncomesAsVariable = async () => {
      var variableIncomes= await StorageService.getMovemements('variable_income');
      const fixedIncomes = await StorageService.getMovemements('fixed_income');
      fixedIncomes.forEach(function (income) {
        let act_date = new Date(income.since);   //esta mierda de adentro es string! ej.: "2018-11-27T03:00:00.000Z"
        console.log(act_date); //debug
        while (act_date <= income.until) {
          variableIncomes.push({money: income.money, date: act_date, category: income.category});
          act_date.setMonth(1 + act_date.getMonth()); //possibly buggy: see https://stackoverflow.com/questions/12793045/adding-months-to-a-date-in-javascript
        }
      });
      return variableIncomes;
    };

    static getExpendituresAsVariable = async () => {
      var variableExp= await StorageService.getMovemements('variable_expenditure');
      const fixedExp = await StorageService.getMovemements('fixed_expenditure');
      fixedExp.forEach(function (exp) {
        let act_date = new Date(exp.since);   //esta mierda de adentro es string! ej.: "2018-11-27T03:00:00.000Z"
        console.log(act_date); //debug
        while (act_date <= exp.until) {
          variableExp.push({money: exp.money, date: act_date, category: exp.category});
          act_date.setMonth(1 + act_date.getMonth()); //possibly buggy: see above
        }
      });
      return variableExp;
    };
}