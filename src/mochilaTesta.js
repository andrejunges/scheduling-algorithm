module.exports = (dmoElems, mk, sit) => {
  let tm = 0; // Somatório do retorno
  for (let i = 1; i <= (mk - 1); i++) {
    tm = tm + dmoElems[0][i - 1] * sit[i - 1]; // multiplicação da 1a linha da dmo pela solução inicial da mochila
  }
  // retorno Máximo
  return { si: sit, fmax: tm };
}