function add(nums) {
  return nums.reduce((s, n) => s + n, 0);
}

function sub(nums) {
  if (nums.length === 0) return 0;
  return nums.slice(1).reduce((r, n) => r - n, nums[0]);
}

function mul(nums) {
  if (nums.length === 0) return 0;
  return nums.reduce((p, n) => p * n, 1);
}

function div(nums) {
  if (nums.length === 0) return NaN;
  return nums.slice(1).reduce((r, n) => {
    if (n === 0) throw new Error('Cannot divide by zero!');
    return r / n;
  }, nums[0]);
}

module.exports = { add, sub, mul, div };