export function epsilonRound(num, zeros = 4) {
    let temp = num;
    if (typeof num === 'string') {
      temp = parseFloat(num);
    }
    return (
      Math.round((temp + Number.EPSILON) * Math.pow(10, zeros)) /
      Math.pow(10, zeros)
    );
  }