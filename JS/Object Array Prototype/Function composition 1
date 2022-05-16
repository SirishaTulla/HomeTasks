function compose() {
  // Your solution
  let args = arguments;
  return function (val) {
    let n = args.length;
    if (n == 0) return val;
    let result = args[n - 1](val);
    for (let i = n - 2; i >= 0; i--) {
      result = args[i](result);
    }
    return result;
  };
}
