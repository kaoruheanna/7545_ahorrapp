import { AsyncStorage } from "react-native"
import concat from 'lodash/concat'

export class StorageService {

    static addMovement = async (key, movement) => {
        try {
            let movements = await StorageService.getMovemements(key);
            movement.id = movements.nextId;
            movements.nextId++;
            movements.list.push(movement);
            await AsyncStorage.setItem(key, JSON.stringify(movements));
        } catch (error) {
            console.error("error saving: ",error);
        }
    };

    static getMovemements = async (key) => {
        try {
            const movements = await AsyncStorage.getItem(key);
            console.log('movements: ', movements);
            return (movements == null) ? {nextId: 1, list: []} : JSON.parse(movements);
        } catch (error) {
            console.error("error retrieving: ",error);
        }
    };

    static clearStorage = async (key) => {
      try {
          await AsyncStorage.multiRemove(['fixed_income', 'variable_income', 
                      'fixed_expenditure', 'variable_expenditure']);
      } catch (error) {
          console.error('error removing: ', error);
      }
    }

    static saveFixedIncome = async (income) => {
        await StorageService.addMovement('fixed_income', income);
    };

    static saveVariableIncome = async (income) => {
        await StorageService.addMovement('variable_income', income);
    };

    static getIncomes = async () => {
        const fixedIncomes = (await StorageService.getMovemements('fixed_income')).list;
        const variableIncomes = (await StorageService.getMovemements('variable_income')).list;
        return concat(fixedIncomes, variableIncomes)
    }

    static saveFixedExpenditure = async (expenditure) => {
        await StorageService.addMovement('fixed_expenditure', expenditure);
    };

    static saveVariableExpenditure = async (expenditure) => {
        await StorageService.addMovement('variable_expenditure', expenditure);
    };

    static getExpenditures = async () => {
        const fixedExpenditures = (await StorageService.getMovemements('fixed_expenditure')).list;
        const variableExpenditures = (await StorageService.getMovemements('variable_expenditure')).list;
        return concat(fixedExpenditures, variableExpenditures)
    }

    static getIncomesAsVariable = async () => {
      var variableIncomes= (await StorageService.getMovemements('variable_income')).list;
      variableIncomes = variableIncomes.map(
          function (income) {
            return {money: income.money, date: new Date(income.date), category: income.category, concept: income.concept, is_f:false}
          }
      );
      const fixedIncomes = (await StorageService.getMovemements('fixed_income')).list;
      fixedIncomes.forEach(function (income) {
        let act_date = new Date(income.since);   //esta mierda de adentro es string! ej.: "2018-11-27T03:00:00.000Z"
        const threshold = new Date(income.until)
        while (act_date <= threshold) {
          variableIncomes.push({money: income.money, date: new Date(act_date.getTime()), category: income.category, concept: income.concept, is_f:true});
          act_date.setMonth(1 + act_date.getMonth()); //possibly buggy: see https://stackoverflow.com/questions/12793045/adding-months-to-a-date-in-javascript
        }
      });
      return variableIncomes;
    };

    static getExpendituresAsVariable = async () => {
      var variableExp= (await StorageService.getMovemements('variable_expenditure')).list;
      variableExp = variableExp.map(
          function (exp) {
            return {money: exp.money, date: new Date(exp.date), category: exp.category, concept: exp.concept, is_f:false}
          }
      );
      const fixedExp = (await StorageService.getMovemements('fixed_expenditure')).list;
      fixedExp.forEach(function (exp) {
        let act_date = new Date(exp.since);   //esta mierda de adentro es string! ej.: "2018-11-27T03:00:00.000Z"
        const threshold = new Date(exp.until)
        while (act_date <= threshold) {
          variableExp.push({money: exp.money, date: new Date(act_date.getTime()), category: exp.category, concept: exp.concept, is_f:true});
          act_date.setMonth(1 + act_date.getMonth()); //possibly buggy: see above
        }
      });
      return variableExp;
    };
}