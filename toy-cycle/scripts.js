function main() {
  // Logic
  return {
    DOM: xs.periodic(1000) // stream every x ms
      .fold(prev => prev + 1, 0)
      .map(i => `Seconds elapsed: ${i}`),
    log: xs.periodic(2000)
      .fold(prev => prev + 1, 0)
  }
}

function domDriver(text$) {
  // Effects
  text$.subscribe({
    next: str => {
      document.querySelector('#app')
      .textContent = str
    }
  });
}

function logDriver(msg$) {
  msg$.subscribe({
    next: msg => {
      console.log(msg);
    }
  });
}

function run(mainFn, drivers) {
  const sinks = mainFn();
  Object.keys(drivers)
  .forEach(driver => {
    if (sinks[driver]) {
      drivers[driver](sinks[driver]);
    }
  });
}

run(main, {
  DOM: domDriver,
  log: logDriver
});
