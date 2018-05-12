import xs from 'xstream';
import { run } from '@cycle/run';
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
  const changeValue$ = domSource.select('.slider').events('input')
    .map(ev => ev.target.value);

  return { changeValue$ }
};

const model = (actions, props$) => {
  const { changeValue$ } = actions;
  return props$.map(props => {
    return changeValue$.startWith(props.init)
    .map(value => {
      return {
        value: value,
        label: props.label,
        unit: props.unit,
        max: props.max,
        min: props.min
      }
    })
  }).flatten();
}

const view = (state$) => {
  return state$.map(state => (
    div([
      div([
        label('.label', `${state.label}: ${state.value}${state.unit}`),
        input('.slider', {attrs: {type: 'range', min: state.min, max: state.max, value: state.value}})
      ]),
    ])
  ));
}

const main = sources => {
  const props$ = sources.props;
  const actions = intent(sources.DOM);
  const state$ = model(actions, props$);
  const vDom$ = view(state$)
  return {
    DOM: vDom$
  }
}

run(main, {
  DOM: makeDOMDriver('#app'),
  props: () => xs.of({
    label: 'Height',
    unit: 'cm',
    min: 40,
    max: 140,
    init: 40
  })
});
