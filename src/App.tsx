import React, { Component } from 'react';
import Helmet from 'react-helmet';
import { Route, Switch } from 'react-router-dom';

import Editor from './components/editor/Editor';
import { Psychrometrics } from './components/chart';
import { Layout } from 'antd';
import { Menus } from './components/layout';

class App extends Component {
    render() {
        return (
            <div className="container">
                <Helmet>
                    <meta charSet="utf-8" />
                    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                    <meta name="description" content="Data visualization analysis editor developed with react, antd, echarts" />
                    <link rel="manifest" href={`${PUBLIC_URL}manifest.json`} />
                    <link rel="shortcut icon" href={`${PUBLIC_URL}favicon.png`} />
                    <link rel="stylesheet" href="https://fonts.googleapis.com/earlyaccess/notosanskr.css" />
                </Helmet>
                <Switch>
                    <Layout className="editor-container">
                        <Menus />
                        <Layout>
                            <Route exact={true} path="/">
                                <Editor />
                            </Route>
                            <Route path="/psychrometrics">
                                <Psychrometrics />
                            </Route>
                        </Layout>
                    </Layout>
                </Switch>
            </div>
        );
    }
}

export default App;
