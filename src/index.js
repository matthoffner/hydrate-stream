const stream = require('stream');
const himalaya= require('himalaya');

const hydrate = ({ chunk, handlers }) => {
    const htmlObject = himalaya.parse(chunk.toString());
    Object.keys(htmlObject).forEach(element => {
        const handlerMatch = htmlObject[element].attributes
            .find(a => handlers.filter(h => h.key === a.key));
        if (handlerMatch) {
            const handler = handlers.filter(f => f.id === handlerMatch.value);
            if (handler.length && handler[0].key === 'onload') {
                htmlObject.push({
                    attributes: [],
                    type: 'element',
                    tagName: 'script',
                    children: [
                        {
                            type: 'text',
                            content: handler[0].value
                        }
                    ]
                })
            } else {
                Object.values(htmlObject[element].attributes).forEach(attr => {
                    if (handler[0].id === attr.value) {
                        htmlObject[element].attributes.push({
                            key: handler[0].key,
                            value: handler[0].value
                        })
                    }
                })
            }
        }
    });

    return [himalaya.stringify(htmlObject)];
};

module.exports.hydrateStream = handlers =>
    new stream.Transform({
        transform: function hydrateChunks(chunk, encoding, callback) {
            this.push(Buffer.from(`${hydrate({ chunk, handlers })}`));
            callback();
        }
    });