import React from 'react';
import {StorageService} from "../StorageService";

module.exports = {

  formatItem: (item) => {
    return item.cat + ": " + item.msg;
  },
};

module.exports.getData = async () => {
  const incomes = await StorageService.getIncomesAsVariable();
  const expenditures = await StorageService.getExpendituresAsVariable();
  return [].concat(advBalance(),advWarning(),fillerWarning());
};

function advBalance() {
  return [{cat: 'balance', msg: 'estas gastando mucho'}];
}

function advWarning() {
  return [{cat: 'warning', msg: 'del 7-11 al 10-12 tenes un gasto de $1200'}];
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