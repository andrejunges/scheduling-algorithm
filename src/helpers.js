const _ = require('lodash');
const sylv = require('sylvester');

const matrix = sylv.Matrix;
const vector = sylv.Vector;

const sortWithIndeces = (toSort) => {
  for (let i = 0; i < toSort.length; i++) {
    toSort[i] = [toSort[i], i];
  }
  toSort.sort(function(left, right) {
    return left[0] <= right[0] ? -1 : 1;
  });
  toSort.sortIndices = [];
  for (let j = 0; j < toSort.length; j++) {
    toSort.sortIndices.push(toSort[j][1]);
    toSort[j] = toSort[j][0];
  }
  return toSort;
}

const logMatriz = (matriz) => {
  for (let i = 0; i < matriz.length; i++) {
    for (let j = 0; j < matriz[i].length; j++) {
      console.log(matriz[i][j] + '   ');
    }
    console.log('\n');
  }
}
const log = matrix => console.log(matrix.inspect());
const print = (title, matrix) => {
  console.log('\n\n------------------------------------------------------------------------------------------');
  console.log(title);
  console.log('--------------');
  log(matrix);
  console.log('------------------------------------------------------------------------------------------\n\n');
}

const findIndexes = (elements, predicate) => {
  const indexes = [];
  for (let i = 0; i < elements.length; i++) {
    if (predicate(elements[i])) {
      indexes.push(i);
    }
  }

  return indexes;
}

const linspace = (initial, end) => {
  const elems = [];
  for (let i = initial; i <= end; i++) {
    elems.push(i);
  }

  return elems;
}

const multiplyRowsPerColumns = (rows, cols) => {
  let val = 0;
  let r = Array.isArray(rows[0]) ? rows[0] : rows;
  for (let i = 0; i < r.length; i++) {
    val += r[i] * cols[i];
  }

  return val;
}

const findNonZerosIndexes = (array) => {
  const idxs = [];
  for (var i = 0; i < array.length; i++) {
    if (array[i] > 0) {
      idxs.push(i);
    }
  }

  return idxs;
}

const rowsToColumns = (rows) => matrix.create(rows.map(x => [x]));
const columnsToRows = (columns) => matrix.create(columns.map(x => [x]));
const createVector = elements => vector.create(elements);
const createMatrix = elements => matrix.create(elements);
const random = len => matrix.Random(len);
const diagonal = elements => matrix.Diagonal(elements);
const eye = len => matrix.I(len);
const ones = (rows, columns) => matrix.Zero(rows, columns || rows).map(x => 1);
const zeros = (rows, columns) => matrix.Zero(rows, columns || rows);
const incremental = (nRows, nColumns) => {
  const elements = [];
  for (let i = 0; i < nRows; i++) {
    const rowElements = [];
    for (let j = 0; j < nColumns; j++) {
      rowElements.push((i * nColumns) + (j + 1));
    }
    elements.push(rowElements);
  }

  return createMatrix(elements);
}
const sortrows = (matrix, indice) => matrix.sort((a, b) => a[indice] - b[indice]);
const divisionByFloat = (matrixA, float) => matrixA.map(x => x / float);

const floor = matrixOrVector => matrixOrVector.map(x => parseInt(x));
const inverse = matrixOrVector => matrixOrVector.map(x => x === 0 ? 0 : Math.pow(x, -1));
const multiplyByMinusOne = matrixOrVector => matrixOrVector.map(x => x * -1);
const addVector = (v, value) => createVector([...v.elements, value]);

Array.prototype.get = function (i) {
  return this[i - 1];
}

Array.prototype.set = function (val, i) {
  return this[i - 1] = val;
}

Array.prototype.sum = function() {
  return this.reduce((pValue, cValue, index) => (pValue || 0) + cValue);
}

Array.prototype.getColumn = function(index) {
  const elems = [];
  for (let i = 0; i < this.length; i++) {
    elems.push(this[i][index]);
  }

  return elems;
}

Array.prototype.setColumn = function(values, index) {
  for (let i = 0; i < values.length; i++) {
    if (!this[i]) this[i] = [];

    this[i][index] = values[i];
  }
}

module.exports = {
  log,
  logMatriz,
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
  multiplyByMinusOne,
  addVector,
  sortWithIndeces,
  multiplyRowsPerColumns,
  findNonZerosIndexes,
}