import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import Home from './home.component';
import ShowReminder from './show-reminder.component';
import About from './about.component';

class Main extends Component {
  render() {
    return (
      <Switch>
        <Route exact path='/' component={Home}></Route>
        <Route exact path='/show-reminders' component={ShowReminder}></Route>
        <Route exact path='/about' component={About}></Route>
        <Route path="*" component={Home} />
      </Switch>
    );
  }

}

export default Main;