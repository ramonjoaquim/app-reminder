import React, { Component } from 'react';
import { Button, Navbar, Nav, Form, ButtonGroup, ButtonToolbar } from 'react-bootstrap';
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

  render() {
    return (
      <>
        <Navbar bg="dark" variant="dark" className="fixed-nav-bar">
          <Navbar.Brand className="titlebar">Reminder app</Navbar.Brand>
          <Nav className="mr-auto">
          </Nav>
          <Form inline>
          <ButtonToolbar aria-label="Toolbar with button groups">
            <ButtonGroup size="sm" className="mr-2">
              <Button variant="success" className="my-button" title="Minimise" onClick={() => this.minimiseWindow()}></Button>
            </ButtonGroup>
            <ButtonGroup size="sm" className="mr-2">
              <Button variant="warning" className="my-button" title="Maximise" onClick={() => this.maximiseWindow()}></Button>
            </ButtonGroup>
            <ButtonGroup size="sm">
              <Button variant="danger" className="my-button" title="Close" onClick={() => this.closeWindow()}></Button>
            </ButtonGroup>
            </ButtonToolbar>
          </Form>
        </Navbar>
      </>
    );
  }

}

export default MyNavBar;