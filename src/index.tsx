import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';

import { i18nClient } from './i18n';
import { register } from './serviceWorker';
import App from './App';

i18nClient();

const rootEl = document.createElement('div');
rootEl.id = 'root';
document.body.appendChild(rootEl);

const render = (Component: any) => {
    const rootElement = document.getElementById('root');
    ReactDOM.render(
        <AppContainer>
            <Component />
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
