import stream from 'stream';
import { parse, stringify } from 'himalaya';
import { isArray } from 'lodash';

const appendHandler = (html, handlers) => {
    isArray(html.attributes) &&
        Object.values(html.attributes).forEach(attr => {
            Object.values(handlers).forEach(handler => {
                if (handler.id === attr.value) {
                    html.attributes.push({
                        key: handler.key,
                        value: handler.value
                    });
                }
            });
        });
};

const hydrate = ({ chunk, handlers }) => {
    const htmlObject = parse(chunk.toString());
    Object.keys(htmlObject).forEach(element => {
        appendHandler(htmlObject[element], handlers);
    });

    return [stringify(htmlObject)];
};

export const hydrateStream = handlers =>
    new stream.Transform({
        transform: function hydrateChunks(chunk, encoding, callback) {
            this.push(Buffer.from(`${hydrate({ chunk, handlers })}`));
            callback();
        }
    });


export const NavLink = ({ root, route }) =>
    `
        function init() {
            function listener() {
                if (this.status === 200) {
                    const node = document.getElementById('${root}');
                    node.innerHTML = this.responseText;
                }
            }
            var oReq = new XMLHttpRequest();
            oReq.addEventListener('load', listener);
            oReq.open('GET', '${route}');
            oReq.send();
        }
        init()
        `;