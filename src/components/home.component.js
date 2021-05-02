import React, { Component } from 'react';
import { InputGroup, Jumbotron, Form, Col, FormControl } from 'react-bootstrap';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import Switch from '@material-ui/core/Switch';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Alert from '@material-ui/lab/Alert';

import '../App.css';
import Logo from '../assets/icon.png';

const ipc = window.require('electron').ipcRenderer;

const AppDAO = require('../db/dao').default;
const Crud = require('../db/crud').default;
class Home extends Component {

  initialState = {
    title: '',
    message_notification: '',
    startAt: '',
    endAt: '',
    timeStartAt: '',
    timeEndAt: '',
    interval: '',
    allDays: false,
    checkBoxMon: false,
    checkBoxTue: false,
    checkBoxWed: false,
    checkBoxThu: false,
    checkBoxFri: false,
    checkBoxSat: false,
    checkBoxSun: false,
  };

  constructor(props) {
    super(props);
    this.state = this.initialState;
    this.handleChange = this.handleChange.bind(this);
    this.setDatabase();
  }

  setDatabase() {
    this.dao = new AppDAO();
    this.db = new Crud(this.dao);
  }

  getCheckboxValue(event) {
    if (event.target.name === 'allDays' && event.target.checked) {
      // eslint-disable-next-line react/no-direct-mutation-state
      this.setState({ disableCheckBox: this.state.disableCheckBox = true });
    } else if (event.target.name === 'allDays' && !event.target.checked) {
      // eslint-disable-next-line react/no-direct-mutation-state
      this.setState({ disableCheckBox: this.state.disableCheckBox = false });
    }

    return event.target.checked;
  }

  getTargetValue(event) {
    return event.target.value;
  }

