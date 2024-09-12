const originalConsoleError = console.error;
console.error = (...args) => {
  const errorCodesToSuppress = [/Minified React error #425/, /Minified React error #418/, /Minified React error #423/];
  if (errorCodesToSuppress.some(regex => regex.test(args[0]))) {
    return;
  }
  originalConsoleError(...args);
};