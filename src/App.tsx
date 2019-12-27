import React, { Component } from 'react';
import Helmet from 'react-helmet';
import Editor from './components/editor/Editor';

class App extends Component {
    render() {
        return (
            <div className="container">
                <Helmet>
                    <meta charSet="utf-8" />
                    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                    <meta name="description" content="Gyul Admin Template" />
                    <link rel="manifest" href={`${PUBLIC_URL}manifest.json`} />
                    <link rel="shortcut icon" href={`${PUBLIC_URL}favicon.png`} />
                    <link rel="stylesheet" href="https://fonts.googleapis.com/earlyaccess/notosanskr.css" />
                </Helmet>
                <Editor />
            </div>
        );
    }
}

export default App;
