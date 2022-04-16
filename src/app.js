  /* eslint no-console: ["error", { allow: ["info", "error"] }] */
import React, { Component } from 'react';
import MyNavBar from './components/navbar/navbar.component';
import Main from './components/main/main.component';

class App extends Component{
  render() {
    return [
      <MyNavBar/>,
      <Main/>
    ];
  }
}
export default App;
