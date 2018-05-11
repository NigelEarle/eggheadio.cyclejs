import xs from 'xstream';
import { run } from '@cycle/run';
import { makeHTTPDriver } from '@cycle/http';
import {
  div,
  label,
  input,
  h2,
  makeDOMDriver
} from '@cycle/dom';

// detect sliding event - READ
// recalculate BMI = w / h*h - LOGIC
// display BMI - WRITE

const main = sources => {
  const changeWeight$ = sources.DOM.select('.weight').events('input')
    .map(ev => ev.target.value);
  const changeHeight$ = sources.DOM.select('.height').events('input')
    .map(ev => ev.target.value);

  const state$ = xs.combine(changeWeight$.startWith(230), changeHeight$.startWith(182))
    .map(([weight, height]) => {
      const heightMeters = height * 0.01;
      const bmi$ = Math.round(weight / (heightMeters * heightMeters));
      return { bmi: bmi$, weight, height };
    })

  const vDom$ = state$.map(state => (
      div([
        div([
          label(`Weight: ${state.weight}kg`),
          input('.weight', {attrs: {type: 'range', min: 40, max: 150, value: 400}})
        ]),
        div([
          label(`Height: ${state.height}cm`),
          input('.height', {attrs:{ type: 'range', min: 150, max: 220, value: 400}})
        ]),
        h2(`BMI is ${state.bmi}`)
      ])
    )
  )
  return {
    DOM: vDom$
  }
}

run(main, {
  DOM: makeDOMDriver('#app'),
  HTTP: makeHTTPDriver(),
});
