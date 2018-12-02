import React from 'react';
import {StorageService} from "../StorageService";

module.exports = {

  formatItem: (item) => {
    return item.cat + ": " + item.msg;
  },
};

module.exports.getData = async () => {
  const incas = await StorageService.getIncomesAsVariable();
  const exps = await StorageService.getExpendituresAsVariable();
  return [].concat(advBalance(),advWarning(exps),fillerWarning());
};

function advBalance() {
  return [{cat: 'balance', msg: 'estas gastando mucho'}];
}

function advWarning(exps) {
  let advs = [{cat: 'warning', msg: 'del 7-11 al 10-12 tenes un gasto de $1200'}];
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
  return [{
    cat: "filler", msg: 'texto largo largo largo largo largo largo largo largo largo largo largo largo '+
        'largolargolargo' + 'largolargolargo'+ 'largolargolargo'+'largolargolargo'+'largolargolargo'+
        'largolargolargo'+'largolargolargo'+'largolargolargo'+'largolargolargo'+'largolargolargo'
  },{
    cat: "filler", msg: 'y ahora uno corto'
  }
  ];
}