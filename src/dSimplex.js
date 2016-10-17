const {
  multiplyByMinusOne,
} = require('./helpers');
const _ = require('lodash');

// Calcula direção simplex
module.exports = (invB, vk, m, xb) => {
  const DS = multiplyByMinusOne(invB).multiply(vk);
  let AP = [];

  const minRow = _.min(DS.elements);
  const minVal = _.min(minRow);
  if (DS.max() === 0 & minVal === 0) { // exclui possibilidades para todos = 0;
    console.log('Não tem solução ÓTIMA');
    rel = 1; // sai do programa
  } else {
    for (let i = 1; i < m; i++) {
      if (xb.e(i) === 0 & DS.e(i) === 0) {
        AP[i - 1] = Infinity;
      } else {
        AP[i - 1] = - xb.e(i) / DS.e(i);
        if (AP[i - 1] == -Infinity || AP[i - 1] <= 0) {
          AP[i - 1] = Infinity;
        }
      }
    }
  }
  const minVal = _.min(AP.elements);
  const minIndex = _.findIndex(AP.elements, x => x === minVal);
  return { ind: minIndex, DS, AP };
}