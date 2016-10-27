// Verifica se todo vetor da mochila foi lido
module.exports = (icmz, sitElems) => {
  let temp = icmz;
  let fim;
  icmz = 0;
  while (icmz === 0) {
    if (sitElems[temp - 1] > 0) {
      icmz = temp; // ## INDICE
    }
    temp = temp - 1;
    if (temp === 0) icmz = 9999999999;
  }

  if (icmz === 9999999999) {
    fim = 1;
  } else {
    fim = 0;
  }

  return fim;
}