const {
  inverse,
  rowsToColumns,
  columnsToRows,
  createMatrix,
  findNonZerosIndexes,
} = require('./helpers');

const multiplierHelper = (rows, cols) => {
  const elems = [];
  for (let i = 0; i < rows.length; i++) {
    const val = rows[i] * cols[i];
    elems.push(val);
  }

  return elems;
}

module.exports = (xb, invB, l, L, b, d, iteracao) => {
  const r_final = [];
  const soma_linha = [];
  const soma_coluna = [];
  const pcorte = inverse(invB);
  const { rows: mcorte, cols: ncorte } = pcorte.dimensions();
  const lcorte = rowsToColumns(l.elements); // l.';
  // log(lcorte);

  console.log(`O horizonte de planejamento é: ${L} horas.\n`);
  console.log('Solução Gerada')
  console.log('===================================================================== ')

  const solucao = xb.elements;
  for (let f = 1; f <= solucao.length; f++) {
    const aux = pcorte.col(f).multiply(solucao[f - 1][0]); // ## INDICE
    r_final.setColumn(aux.elements, f - 1);
  }

  for (let f = 1; f <= r_final.length; f++) {
    const aux = r_final[f - 1].sum();
    soma_linha.push(aux);
  }

  for (let f = 1; f <= r_final.length; f++) {
    const aux = L - multiplierHelper(l.elements, pcorte.col(f).elements).sum();
    soma_coluna.push(aux);
  }

  console.log(r_final, 'r_final');
  console.log(soma_linha, 'soma_linha');
  console.log(soma_coluna, 'soma_coluna');

  let sobra = [].concat(soma_coluna);
  console.log(`Número de Iterações: ${iteracao} \n\n`);
  console.log('Relatório Final');
  console.log('===================================================================== ');

  const len = l.cols();
  for (let i = 1; i <= len; i++) {
    const time_find = findNonZerosIndexes(pcorte.col(i).elements).map(x => x + 1);
    let logMessage = `A linha ${i}`;
    let multi = 0;
    for (let j = 1; j <= time_find.length; j++) {
      if (solucao[i - 1][0] > 0) {
        const auxOne = pcorte.e(time_find[j - 1], i);
        multi = multi + auxOne * l.e(time_find[j - 1], 1);
        logMessage += ` produziu ${auxOne} lote(s) do produto ${time_find[j - 1]},`;
      } else {
        logMessage += ' não foi utilizada';
        sobra[i] = 0;
      }
    }
    if (solucao[i - 1][0] > 0) {
      logMessage += ` em ${multi} hora(s) `;
      logMessage += `com uma perda de ${L - multi} hora(s).\n`;
    } else {
      logMessage += '\n';
    }

    console.log(logMessage);
  }

  console.log('===================================================================== ');
  let perda = ((sobra.sum() / (L * l.cols())) * 100);
  console.log(`O percentual de perda será de: ${perda}% \n`);
  console.log('===================================================================== ');
  console.log('Para atender a demanda: \n');
  for (let i = 1; i <= l.cols(); i++) {
    console.log(`A linha ${i} --> Repetir a programação ${solucao[i - 1]} vezes. \n`);
  }
  console.log('===================================================================== ');
  // soma_linha = [0; soma_linha; 0];
  // elinho = [0; l.'; 0];
  // maximus = [solucao; pcorte; sobra];
  // maximus = [elinho maximus soma_linha];
  // console.log(maximus);
  console.log('===================================================================== ');
}
