  /* eslint no-console: ["error", { allow: ["info", "error"] }] */
  
import { Button, FormControlLabel, IconButton, Snackbar } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import CloseIcon from '@material-ui/icons/Close';
import React, { Component } from 'react';
import { Form, Jumbotron } from 'react-bootstrap';
import Switch from '@material-ui/core/Switch';
import '../../app.css';
import ReminderService from '../../service/reminderService';
import _ from 'lodash';

const ipc = window.require('electron').ipcRenderer;

class Settings extends Component {

  initialState = {
    id: null,
    disable_notification: false,
  };

  constructor(props) {
    super(props);
    this.state = this.initialState;
    this.handleChange = this.handleChange.bind(this);
    this.service = new ReminderService();
    this.loadData();
  }

  async loadData() {
    let data  = _.first(await this.service.getSettings());
    this.setState({ disable_notification: this.state.disable_notification = this.convertToBollean(data.disable_notification) });
    this.setState({ id: this.state.id = data.id });
  }

  save() {
    if (this.state.id) {
      this.service.updateSettings(this.state.id, this.state.disable_notification);
    } else {
      this.service.insertSettings(this.state);
    } 
    this.notify();
  }

  convertToBollean(value) {
    return value === 1;
  }

  goToCreateReminder() {
    this.props.history.push('/create-reminder');
  }

  gotToShowReminder() {
    this.props.history.push('/show-reminders');
  }

  handleChange(event) {
    this.setState({
      ...this.state,
      [event.target.name]:  event.target.checked
    });
    // eslint-disable-next-line react/no-direct-mutation-state
    this.setState({ disable_notification: this.state.disable_notification = event.target.checked });
  }

  getTargetValue(event) {
    return event.target.value;
  }

  notification = (title, message) => {
    ipc.send('notification', title, message);
  }

  notify = () => {
    this.setState({ open: true });
  };

  closeNotify = (_event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    this.setState({ open: false });
  };

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
  
  render() {
    return (
      <>
        <Jumbotron>
          <h1>Settings</h1>
          <div className='row'>
            <div style={{marginLeft:'5vh', color:'white'}}>
            <Form.Label>Disable notifications
              <FormControlLabel style={{ marginLeft: 5, paddingTop: 7 }} control={<Switch  color='default' checked={this.state.disable_notification} onChange={this.handleChange} name="disable_notification" />}  />
            </Form.Label>
            </div>
          </div>
          <div className={this.classes.root} style={{ textAlign: 'right' }}>
              <Button variant="contained" size="small" className="buttonSecondary" style={{ marginLeft: 2 }} onClick={() => this.save()}>Save</Button>
          </div>
        </Jumbotron>
        <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          open={this.state.open}
          autoHideDuration={6000}
          onClose={this.closeNotify}
          message="Settings saved!"
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

export default Settings;