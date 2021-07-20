import React, { Component } from 'react';
import { Jumbotron } from 'react-bootstrap';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import CreateIcon from '../assets/create-icon.png';
import ListIcon from '../assets/list-icon.png';

import '../App.css';
const ipc = window.require('electron').ipcRenderer;
class Home extends Component {

  constructor(props) {
    super(props);
    this.state = {
      nextReminder: ''
    };
  }

  goToCreateReminder() {
    this.props.history.push('/create-reminder');
  }

  gotToShowReminder() {
    this.props.history.push('/show-reminders');
  }

  getNextReminder() {
    ipc.send('get-next-reminder');
  }

  render() {
    return (
      <>
        <Jumbotron>
          <h1>What you gonna do?</h1>
          <br></br>
          <Button variant='outlined' className='buttonActionColor' size="small" onClick={() => this.getNextReminder()}>See next reminder</Button>
          <div className='row'>
          <Card style={{backgroundColor: 'rgb(7 74 68 / 55%)', color:'white', width:'40%', marginLeft:'10vh', marginRight:'30px', marginTop:'20vh', height:'27vh'}} className="cardHome" onClickCapture={() => this.goToCreateReminder()}>
            <CardContent style={{ textAlign: 'center', color:'white'}}>
              <img src={CreateIcon} style={{marginLeft:'5vh', marginBottom:'7vh'}} alt='create icon'></img>
              <span>&ensp;&ensp;</span>
              <h4>Create reminder</h4>
            </CardContent>
          </Card>

          <Card style={{backgroundColor: 'rgb(7 74 68 / 55%)', color:'white', width:'40%', marginLeft:'0vh', marginTop:'20vh', height:'27vh'}} className="cardHome" onClickCapture={() => this.gotToShowReminder()}>
            <CardContent style={{ textAlign: 'center', color:'white'}}>
              <img src={ListIcon} style={{marginLeft:'6vh', marginRight:'3vh', marginBottom:'7vh'}} alt='create icon'></img>
              <span>&ensp;&ensp;</span>
              <h4>Show reminders</h4>
            </CardContent>
          </Card>
          </div>
        </Jumbotron>
      </>
    );
  }

}

export default Home;