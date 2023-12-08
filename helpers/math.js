const GreenMath = {
  gcd: (a, b) => {
    for (let i = b; b !== 0; ) {
      b = a % b;
      a = i;
      i = b;
    }
    return a;
  },
  lcm: (a, b) => (a * b) / GreenMath.gcd(a, b),
};
module.exports = { GreenMath };
