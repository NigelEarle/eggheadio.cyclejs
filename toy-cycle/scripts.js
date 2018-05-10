import xs from 'xstream';
import fromEvent from 'xstream/extra/fromEvent';

const main = sources => {
  const click$ = sources.DOM;
  // Logic
  return {
    DOM: click$.startWith(null)
      .map(_ => (
        xs.periodic(1000) // stream every x ms
        .fold(prev => prev + 1, 0)
      ))
      .flatten()
      .map(i => `Seconds elapsed: ${i}`),
    log: xs.periodic(2000)
      .fold(prev => prev + 1, 0)
  }
}

// source = input effect - read
// sink = output effect - write

const domDriver = text$ => {
  // Effects
  text$.subscribe({
    next: str => {
      document.querySelector('#app')
      .textContent = str
    }
  });

  const domSource = fromEvent(document, 'click');
  return domSource;
}

const logDriver = msg$ => {
  msg$.subscribe({
    next: msg => {
      console.log(msg);
    }
  });
}

/*
Solution to circular dependency

fakeA = ...
b = f(fakeA)
a = g(b)
fakeA.behaveLike(a)
*/

const run = (mainFn, drivers) => {
  const fakeDOMsink = xs.create();
  const domSource = domDriver(fakeDOMsink);
  const sinks = mainFn({DOM: domSource})
  fakeDOMsink.imitate(sinks.DOM);
}

run(main, {
  DOM: domDriver,
  log: logDriver
});
