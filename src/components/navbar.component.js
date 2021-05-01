import React, { Component } from 'react';
import { Button, Navbar, Nav, Form, ButtonGroup, ButtonToolbar, Badge } from 'react-bootstrap';
import { Link } from "react-router-dom";
import CloseIcon from '@material-ui/icons/Close';
import RemoveSharpIcon from '@material-ui/icons/RemoveSharp';
import '../App.css';
const ipc = window.require('electron').ipcRenderer

class MyNavBar extends Component {

  async getStatusTrayWindow () {
    const result = await ipc.invoke('window-is-trayed');
    return result;
  }

  closeWindow = () => {
    if (this.getStatusTrayWindow()) {
      ipc.send('put-in-tray');
    } else {
      ipc.send('remove-tray');
    }
  }

  minimiseWindow = () => {
    ipc.send('minimise');
  }

  maximiseWindow = () => {
    ipc.send('maximise');
  }

  about() {
    console.log("about click")
  }

  render() {
    return (
      <>
        <Navbar variant="dark" className="fixed-nav-bar r-dark">
          <Form inline>
          <ButtonToolbar aria-label="Toolbar with button groups">
            <ButtonGroup size="sm">
              <CloseIcon variant="danger" className="my-button-close" title="Close" onClick={() => this.closeWindow()}></CloseIcon>
            </ButtonGroup>
            <ButtonGroup size="sm" className="mr-2">
              <RemoveSharpIcon variant="success" className="my-button" title="Minimise" onClick={() => this.minimiseWindow()}></RemoveSharpIcon>
            </ButtonGroup>
            </ButtonToolbar>
          </Form>
          <Nav className="mr-auto titlebar">
          <span>&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;</span>
          </Nav>
            <Badge className="aboutBadge" variant="light" onClick={() => this.about}>About</Badge>
          <span>&ensp;</span>
          <Link to="/show-reminders">
            <Badge variant="light">Show my reminders</Badge>
          </Link>
          <span>&ensp;</span>
          <Link to="/">
            <Badge variant="light">Create Reminder</Badge>
          </Link>
        </Navbar>
      </>
    );
  }

}

export default MyNavBar;