  handleChange(event) {
    const value = event.target.type === 'checkbox' ? this.getCheckboxValue(event) : this.getTargetValue(event);
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
      title: {
        fontSize: 14,
      },
      pos: {
        marginBottom: 12,
      },
    },
  }));

  save() {
    if(this.validateInputs()) {
      this.db.insert(this.state);
      this.notify();
      this.db._setReminderToDay();
      this.resetFields();
    }
  }

  notify = () => {
    this.setState({ open: true });
  };

  closeNotify = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    this.setState({ open: false });
  };

  _adjustValuesOnReset(key) {
    let value = String(key[0]);
    if (value.startsWith('check')) {
      return false;
    } else if (value.startsWith('allDays')) {
      return false;
    }
    
    return '';
  }

  validateInputs() {
    if (this.state.title === '') {
      ipc.send('dialog-error', '- Title must be informed.');
      return false;
    }

    if (this.state.message_notification === '') {
      ipc.send('dialog-error', '- Message notification must be informed.');
      return false;
    }

    if (this.state.startAt === '') {
      ipc.send('dialog-error', '- Date start at must be informed.');
      return false;
    }

    if (this.state.endAt === '') {
      ipc.send('dialog-error', '- Date end at must be informed.');
      return false;
    }

    if (this.state.timeStartAt === '') {
      ipc.send('dialog-error', '- Time start at must be informed.');
      return false;
    }

    if (this.state.timeEndAt === '') {
      ipc.send('dialog-error', '- Time end at must be informed.');
      return false;
    }

    if (this.state.interval === '') {
      ipc.send('dialog-error', '- Interval must be informed.');
      return false;
    }

    if (!this.state.allDays && (
         !this.state.checkBoxMon 
      && !this.state.checkBoxTue 
      && !this.state.checkBoxWed 
      && !this.state.checkBoxThu 
      && !this.state.checkBoxFri 
      && !this.state.checkBoxSat 
      && !this.state.checkBoxSun )) {
      ipc.send('dialog-error', '- Some day must be select or all day.');
      return false;
    }

    return true;
  }

  resetFields = () => { 
    document.getElementById("form").reset();
    // eslint-disable-next-line array-callback-return
    Object.keys(this.state).map((key, index) => {
      this.setState({[key] : this._adjustValuesOnReset([key])});
   });
  }

  showAlert() {
    return this.render(<Alert style={{marginBottom:10}} onClose={() => {}}>This is a success alert — check it out!</Alert>)
  }

  render() {
    return (
      <>
        <Jumbotron>
          <h1>Create your reminder!</h1>
          <p>
            This is a simple reminder to help you a control your reminder.
          </p>
          <Form id="form">
            <Form.Row>
              <Form.Group as={Col}>
                <Form.Control name="title" value={this.state.value} onChange={this.handleChange} type="text" placeholder="Title" />
              </Form.Group>

              <Form.Group as={Col}>
                <InputGroup className="mb-3">
                  <FormControl name="message_notification" value={this.state.value} onChange={this.handleChange} placeholder="Message notification" aria-label="Message notification" aria-describedby="basic-addon2" />
                  <InputGroup.Append>
                    <div className={this.classes.root} style={{ marginTop: 4, marginLeft: 5 }}>
                      <Button variant="contained" size="small" className="buttonActionColor" onClick={() => this.notification(this.state.title, this.state.message_notification)}>Test</Button>
                    </div>
                  </InputGroup.Append>
                </InputGroup>
              </Form.Group>
            </Form.Row>

            <Form.Row>
              <Form.Group as={Col}>
                <Form.Label>Start at</Form.Label>
                <Form.Control name="startAt" value={this.state.value} onChange={this.handleChange} type="date" />
              </Form.Group>
              <Form.Group as={Col}>
                <Form.Label>End at</Form.Label>
                <Form.Control name="endAt" value={this.state.value} onChange={this.handleChange} type="date" />
              </Form.Group>
            </Form.Row>

            <Form.Row>
              <Form.Group as={Col}>
                <Form.Label>Time start at</Form.Label>
                <Form.Control name="timeStartAt" value={this.state.value} onChange={this.handleChange} type="time" />
              </Form.Group>
              <Form.Group as={Col}>
                <Form.Label>Time end at</Form.Label>
                <Form.Control name="timeEndAt" value={this.state.value} onChange={this.handleChange} type="time" />
              </Form.Group>
              <Form.Group as={Col}>
                <Form.Label>Interval</Form.Label>
                <Form.Control name="interval" value={this.state.value} onChange={this.handleChange} type="time" />
              </Form.Group>
            </Form.Row>

            <Form.Label>Days at reminder app will notify you ?
              <FormControlLabel style={{ marginLeft: 5, paddingTop: 7 }} control={<Switch checked={this.state.allDays} onChange={this.handleChange} name="allDays" />} label="All days" />
            </Form.Label>

            <FormGroup row>
              <FormControlLabel
                control={<Checkbox disabled={this.state.disableCheckBox} name="checkBoxMon" checked={this.state.checkBoxMon} onChange={this.handleChange} />}
                label="Mon"
              />
              <FormControlLabel
                control={<Checkbox disabled={this.state.disableCheckBox} name="checkBoxTue" checked={this.state.checkBoxTue} onChange={this.handleChange} />}
                label="Tue"
              />
              <FormControlLabel
                control={<Checkbox disabled={this.state.disableCheckBox} name="checkBoxWed" checked={this.state.checkBoxWed} onChange={this.handleChange} />}
                label="Wed"
              />
              <FormControlLabel
                control={<Checkbox disabled={this.state.disableCheckBox} name="checkBoxThu" checked={this.state.checkBoxThu} onChange={this.handleChange} />}
                label="Thu"
              />
              <FormControlLabel
                control={<Checkbox disabled={this.state.disableCheckBox} name="checkBoxFri" checked={this.state.checkBoxFri} onChange={this.handleChange} />}
                label="Fri"
              />
              <FormControlLabel
                control={<Checkbox disabled={this.state.disableCheckBox} name="checkBoxSat" checked={this.state.checkBoxSat} onChange={this.handleChange} />}
                label="Sat"
              />
              <FormControlLabel
                control={<Checkbox disabled={this.state.disableCheckBox} name="checkBoxSun" checked={this.state.checkBoxSun} onChange={this.handleChange} />}
                label="Sun"
              />

            </FormGroup>
            <div className={this.classes.root} style={{ textAlign: 'right' }}>
              <Button variant="outlined" size="small" color="secondary" >Clear</Button>
              <Button variant="contained" size="small" color="secondary" style={{ marginLeft: 2 }} onClick={() => this.save()}>Create</Button>
            </div>
          </Form>
          <br />
        </Jumbotron>
        <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          open={this.state.open}
          autoHideDuration={6000}
          onClose={this.closeNotify}
          message="Reminder created!"
          action={
            <React.Fragment>
              <IconButton size="small" aria-label="close" color="secondary" onClick={this.closeNotify}>
                <CloseIcon fontSize="small" />
              </IconButton>
            </React.Fragment>
          }
        />
      </>
    );
  }

}

export default Home;