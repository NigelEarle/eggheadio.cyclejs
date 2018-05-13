import xs from 'xstream';
import { run } from '@cycle/run';
import {
  div,
  label,
  input,
  h2,
  makeDOMDriver
} from '@cycle/dom';
import isolate from '@cycle/isolate';

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
  }).flatten().remember();
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

const labeledSlider = sources => {
  const props$ = sources.props;
  const actions = intent(sources.DOM);
  const state$ = model(actions, props$);
  const vDom$ = view(state$)
  return {
    DOM: vDom$,
    value: state$.map(state => state.value)
  }
}

const main = (sources) => {

  const weightProps$ = xs.of({
    label: 'Weight',
    unit: 'cm',
    min: 40,
    max: 140,
    init: 40
  });
  const weightSlider = isolate(labeledSlider, '.weight');
  const weightSinks = weightSlider({
    ...sources,
    props: weightProps$ 
  });

  const heightProps$ = xs.of({
    label: 'Height',
    unit: 'kg',
    min: 80,
    max: 140,
    init: 90
  });
  const heightSlider = isolate(labeledSlider, '.height');
  const heightSinks = heightSlider({ 
    ...sources,
    props: heightProps$ 
  })

  const bmi$ = xs.combine(weightSinks.value, heightSinks.value)
    .map(([weight, height]) => {
      const heightMeters = height * 0.01;
      const bmi = Math.round(weight / (heightMeters * heightMeters));
      return bmi;
    });

  const vdom$ = xs.combine(bmi$, weightSinks.DOM, heightSinks.DOM)
    .map(([bmi, weightVDOM, heightVDOM]) => (
      div([
        weightVDOM,
        heightVDOM,
        h2(`BMI: ${bmi}`)
      ])
    ))
  return {
    DOM: vdom$
  }
}

run(main, {
  DOM: makeDOMDriver('#app')
});
