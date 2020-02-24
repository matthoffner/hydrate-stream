# hydrate-stream

An experimental batteries excluded stream transformer with a simple API for declaritively hydrating elements (like adding onclick handlers). 

The motivation behind this is to do server side rendering and selectively hydrating the interactive elements on a page. This is an experiment at building a minimal framework around streaming rendering.

```sh
npm install hydrate-stream
```

```js
import { hydrateStream } from 'hydrate-stream';

const hydrators = [{
    id: 'root',
    key: 'onload',
    value: `
        function loadJS() {
            console.log('script run on load');
        } 
        loadJS();
    `
}, {
    id: 'cta',
    key: 'onclick',
    value: `
        function minimalJS() {
            console.log('script run on click');
        }
        minimalJS();
    `
}];

renderToStaticNodeStream(<Component />).pipe(hydrateStream(hydrators))
```

Two basic use cases are `onclick` and `onload`. For `onload` a `<script>` tag is injected after the mapped element.

## Usage

See example directory

## Credits

* [himalaya](https://www.npmjs.com/package/himalaya)