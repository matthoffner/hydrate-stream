import express from "express";
import React from "react";
import { renderToNodeStream } from "./react-dom-server.js";
import hydrateStream from './hydrate-stream.cjs';

const { PORT = 3000 } = process.env;
const app = express();

const hydrators = [{
    id: 'hydrateStream',
    key: 'onload',
    value: `function test() { console.log('test') } test();`
}];

app.use("/", (req, res) => {
    const component = React.createElement("h1", {
        id: 'hydrateStream'
    }, 'hydrate stream');
    res.type('html');
    const rendered = renderToNodeStream(component).pipe(hydrateStream(hydrators));
    rendered.pipe(res);
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
