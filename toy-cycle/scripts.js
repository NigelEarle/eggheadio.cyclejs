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

const labeledSlider = sources => {
  const props$ = sources.props;
  const actions = intent(sources.DOM);
  const state$ = model(actions, props$);
  const vDom$ = view(state$)
  return {
    DOM: vDom$
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
  const weightDOMSource = sources.DOM.select('.weight');
  const weightSinks = labeledSlider({
    ...sources,
    DOM: weightDOMSource,
    props: weightProps$ 
  });

  const weightVDOM$ = weightSinks.DOM.map(vdom => {
    vdom.sel += '.weight';
    return vdom;
  })
  
  const heightProps$ = xs.of({
    label: 'Height',
    unit: 'kg',
    min: 80,
    max: 140,
    init: 90
  });
  const heightDOMSource = sources.DOM.select('.height');
  
  const heightSinks = labeledSlider({ 
    ...sources,
    DOM: heightDOMSource,
    props: heightProps$ 
  })
  
  const heightVDOM$ = heightSinks.DOM.map(vdom => {
    vdom.sel += '.height';
    return vdom;
  });
  const vdom$ = xs.combine(weightVDOM$, heightVDOM$)
    .map(([weightVDOM, heightVDOM]) => (
      div([
        weightVDOM,
        heightVDOM
      ])
    ))
  return {
    DOM: vdom$
  }
}

run(main, {
  DOM: makeDOMDriver('#app')
});
