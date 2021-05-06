import React, { Component } from 'react';
import { Jumbotron } from 'react-bootstrap';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CreateIcon from '../assets/create-icon.png';
import ListIcon from '../assets/list-icon.png';

import '../App.css';
class Home extends Component {

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
          <h1>What you gonna do?</h1>
          <div className='row'>
          <Card style={{backgroundColor: 'rgb(7 74 68 / 55%)', color:'white', width:'40%', marginLeft:'10vh', marginRight:'30px', marginTop:'14vh', height:'40vh'}}>
            <CardContent style={{ textAlign: 'center', color:'white'}}>
              <img src={CreateIcon} style={{marginLeft:'5vh', marginBottom:'7vh'}} alt='create icon'></img>
              <span>&ensp;&ensp;</span>
              <Button className='buttonActionColor' size="small" onClick={() => this.goToCreateReminder()}>Create reminder</Button>
            </CardContent>
          </Card>

          <Card style={{backgroundColor: 'rgb(7 74 68 / 55%)', color:'white', width:'40%', marginLeft:'0vh', marginTop:'14vh', height:'40vh'}}>
            <CardContent style={{ textAlign: 'center', color:'white'}}>
              <img src={ListIcon} style={{marginLeft:'6vh', marginRight:'3vh', marginBottom:'7vh'}} alt='create icon'></img>
              <span>&ensp;&ensp;</span>
              <Button className='buttonActionColor' size="small" onClick={() => this.gotToShowReminder()}>Show reminders</Button>
            </CardContent>
          </Card>
          </div>
        </Jumbotron>
      </>
    );
  }

}

export default Home;