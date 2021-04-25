import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import Home from './home.component';
import ShowReminder from './show-reminder.component';

class Main extends Component {
  render() {
    return (
      <Switch> {/* The Switch decides which component to show based on the current URL.*/}
        <Route exact path='/' component={Home}></Route>
        <Route exact path='/show-reminders' component={ShowReminder}></Route>
      </Switch>
    );
  }

}

export default Main;