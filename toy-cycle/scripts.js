import xs from 'xstream';
import fromEvent from 'xstream/extra/fromEvent';
import { run } from '@cycle/run';

// Logic
const main = sources => {
  const click$ = sources.DOM;
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

// Effects
const domDriver = text$ => {
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

// const run = (mainFn, drivers) => {
//   const fakeSinks = {}

//   Object.keys(fakeSinks).forEach(sink => {
//     fakeSinks[sink] = xs.create();
//   })

//   const sources = {};

//   Object.keys(drivers).forEach(driver => {
//     sources[driver] = drivers[driver](fakeSinks[driver])
//   })

//   const sinks = mainFn(sources);

//   Object.keys(sinks).forEach(key => {
//     fakeSinks[key].imitate(sinks[key])
//   })
// }

run(main, {
  DOM: domDriver,
  log: logDriver
});
