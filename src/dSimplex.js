const {
  multiplyByMinusOne,
  createVector,
} = require('./helpers');
const _ = require('lodash');

// Calcula direção simplex
module.exports = (invB, vk, m, xb) => {
  const DS = multiplyByMinusOne(invB).multiply(createVector(vk));
  let AP = [];

  let minVal = _.min(DS.elements);
  const maxValue = _.max(DS.elements);
  if (maxValue === 0 & minVal === 0) { // exclui possibilidades para todos = 0;
    console.log('Não tem solução ÓTIMA');
    rel = 1; // sai do programa
  } else {
    for (let i = 1; i <= m; i++) {
      if (xb.e(i) === 0 & DS.e(i) === 0) {
        AP[i - 1] = Infinity;
      } else {
        AP[i - 1] = - xb.elements[i - 1][0] / DS.e(i);
        if (AP[i - 1] == -Infinity || AP[i - 1] <= 0) {
          AP[i - 1] = Infinity;
        }
      }
    }
  }
  minVal = _.min(AP);
  const minIndex = _.findIndex(AP, x => x === minVal); // ## INDEX
  return { ind: minIndex, DS, AP };
}