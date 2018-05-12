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

const intent = (domSource) => {
  const changeWeight$ = domSource.DOM.select('.weight').events('input')
    .map(ev => ev.target.value);
  const changeHeight$ = domSource.DOM.select('.height').events('input')
    .map(ev => ev.target.value);

  return {
    changeWeight$,
    changeHeight$
  }
};

const model = (actions) => {
  const { changeWeight$, changeHeight$ } = actions;
  return xs.combine(changeWeight$.startWith(230), changeHeight$.startWith(182))
    .map(([weight, height]) => {
      const heightMeters = height * 0.01;
      const bmi$ = Math.round(weight / (heightMeters * heightMeters));
      return { bmi: bmi$, weight, height };
    });
}

const view = (state$) => {
  return state$.map(state => (
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
  ));
}

const main = sources => {
  const actions = intent(sources);
  const state$ = model(actions);
  const vDom$ = view(state$)
  return {
    DOM: vDom$
  }
}

run(main, {
  DOM: makeDOMDriver('#app'),
  HTTP: makeHTTPDriver(),
});
