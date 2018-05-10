import xs from 'xstream';
import fromEvent from 'xstream/extra/fromEvent';
import { run } from '@cycle/run';


const h1 = children => (
  {
    tagName: 'H1',
    children
  }
);

const span = children => (
  {
    tagName: 'SPAN',
    children
  }
);

// Logic
const main = sources => {
  const mouseover$ = sources.DOM.selectEvents('span', 'mouseover');
  return {
    DOM: mouseover$.startWith(null)
      .map(_ => (
        xs.periodic(1000) // stream every x ms
        .fold(prev => prev + 1, 0)
      ))
      .flatten()
      .map(i => (
        h1([
          span([
            `Seconds elapsed: ${i}`
          ])
        ])
      )),
    log: xs.periodic(2000)
      .fold(prev => prev + 1, 0)
  }
}

// source = input effect - read
// sink = output effect - write

// Effects
const domDriver = obj$ => {
  const createElement = object => {
    const element = document.createElement(object.tagName);
    object.children.forEach(child => {
      if (typeof child === 'object') {
        element.appendChild(createElement(child));
      } else {
        element.textContent = child;
      }
    })
    return element;
  }

  obj$.subscribe({
    next: obj => {
      const container = document.querySelector('#app')
      const element = createElement(obj);
      container.textContent = '';
      container.appendChild(element);
    }
  });

  const domSource = {
    selectEvents(tagName, eventType) {
      return fromEvent(document, eventType)
        .filter(ev => ev.target.tagName === tagName.toUpperCase());
    }
  }
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

run(main, {
  DOM: domDriver,
  log: logDriver
});
