import xs from 'xstream';
import { run } from '@cycle/run';
import { makeHTTPDriver } from '@cycle/http';
import {
  div,
  label,
  button,
  p,
  h1,
  h4,
  a,
  makeDOMDriver
} from '@cycle/dom';

// button clicked READ
// request sent WRITE
// response recieved READ
// data displayed WRITE

const main = sources => {
  const click$ = sources.DOM.select('.get-first').events('click');
  const request$ = click$.map(event => {
    return {
      url: 'http://jsonplaceholder.typicode.com/users/1',
      method: 'GET',
      category: 'user-data'
    }
  })

  const response$ = sources.HTTP.select('user-data').flatten().map(res => res.body);

  const vDom$ = response$.startWith({}).map(response => (
    div([
      button('.get-first', 'Get first user'),
      div('.user-details', [
        h1('.user-name', response.name),
        h4('.user-email', response.email),
        a('.user-website', {attrs: {href: response.website}}, response.website)
      ])
    ])
  ));

  return {
    DOM: vDom$,
    HTTP: request$
  }
}

run(main, {
  DOM: makeDOMDriver('#app'),
  HTTP: makeHTTPDriver(),
});
