const {
  eye,
  floor,
  inverse,
  diagonal,
  createMatrix,
} = require('./helpers');

module.exports = (L, l, d, type) => {
  const mid = eye(d.cols());
  const N = mid.col(2);
  const vL = floor(inverse(l).multiply(L));
  const B = diagonal(vL.elements);
  const A = B.augment(N);
  const b = createMatrix(d); 

  return { B, N, A, b };
}