import React from 'react';
import {StorageService} from "../StorageService";
import cloneDeep from 'lodash/cloneDeep';

module.exports = {

  formatItem: (item) => {
    return item.cat + ": " + item.msg;
  },
};

module.exports.getData = async () => {
  const incs = await StorageService.getIncomesAsVariable();
  const exps = await StorageService.getExpendituresAsVariable();
  return [].concat(advBalance(incs,exps),advWarning(exps),fillerWarning());
};

function in_next_n_month(date,n) {
  let d = new Date();
  d.setMonth(d.getMonth()+n);
  let y = d.getFullYear();
  let m = d.getMonth();
  let max_day_last_month = new Date(y,m,0);
  let max_day_this_month = new Date(y,m+1,0);
  return  date > max_day_last_month && date <= max_day_this_month;
}

function advBalance(incs,exps) {
  let advs = [];
  advs.push({cat: 'balance', msg: 'estas gastando mucho'});
  let movs = incs.concat(cloneDeep(exps).map(  (exp) => {
    exp.money = - exp.money;
    return exp;})
  );
  let this_month_movs = movs.filter(  (mov) => {return in_next_n_month(mov.date,0);}  );
  let next_month_movs = movs.filter(  (mov) => {return in_next_n_month(mov.date,1);}  );
  let this_month_balance = this_month_movs.reduce(
      (acum, mov) => {return acum + mov.money;}, 0);
  let next_month_balance = next_month_movs.reduce(
      (acum, mov) => {return acum + mov.money;}, 0);
  let dif = next_month_balance + this_month_balance;
  //console.log("este mes: "+this_month_balance); //debug
  //console.log("sig mes: "+next_month_balance); //debug
  //console.log("dif: "+dif); //debug
  //superavit este mes y el que viene
  if (this_month_balance > 0 && next_month_balance > 0){
    advs.push({cat: 'balance', msg: 'parece que estás teniendo un balance positivo a corto plazo, pensaste' +
          ' en invertir? Una buena opción es: comprar dólares'});
  }
  //deficit este mes cancelable con el que viene
  if (this_month_balance < 0 && dif >0){
    advs.push({cat:'balance', msg: 'si bien este mes está difícil, tranquilo: el mes que viene vas a poder' +
          'cancelar tus deudas y te va a quedar un sobrante de $' + dif});
  }
  // deficit este mes
  return advs;
}

function advWarning(exps) {
  let advs = [];
  advs.push({cat: 'warning', msg: 'del 7-11 al 10-12 tenes un gasto de $1200'});
  if (exps.length) {
    const max_exp = exps.reduce(
        (carry, exp) => {
          return (carry.money > exp.money) ? carry : exp;
        }
    );
    advs.push({cat: 'warning',
               msg: 'tu máximo gasto es de $'+max_exp.money + ' el '+max_exp.date.toLocaleDateString('es-AR')});
  }
  return advs;
}

function fillerWarning() {
  let advs = [];
  advs.push({
    cat: "filler", msg: 'texto largo largo largo largo largo largo largo largo largo largo largo largo '+
        'largolargolargo' + 'largolargolargo'+ 'largolargolargo'+'largolargolargo'+'largolargolargo'+
        'largolargolargo'+'largolargolargo'+'largolargolargo'+'largolargolargo'+'largolargolargo'
  });
  advs.push({cat: "filler", msg: 'y ahora uno corto'} );
  return advs;
}