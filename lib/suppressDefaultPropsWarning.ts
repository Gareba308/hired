const error = console.error;
console.error = (...args) => {
  if (/defaultProps/.test(args[0])) return;
  error(...args);
};
// To hide the error in LineChart and BarChart till there is an update that will auto hide it