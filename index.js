const _ = require('lodash');
const sylv = require('sylvester');

const matrix = sylv.Matrix;
const vector = sylv.Vector;

// console.log(sylvester.Matrix, 1);

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

const create = elements => matrix.create(elements);
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

  return matrix.create(elements);
}
const sortrows = (matrix, indice) => matrix.sort((a, b) => a[indice] - b[indice]);
const divisionByFloat = (matrixA, float) => matrixA.map(x => x / float);

const floor = matrixOrVector => matrixOrVector.map(x => parseInt(x));
const inverse = matrixOrVector => matrixOrVector.map(x => x === 0 ? 0 : Math.pow(x, -1));

function algorithm(L, d, l, set_max) {
  const aux = 48 / (1 / L);

  let rnd_a = random(l.cols());
  rnd_a = rnd_a.multiply(aux)
  const rnd_c = rnd_a.max();

  let cut_set;
  if (rnd_c > set_max) {
    cut_set = rnd_c / set_max;
  }

  rnd_a = divisionByFloat(rnd_a, cut_set);
  const m_ones = ones(l.cols());
  const m_eye = eye(l.cols());
  const num = (m_ones.subtract(m_eye)).multiply(rnd_a);

  print('Matriz Setup', num);

  // -----------------------------------------------------------
  // Atribuições
  const ST = num;
  const type = 1;
  const iteracao = 1;
  const limite = 3000;
  const rel = 0;
  const xb_aux = [];


  // -----------------------------------------------------------
  // Passo 2 - Montagem da Matriz A
  const { B, N, A, b } = montaMatriz(L, l, d, type);

  const invB = inverse(B);
  const { rows: n, cols: m } = B.dimensions();
  const vk = zeros(1, m);


  // -----------------------------------------------------------
  // Passo 3 - Identificar vetores de índice e coef de f(x)
  const cn = m + 1;
  const cb = incremental(1, m);
  const cf = ones(1, m);

  // Clark & Wright
  let monta_par = 0;
  let matrix_sort;
  const v_work = []; // Matriz de trabalho para montagem das sequências 
  const final = []; // Matriz final com as sequência
  const pula = 0; // Flag para apagar repetido espelhado
  const matrix_tempos = num;
  const { rows: m_mt, cols: n_mt } = matrix_tempos.dimensions(); // Carregada m da matriz tempo e n da matriz tempo
  const matrix_decide = zeros(m_mt, 3); // Monta entrada e saída 
  let temp_sort = zeros(m_mt, 3); // Transforma matriz em vetor

  const temp_sort_elements = temp_sort.elements; // INDICE 0
  for (let i = 1; i <= m_mt; i++) {
    for (let j = 1; j <= n_mt; j++) {
      if (i !== j) {
        if (!temp_sort_elements[monta_par]) temp_sort_elements[monta_par] = zeros(1, 3).elements;
        temp_sort_elements[monta_par][0] = matrix_tempos.e(i, j);
        temp_sort_elements[monta_par][1] = i;
        temp_sort_elements[monta_par][2] = j;
        monta_par = monta_par + 1;
      }
    }
  }
  matrix_sort = create(sortrows(temp_sort_elements, 0)); // Ordena do menor para o maior baseado na primeira coluna


  let confere = matrix_sort;
  let duo = zeros((m_mt - 1), 3);
  let duoElements = duo.elements;

  const len = matrix_sort.rows();
  for (let i = 1; i <= len; i++) {
    const v_work = matrix_sort.row(i); // arranjo
    let entrada = vector.create([v_work.e(2)]);
    let saida = v_work.e(3);

    for (let t = 1; t <= (m_mt - 2); t++) {
      const matrixCol = matrix_sort.col(2).elements;
      const busca = findIndexes(matrixCol, x => x === saida);

      for (let j = 1; j <= (m_mt - 1); j++) {
        duoElements[j] = matrix_sort.row(busca[j - 1] + 1); // CUIDAR INDICES ###
      }

      const cols = entrada.cols();
      for (let j = 1; j <= cols; j++) {
        const duoCol = duoElements[2];
        const kill = findIndexes(duoCol, x => x === entrada.col(j));
        duoElements[kill] = [];
      }

      saida = duoElements[0][2]; // 1 3 - INDICE ##
      entrada = [entrada duo(1, 2)];
    }
  }

  //         entrada = [entrada duo(1, 2)];
  //         v_work = [v_work; (duo(1, :))];
  //         duo = zeros((m_mt - 1), 3);
  //         busca = [];
  //     end
  //     soma = sum(v_work(:, 1));
  //     semi_final = [v_work(:, 2); v_work(size(v_work, 1), 3)].'; 
  //     semi_final=[semi_final soma];
  //     final = [final; semi_final];
  // end

  // tic

  // log(temp_sort)
  
}


function montaMatriz(L, l, d, type) {
  const mid = eye(d.cols());
  const N = mid.col(2);
  const vL = floor(inverse(l).multiply(L));
  const B = diagonal(vL.elements);
  const A = B.augment(N);
  const b = create(d); 

  return { B, N, A, b };
}





const L = 24;
const d = vector.create([26, 8, 12, 4, 2]);
const l = vector.create([2, 3, 4, 6, 9]);
const set_max = 0.4;

algorithm(L, d, l, set_max);