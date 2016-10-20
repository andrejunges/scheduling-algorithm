const _ = require('lodash');
const {
  log,
  print,
  findIndexes,
  linspace,
  rowsToColumns,
  columnsToRows,
  createVector,
  createMatrix,
  random,
  diagonal,
  eye,
  ones,
  zeros,
  incremental,
  sortrows,
  divisionByFloat,
  floor,
  inverse,
  addVector,
  sortWithIndeces,
} = require('./helpers');
console.log(sortWithIndeces, 11);

// Função mochila - retorna a solução inicial com o somatório do setup
module.exports = (L, N, l, cn, cb, vm, ST, m, vpidx, vp, iteracao) => {
  // Montagem de dm
  const Nm = [N.e(1), N.e(2), N.e(3)];
  let dm = createMatrix([vm.elements[0], l.elements, cb.elements[0]]); // Dados da mochila dm (1a linha vm e 2a linha cortes) e com cb na 3a linha
  dm = dm.augment(Nm); // Concat dm com enésima coluna: folga (N)
  let dmElems = dm.elements;
  const { rows: nk, cols: mk } = dm.dimensions();
  dmElems[nk - 1][mk - 1] = cn; // Dados da mochila inserido o coef não basica
  dm = createMatrix(dmElems);
  console.log('\nDados da Mochila');
  log(dm);
  // Cálculo da mochila ordenada
  let divElements = zeros(1, mk - 1).elements; // Vetor com zeros
  for (let i = 1; i <= (mk - 1); i++) {
    divElements[0][i - 1] = dm.e(1, i) / dm.e(2, i); // Divisão dos elementos da 1a com a 2a linhas
  }
  const res = sortWithIndeces(divElements[0]); // res = Ordenação da divisão , idx = ordenação do índice do </>
  const idx = res.sortIndices.map(x => x + 1); // ## INDICE
  const xres = [].concat(res).reverse(); // Inversão da ordenação do res
  const xidx = [].concat(idx).reverse(); // Inversão da ordenação dos índices

  let dmoElems = [];
  for (let i = 1; i <= (mk - 1); i++) {
    const vals = dm.col(xidx[i - 1]);
    dmoElems.setColumn(vals.elements, i - 1); // Montagem de dmo
  }
  dmoElems.setColumn(dm.col(mk).elements, mk - 1); // Mochila Ordenada
  console.log('Mochila Ordenada');
  console.log(dmoElems);

  // Roerdena
  const vpok = vp.row(vpidx[iteracao - 1]); // Sequência escolhida
  console.log(`\nIteração Número: ${iteracao} \n`);
  console.log(`Índice do arranjo na matriz não ordenada (vp): ${vpidx[iteracao]} \n`);
  console.log('Arranjo escolhido:')
  log(vpok);
  console.log('--------------------------------------\n\n')

  let dmroElements = _.cloneDeep(dmoElems);
  const vpokLength = vpok.cols();
  for (let i = 1; i <= vpokLength; i++) {
    const zi = _.findIndex(dmoElems[2], x => x === vpok.e(i));
    dmroElements.setColumn(dmoElems.getColumn(zi), i - 1);
  }
  console.log('Dmo reordenado')
  console.log(dmroElements);

  // Setup
  for (let i = 1; i <= (mk - 2); i++) {
    const s1 = dmroElements[2][i - 1]; // ## INDICE
    const s2 = dmroElements[2][i]; // ## INDICE
    dmroElements[1][i] = dmroElements[1][i] + ST.e(s1, s2);
  }

  console.log('\n\nMochila com SETUP');
  console.log(dmroElements);

  // si = Solução Inicial
  dmoElems = dmroElements;
  let aux = L;
  const siElems = zeros(1, mk).elements;
  for (let i = 1; i <= mk; i++) { // Montagem do vetor
    siElems[i - 1] = Math.floor(aux / dmoElems[1][i - 1]);
    aux = aux - siElems[i - 1] * dmoElems[1][i - 1];
  }
  const fmax = 0; // Retorno máximo da mochila
  const sitElems = [].concat(siElems);
  // Solução Inicial (vetor de trabalho)

  return { dmoElems, mk, siElems, sitElems, vpok };
}