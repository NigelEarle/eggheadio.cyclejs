import xs from 'xstream';
import { run } from '@cycle/run';
import {
  div,
  label,
  input,
  hr,
  h1,
  makeDOMDriver
} from '@cycle/dom';

// Logic
const main = sources => {
  const inputEv$ = sources.DOM.select('.field').events('input');
  const name$ = inputEv$.map(ev => ev.target.value).startWith('');

  return {
    DOM: name$.map(name =>
      div ([
        label(['Name']),
        input('.field', {
          attrs: {
            type: 'text'
          }
        }),
        hr(),
        h1(`Hello ${name}!`)
      ])
    )
  }
}

run(main, {
  DOM: makeDOMDriver('#app')
});
