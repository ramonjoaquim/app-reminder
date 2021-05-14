import React, { Component } from 'react';
import { Jumbotron } from 'react-bootstrap';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';
import CardContent from '@material-ui/core/CardContent';
import logo from '../assets/icon.png';
const appVersion = window.require("electron").remote.app.getVersion();
const ipc = window.require('electron').ipcRenderer;
class About extends Component {

  classes = makeStyles((theme) => ({
    root: {
      minWidth: 275,
    },
    bullet: {
      display: 'inline-block',
      margin: '0 2px',
      transform: 'scale(0.8)',
    },
    title: {
      fontSize: 14,
    },
    pos: {
      marginBottom: 12,
    },
    large: {
      width: theme.spacing(7),
      height: theme.spacing(7),
      cursor: 'pointer'
    },
  }));

  goToPage(url) {
    ipc.send('got-to-page', url);
  }

  checkUpdate() {
    ipc.send('check-updates');
  }

  forceSetReminders() {
    ipc.send('force-set-reminders');
  }

  render() {
    return (
      <>
        <Jumbotron>
          <Card className={this.classes.root} style={{backgroundColor: 'rgb(7 74 68 / 55%)', color:'white', width:'103%', marginLeft:'-2vh', marginTop:'-4vh'}}>
            <CardContent style={{ textAlign: 'center', color:'white'}}>
              <div className='row' style={{marginLeft:'30vh'}} onClick={() => this.goToPage('https://github.com/ramonjoaquim/app-reminder')}>
                <img width="15%" style={{marginRight:30}} height="auto" className="img-responsive" src={logo} alt='Logo Reminder App'></img>
                <h3 style={{marginTop:'5%'}}>Reminder App</h3>
              </div>
              <h6>Developed by</h6>
              <Avatar style={{marginLeft:'47%'}} alt="Ramon Joaquim" onClick={() => this.goToPage('https://github.com/ramonjoaquim')} className={this.classes.large} src="https://s.gravatar.com/avatar/4686eba0c4375b4316ad588324bcff89?s=80" />
              <br/> <br/>
              <p>Version: {appVersion}</p> 
              <span>&ensp;</span>
              {/* <Button variant='outlined' className='buttonActionColor' size="small" onClick={() => this.checkUpdate()}>Check updates</Button> */}
              <Button variant='outlined' className='buttonActionColor' size="small" onClick={() => this.forceSetReminders()}>Get Log reminder</Button>
            </CardContent>
          </Card>
        </Jumbotron>
      </>
    )
  };
}

export default About;