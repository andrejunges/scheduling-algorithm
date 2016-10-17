module.exports = (sit, mk) => {
  let icmz = 0;
  let i = mk - 1;

  while (icmz === 0) {
    if (sit[i - 1] > 0) {
      icmz = i;
    }
    if (i > 1) {
      i = i - 1;
    }
  }

  return icmz;
}