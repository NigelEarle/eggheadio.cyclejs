import xs from 'xstream';
import { run } from '@cycle/run';
import {
  div,
  label,
  button,
  p,
  makeDOMDriver
} from '@cycle/dom';

// Logic
const main = sources => {
  const decClick$ = sources.DOM.select('.dec').events('click');
  const incClick$ = sources.DOM.select('.inc').events('click');

  const dec$ = decClick$.map(_ => - 1);
  const inc$ = incClick$.map(_ => + 1);

  const delta$ = xs.merge(dec$, inc$);
  const number$ = delta$.fold((prev, curr) => prev + curr, 0);

  return {
    DOM: number$.map(number => (
        div([
          button('.dec', 'Decrement'),
          button('.inc', 'Increment'),
          p([
            label(`Count: ${number}`)
          ])

        ])
      )
    )
  }
}

run(main, {
  DOM: makeDOMDriver('#app')
});
