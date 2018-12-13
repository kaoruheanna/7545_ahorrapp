import React from 'react';
import {StorageService} from "../StorageService";
import cloneDeep from 'lodash/cloneDeep';

let BAL = 'Balance';
let WRN = 'Atención';
let TXT = 'A Saber';

module.exports = {

  formatItem: (item) => {
    return item.cat + ": " + item.msg;
  },
};

module.exports.getData = async () => {
  const incs = await StorageService.getIncomesAsVariable();
  const exps = await StorageService.getExpendituresAsVariable();
  return advices(incs,exps);
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

function dia_y_num(date) {
  let str = "";
  switch (date.getDay()) {
    case 0: str = "domingo ";break;
    case 1: str = "lunes ";break;
    case 2: str = "martes ";break;
    case 3: str = "miércoles ";break;
    case 4: str = "jueves ";break;
    case 5: str = "viernes ";break;
    case 6: str = "sábado ";break;
  }
  return str+date.getDate();
}
function advices(incs,exps) {

  //BALANCE
  let advs = [];
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
    advs.push({cat: BAL, msg: 'parece que estás teniendo un balance positivo a corto plazo, pensaste' +
          ' en invertir? Una buena opción es: comprar dólares'});
  }
  //deficit este mes cancelable con el que viene
  if (this_month_balance < 0 && dif >0){
    advs.push({cat:BAL, msg: 'si bien este mes está difícil, tranquilo: el siguiente deberías poder' +
          'cancelar tus deudas y que te quede un sobrante de $' + dif});
  }
  // deficit este mes
  if (this_month_balance < 0){
    let max_exp = this_month_movs.reduce( (ant,mov) => {
      if (mov.money > ant.money){
        return ant;
      }
      return mov;
    }, {money: 0});
    if (max_exp.money < 0){
      let cat = max_exp.category;
      let money = - max_exp.money;
      advs.push({cat: BAL, msg: 'Este mes tenés un gasto de $'+money+" en "+cat+", quizás quieras" +
            " cancelarlo primero para que no se acumule"})
    }
  }
  //superavit este mes y deficit el que viene
  if (this_month_balance > 0 && next_month_balance < 0){
    //si llega a salvarse con lo de este mes
    if (dif > 0) {
      advs.push({cat: BAL, msg: 'El mes que viene pareciera cerrar en baja, pero no hay por qué alarmarse! '+
            'Guardando $'+ (-next_month_balance) + ' de los $'+this_month_balance+ ' que debieran quedarte' +
            ' este mes, estarías bien.'});
    }
    else{
      advs.push({cat:BAL,msg:'El mes que viene es un poco más complicado, tal vez quieras ahorrar todo lo' +
            ' posible éste para afrontarlo mejor.'});
    }
  }

  //VALORES PUNTUALES
  let fixed_exps_this_month = exps.filter( (exp) => {return exp.is_f && in_next_n_month(exp.date, 0);} );
  let today = new Date();
  console.log(fixed_exps_this_month);//debug
  let next_fixed_exps = fixed_exps_this_month.filter( (fexp) => {return fexp.date > today;});
  if (next_fixed_exps.length) {
    let next_fixed_exp = next_fixed_exps.reduce(
        (ant, fexp) => {
          return (ant.date || new Date(2099,1,1)) > fexp.date ? fexp : ant;
        }
    );
    advs.push({cat:WRN,msg:'tu próximo gasto fijo este mes es de $'+next_fixed_exp.money+ " en "+
          next_fixed_exp.category +" el " + dia_y_num(next_fixed_exp.date)});
    /**/
    /*
    const max_exp = exps.reduce(
        (carry, exp) => {
          return (carry.money > exp.money) ? carry : exp;
        }
    );
    /*
    advs.push({cat: 'warning',
               msg: 'tu máximo gasto es de $'+max_exp.money + ' el '+.dia_y_num(max_exp.date)});
    */
  }

  //FILLERS Y OTROS TEXTOS
  /*advs.push({
    cat: "filler", msg: 'texto largo largo largo largo largo largo largo largo largo largo largo largo '+
        'largolargolargo' + 'largolargolargo'+ 'largolargolargo'+'largolargolargo'+'largolargolargo'+
        'largolargolargo'+'largolargolargo'+'largolargolargo'+'largolargolargo'+'largolargolargo'
  });
  advs.push({cat: "filler", msg: 'y ahora uno corto'} );
  */

  return advs;
}