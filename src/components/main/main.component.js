  /* eslint no-console: ["error", { allow: ["info", "error"] }] */

import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import Home from '../home/home.component';
import ShowReminder from '../reminder/list/show-reminder.component';
import CreateReminder from '../reminder/create/create-reminder.component';
import About from '../about/about.component';
import Settings from '../settings/settings.component';
import ReminderRepository from '../../repository/reminderRepository';
import DataBaseInitializer from '../../repository/dataBaseInitializer';

class Main extends Component {

  constructor() {
    super();
    const dao = new ReminderRepository();
    new DataBaseInitializer(dao);
  }

  render() {
    return (
      <Switch>
        <Route exact path='/' component={Home}></Route>
        <Route exact path='/create-reminder' component={CreateReminder}></Route>
        <Route exact path='/show-reminders' component={ShowReminder}></Route>
        <Route exact path='/settings' component={Settings}></Route>
        <Route exact path='/about' component={About}></Route>
        <Route path="*" component={Home} />
      </Switch>
    );
  }
}
export default Main;