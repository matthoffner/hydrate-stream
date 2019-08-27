# hydrate-stream

A batteries excluded stream transformer with API for declaritively hydrating elements (adding onclick handlers). Use case is for server rendering static html with simple javascript for minimal interactivity.

```sh
npm install hydrate-stream
```

## Usage

```js
import { hydrateStream, NavLink  } from 'hydrate-stream';


const hydrationRegistry = {
    contactInfo: {
        component: <ContactInfo />,
        handlers: [
            {
                id: 'buttonNext',
                key: 'onclick',
                value: NavLink({ root: 'contactInfoRoot', route: '/advance/confirmation' })
            },
            {
                id: 'buttonBack',
                key: 'onclick',
                value: NavLink({ root: 'contactInfoRoot', route: '/advance/datePicker' })
            }
        ]
    },
    confirmation: {
        component: <SubmitConfirmation />,
        handlers: [
            {
                id: 'root', // Can render at root for full page client side navigate
                key: 'onclick',
                value: NavLink({ root: 'root', route: '/advance/submit' })
            },
            {
                id: 'buttonBack',
                key: 'onclick',
                value: NavLink({ root: 'submitconfirmationRoot', route: '/advance/contactInfo' })
            }
        ]
    }
// similar to sheets-registry-stream, we pipe the rendered react stream to a transformer before piping to the response.
const render = (hydrated, res) => {
    renderToStaticNodeStream(hydrated.component)
        .pipe(hydrateStream(hydrated.handlers))
        .pipe(res);
};
// route determines which handlers to hyndrate based on param
app.get('/advance/:step', (req, res) => render(hydrationRegistry[req.params.step], res));
```