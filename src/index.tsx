import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import { BrowserRouter as Router } from 'react-router-dom';

import { register } from './serviceWorker';
import App from './App';

const rootEl = document.createElement('div');
rootEl.id = 'root';
document.body.appendChild(rootEl);

const render = (Component: any) => {
    const rootElement = document.getElementById('root');
    ReactDOM.render(
        <AppContainer>
            <Router>
                <Component />
            </Router>
        </AppContainer>,
        rootElement,
    );
};

render(App);

register();

if ((module as NodeModule).hot) {
    (module as NodeModule).hot.accept('./App', () => {
        render(App);
    });
}
