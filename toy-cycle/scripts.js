function main() {
  // Logic
  return xs.periodic(1000) // stream every x ms
    .fold(prev => prev + 1, 0)
    .map(i => `Seconds elapsed: ${i}`)
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

const sink = main();
domDriver(sink);
logDriver(sink)
