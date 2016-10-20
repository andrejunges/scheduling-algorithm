const _ = require('lodash');
const mochila = require('./mochila');
const montaMatriz = require('./montaMatriz');
const mochilaTesta = require('./mochilaTesta');
const mochilaCmz = require('./mochilaCmz');
const mochilaFmm = require('./mochilaFmm');
const mochilaFinal = require('./mochilaFinal');
const relatorio = require('./relatorio');
const dSimplex = require('./dSimplex');
const atualiza = require('./atualiza');
const {
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
  addVector,
  multiplyRowsPerColumns,
} = require('./helpers');

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
  let num = (m_ones.subtract(m_eye)).multiply(rnd_a);

  print('Matriz Setup', num);

  // -----------------------------------------------------------
  // Atribuições
  num = createMatrix([
    [0, 0.0747, 0.4844, 0.4902, 0.4730],
    [0.1095, 0, 0.2159, 0.0451, 0.0393],
    [0.3767, 0.5000, 0, 0.4866, 0.4788],
    [0.3381, 0.1529, 0.1571, 0, 0.1220],
    [0.2857, 0.0271, 0.4709, 0.4037, 0]
  ]);
  // log(num);
  let ST = num;
  const type = 1;
  const iteracao = 1;
  const limite = 3000;
  let rel = 0;
  let xb_aux = [];


  // -----------------------------------------------------------
  // Passo 2 - Montagem da Matriz A
  const { B, N, A, b } = montaMatriz(L, l, d, type);

  let invB = inverse(B);
  const { rows: n, cols: m } = B.dimensions();
  let vk = zeros(1, m);


  // -----------------------------------------------------------
  // Passo 3 - Identificar vetores de índice e coef de f(x)
  const cn = m + 1;
  const cb = incremental(1, m);
  const cf = ones(1, m);

  // Clark & Wright
  let monta_par = 0;
  let matrix_sort;
  const v_work = []; // Matriz de trabalho para montagem das sequências 
  let final = []; // Matriz final com as sequência
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
  matrix_sort = createMatrix(sortrows(temp_sort_elements, 0)); // Ordena do menor para o maior baseado na primeira coluna

  let confere = matrix_sort;
  let duo = zeros((m_mt - 1), 3);
  let duoElements = duo.elements;

  const len = matrix_sort.rows();
  for (let i = 1; i <= len; i++) {
    let v_work = matrix_sort.row(i); // arranjo
    let v_work_elems = v_work.elements;
    let entrada = createVector([v_work.e(2)]);
    let saida = v_work.e(3);

    for (let t = 1; t <= (m_mt - 2); t++) {
      const matrixCol = matrix_sort.col(2).elements;
      const busca = findIndexes(matrixCol, x => x === saida);

      for (let j = 1; j <= (m_mt - 1); j++) {
        duoElements.set(matrix_sort.row(busca.get(j) + 1).elements, j); // CUIDAR INDICES ###
      }

      let duoMatrix = createMatrix(duoElements);
      // log(duoMatrix);

      const cols = entrada.cols();
      for (let j = 1; j <= cols; j++) {
        const duoCol = duoMatrix.col(3).elements;
        const kill = findIndexes(duoCol, x => x === entrada.e(j)); // INDICE ##
        
        // duoElements[kill] = [];
        duoElements.splice(kill, 1); // INDICE ##
        duoMatrix = createMatrix(duoElements);
      }

      saida = duoElements.get(1).get(3); // 1 3 - INDICE ##
      entrada = addVector(entrada, duoElements.get(1).get(2)); // 1, 2 - INDICE ##
      if (t === 1) {
        v_work_elems = [v_work_elems, duoElements.get(1)]; 
      } else {
        v_work_elems = [...v_work_elems, duoElements.get(1)];
      }
      duoElements = zeros((m_mt - 1), 3).elements;
      // busca = []; // why?
    }

    const v_work_matrix = createMatrix(v_work_elems);
    const soma = v_work_matrix.col(1).elements.sum();
    const aux = v_work_matrix.e(v_work_matrix.rows(), 3);
    let semi_final = [...v_work_matrix.col(2).elements, aux];
    semi_final.push(soma);
    final.push(semi_final);
  }

  let final_sort = createMatrix(sortrows(final, final[0].length - 1)); // nro de colunas
  final_sort = final_sort.minor(1, 1, final_sort.rows(), final_sort.cols() - 1);
  log(final_sort);

  // -----------------------------------------------------------
  // Reordena
  console.log(`\n\nInício - ${new Date()}\n`);
  
  const v = linspace(1, m); // Vetor inicial de 1 até m
  let vp = final_sort;
  let vpElems = final_sort.elements;
  const { rows: nvp, cols: mvp } = vp.dimensions();
  let vpaElems = zeros(1, mvp - 1).elements; // Base para somatório
  let vpxElems = zeros(nvp, 1).elements; // Armazenamento do resultado

  for (let i = 1; i <= nvp; i++) {
    for (let j = 1; j <= (mvp - 1); j++) {
      if (!vpaElems[j - 1]) vpaElems[j - 1] = zeros(1, mvp - 1).elements;

      vpaElems[j - 1][i - 1] = ST.e(vpElems[i - 1][j - 1], vp.e(i, j + 1)); // Arranjo para soma end
    }
    vpxElems[i - 1] = createMatrix(vpaElems).col(i).elements.sum(); // Matriz com os somatórios
  }
  const vpidx = linspace(1, nvp) // DOUBLE CHECK
  let xb;
  let kkElems = [];
  let vkElems = [];

  for (let k = 1; k <= limite; k++) { // Loop para iteração
    if (rel === 0) {
      // console.log(`Iteração - ${k}`);

      // -----------------------------------------------------------
      // Passo 4 - Calcular a Solução Básica

      xb = invB.multiply(b); // xb recebe a solução básica
      const minValue = _.min(xb.elements);
      if (minValue < 0) { // Testa a solução básica (se < 0 FIM com nova entrada)
        console.log('xb não respeitou a condição de não negatividade!');
        xb = xb_aux;
        k -= 1;
        const { pcorte, lcorte, mcorte, ncorte } = relatorio(xb, invB, l, L, b, d, k);
        rel = 1;
        console.log(new Date());
        console.log('Tempo gasto no cálculo');
        break
      }

      // -----------------------------------------------------------
      // Passo 5 - Vetor Multiplicador Simplex
      const vm = cf.multiply(invB); // coef f(x) * inversa de B

      // -----------------------------------------------------------
      // Passo 6 - Cálculo de vk (vetor da mochila "knapsack")
      let { dmoElems, mk, siElems, sitElems, vpok } = mochila(L, N, l, cn, cb, vm, ST, m, vpidx, vp, k);

      // Retornou a solução Inicial
      let fim = 0;
      let fmax = 0;

      while (fim === 0) {
        let { fmax: _fmax, si: _si } = mochilaTesta(dmoElems, mk, sitElems); // Calcula o retorno si
        console.log(k, '<<<<<<<<<<<<<<<<<<')
        siElems = _si;
        fmax = _fmax;
        let icmz = mochilaCmz(sitElems, mk); // Encontra primeiro coef > 0

        let fmm = 0;
        let { fmm: _fmm, sitElems: _sitElems } = mochilaFmm(sitElems, L, dmoElems, fmax, icmz);
        sitElems = _sitElems;
        fmm = _fmm;
        icmz = mochilaCmz(sitElems, mk); // Encontra o próximo coef > 0

        if (fmm === 0) {
          fim = mochilaFinal(icmz, sitElems); // Verifica se há outras posições no vetor
        } else {
          let aux = 0;
          for (let i = 1; i <= icmz; i++) {
            aux = aux + (sitElems[i - 1] * dmoElems[1][i - 1]); // ## INDICE
          }
          sitElems[icmz] = Math.floor(L - aux) / dmoElems[1][icmz]; // ## INDICE
          aux = 0;
          for (let i = 1; i <= (mk - 1); i++) { // Trocou o dmo para teste
            aux = aux + (sitElems[i - 1] * dmoElems[1][i - 1]); // ## INDICE
          }
          sitElems[mk - 2] = Math.floor(L - aux) / dmoElems[1][mk - 2]; // ## INDICE
          fim = 1;
        }
      }

      for (let i = 1; i <= mk; i++) { // Vetor da Mochila
        const colAux = dmoElems[2][i - 1]; // ## INDICE
        const valAux = siElems[i - 1]; // ## INDICE
        kkElems.setColumn([valAux], colAux); 
      }
      for (let i = 1; i <= (mk - 1); i++) {
        vkElems[i - 1] = kkElems[0][i]; // ## INDICE ## DOUBLE ATTENTION
      }
      // vkElems = rowsToColumns(vkElems);
      let crel = dmoElems[1][mk - 1] - multiplyRowsPerColumns(vm.elements, vkElems); // ## INDICE

      if (crel < 0 && Math.abs(crel) > Number.EPSILON) {
        const { ind, DS, AP } = dSimplex(invB, vkElems, m, xb);
        console.log('A coluna que sai é X ${ind} \n\n');
        console.log('Nova invB');

        let invBElems = invB.elements;
        invBElems = atualiza(DS, invBElems, cb, m, ind);
        invB = createMatrix(invBElems);

        log(invB);
      } else {
        relatorio(xb, invB, l, L, b, d, k); // %m, cf,
        // beep
        rel = 1;
        // toc
      }
    }

    // vk = vk.';
    vk = zeros(1, m);
    xb_aux = xb;
  }
}

const L = 24;
const d = createVector([26, 8, 12, 4, 2]);
const l = createVector([2, 3, 4, 6, 9]);
const set_max = 0.4;

algorithm(L, d, l, set_max);