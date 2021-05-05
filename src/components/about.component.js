import React, { Component } from 'react';
import { Jumbotron } from 'react-bootstrap';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import Button from '@material-ui/core/Button';
import CardActions from '@material-ui/core/CardActions';
import Avatar from '@material-ui/core/Avatar';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
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
    },
  }));

  goToPage(url) {
    ipc.send('got-to-page', url);
  }

  checkUpdate() {
    ipc.send('check-updates');
  }

  render() {
    return (
      <>
        <Jumbotron>
          <Card className={this.classes.root} style={{backgroundColor: '#074a44e3', color:'white', width:'50%', marginLeft:'30vh'}}>
            <CardContent style={{ textAlign: 'center', color:'white'}}>
              <Typography variant="h5" component="h2">
                Reminder App
              </Typography>
              <Typography className={this.classes.pos} color="white">
                Develop by
              </Typography>
              <br/>
              <Card style={{backgroundColor:'#009688'}}>
              <br/>
                <Avatar style={{marginLeft:'45%'}} alt="Ramon Joaquim" className={this.classes.large} src="https://s.gravatar.com/avatar/4686eba0c4375b4316ad588324bcff89?s=80" />
                <CardHeader
                  title="Ramon J. Limas"
                  subheader="Brasil"
                  style={{color:'white'}}
                />
                <CardContent>
                  <Typography variant="body2" color="white" component="p">
                  Bachelor in Information System, Full Stack Developer with knowledge about DevOps culture, API development and also functional and automated tests.
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button variant='contained' size="small" onClick={() => this.goToPage('https://github.com/ramonjoaquim')}>Github</Button>
                </CardActions>
              </Card>
              <br/> <br/>
              <Typography className={this.classes.title} color="white" gutterBottom>
                Version: {appVersion}
                <span>&ensp;&ensp;</span>
                <Button variant='outlined' size="small" onClick={() => this.checkUpdate()}>Check updates</Button>
              </Typography>
            </CardContent>
          </Card>
        </Jumbotron>
      </>
    )
  };
}

export default About;