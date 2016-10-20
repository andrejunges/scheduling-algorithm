module.exports = (DS, invBElems, cb, m, ind) => {
  for (let j = 1; j <= m; j++) {
    // invB[ind - 1][j - 1] = (- 1 / (DS(cb(ind))) * invB(ind, j));
    const aux = cb.e(1, ind + 1); // ## INDEX IND
    invBElems[ind][j - 1] = -1 / DS.e(aux) * invBElems[ind][j - 1]; // ## INDEX IND
    for (let i = 1; i <= (ind + 1); i++) {
      if (i !== (ind + 1)) { // INDEX IND
        // invB(i, j) = invB(i, j) + (DS(cb(i)) * invB(ind, j));
        const aux1 = DS.e(cb.e(1, i)) * invBElems[ind][j - 1];
        invBElems[i - 1][j - 1] = invBElems[i - 1][j - 1] + aux1;
      }
    }
  }

  return invBElems;
}