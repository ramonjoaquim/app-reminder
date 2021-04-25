import React, { Component } from 'react';
import { Card, InputGroup, Jumbotron, Form, Col, FormControl } from 'react-bootstrap';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import Switch from '@material-ui/core/Switch';
import { Link } from "react-router-dom";
import '../App.css';
import Logo from '../assets/icon.png'; 

const ipc = window.require('electron').ipcRenderer

class Home extends Component {

  constructor(props) {
    super(props);
    this.state = {
      title: '',
      messageNotification: ''
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {    
    const value = event.target.value;
    this.setState({
      ...this.state,
      [event.target.name]: value
    });
  }

  notification = (title, message) => {
    ipc.send('notification', title, message);
  }
  
  classes = makeStyles((theme) => ({
    root: {
      '& > *': {
        margin: theme.spacing(1),
      },
    },
  }));

  render() {
    return (
      <>
        <Jumbotron>
          <h1>
          <img width="7%" height="auto" className="img-responsive" src={Logo}  alt="logo" />
          &ensp;Welcome!</h1>
          <p>
            This is a simple reminder to help you a control your reminder.
          </p>
          <Form>
            <Form.Row>
              <Form.Group as={Col}>
                <Form.Control name="title" value={this.state.value} onChange={this.handleChange} type="text" placeholder="Title"  />
              </Form.Group>

              <Form.Group as={Col}>
                <InputGroup className="mb-3">
                  <FormControl name="messageNotification" value={this.state.value} onChange={this.handleChange} placeholder="Message notification" aria-label="Message notification" aria-describedby="basic-addon2"/>
                  <InputGroup.Append>
                  <div className={this.classes.root}>
                    <Button  color="primary" onClick={() => this.notification(this.state.title, this.state.messageNotification)}>Test</Button>
                  </div>
                  </InputGroup.Append>
                </InputGroup>
              </Form.Group>
            </Form.Row>

            <Form.Row>
            <Form.Group as={Col}>
              <Form.Label>Start at</Form.Label>
              <Form.Control type="date"/>
            </Form.Group>
            <Form.Group as={Col}>
              <Form.Label>End at</Form.Label>
              <Form.Control type="date"/>
            </Form.Group>
            </Form.Row>

            <Form.Row>
            <Form.Group as={Col}>
              <Form.Label>Time start at</Form.Label>
              <Form.Control type="time"/>
            </Form.Group>
            <Form.Group as={Col}>
              <Form.Label>Time end at</Form.Label>
              <Form.Control type="time"/>
            </Form.Group>
            <Form.Group as={Col}>
              <Form.Label>Interval</Form.Label>
              <Form.Control type="time"/>
            </Form.Group>
            </Form.Row>

            <Form.Label>Days at reminder app will notify you ?
              <FormControlLabel style={{marginLeft:5, paddingTop:7}} control={<Switch />} label="All days" />
            </Form.Label>

            <FormGroup row>
              <FormControlLabel
                control={<Checkbox checked={true}  name="checkedA" />}
                label="Mon"
              />
              <FormControlLabel
                control={<Checkbox checked={true}  name="checkedA" />}
                label="Tue"
              />
              <FormControlLabel
                control={<Checkbox checked={true}  name="checkedA" />}
                label="Wed"
              />
              <FormControlLabel
                control={<Checkbox checked={true}  name="checkedA" />}
                label="Thu"
              />
              <FormControlLabel
                control={<Checkbox checked={true}  name="checkedA" />}
                label="Fri"
              />
              <FormControlLabel
                control={<Checkbox checked={true}  name="checkedA" />}
                label="Sat"
              />
              <FormControlLabel
                control={<Checkbox checked={true}  name="checkedA" />}
                label="Sun"
              />

            </FormGroup>
            <div className={this.classes.root} style={{textAlign:'right'}}>
              <Button size="small" color="primary" >Clear</Button>
              <Button size="small" color="secondary" style={{marginLeft:2}} >Create</Button>
            </div>
          </Form>
          <br />
          <Card className="text-center">
            <Card.Body>
              <Card.Title>My reminders</Card.Title>
              <Card.Text>
                Here you see your reminders e also can edit.
              </Card.Text>
              <div className={this.classes.root}>
                <Link to="/show-reminders">
                  <Button variant="contained" color="secondary">Show my reminders</Button>
                </Link>
              </div>
            </Card.Body>
          </Card>
        </Jumbotron>
      </>
    );
  }

}

export default Home;