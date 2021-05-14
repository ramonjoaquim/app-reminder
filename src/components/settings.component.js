import React, { Component } from 'react';
import { Jumbotron } from 'react-bootstrap';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CreateIcon from '../assets/create-icon.png';
import ListIcon from '../assets/list-icon.png';


import '../App.css';
class Settings extends Component {

  goToCreateReminder() {
    this.props.history.push('/create-reminder');
  }

  gotToShowReminder() {
    this.props.history.push('/show-reminders');
  }
  
  render() {
    return (
      <>
        <Jumbotron>
          <h1>Settings</h1>
          <div className='row'>
            <div style={{marginLeft:'50vh', marginTop:'30vh', color:'white'}}>
              coming soon ...
            </div>
          </div>
        </Jumbotron>
      </>
    );
  }

}

export default Settings;