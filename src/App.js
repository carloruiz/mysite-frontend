import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import styles from './css/app.module.css'
import Header from './components/header.js'
import Body from './components/body.js'


class App extends Component {
  render() {
    return (
      <div className="App">
        <Header />
        <Body/>
      </div>
    );
  }
}

export default App;
