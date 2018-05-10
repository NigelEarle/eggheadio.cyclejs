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

const sinks = main();

domDriver(sinks.DOM);
logDriver(sinks.log);
