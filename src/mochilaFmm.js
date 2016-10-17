module.exports = (sitElems, L, dmoElems, fmax, icmz) => {
  // Calcula uma segunda opção de mochila
  sitElems[icmz - 1] = sitElems[icmz - 1] - 1; // ## INDICE
  let tm = 0;
  for (let i = 1; i <= icmz; i++) {
    tm = tm + sitElems[i - 1] * dmoElems[1][i - 1]; // ## INDICE
  }
  const divide = (L - tm) / (dmoElems[1][icmz]); // ## INDICE
  sitElems[icmz] = Math.floor(divide); // ## INDICE
  let aux = 0;
  for (let i = 1; i <= icmz; i++) {
    aux = aux + (dmoElems[0][i - 1] * sitElems[i - 1]);
  }
  // Compara o resultado com fmax: se > fmm=1 se < fmm=0
  const auxCond = dmoElems[0][icmz] * sitElems[icmz] + aux; // ## INDICE
  let fmm;
  if (auxCond > fmax) {
    fmm = 1;
  } else {
    fmm = 0
  }

  return { fmm, sitElems };
}

// function [fmm, sit] = Mochila_fmm(sit, L, dmo, fmax, icmz)
//   if (dmo(1, icmz + 1) * sit(icmz + 1) + aux) > fmax
//       fmm = 1;
//   else
//       fmm = 0;
//   end
// end