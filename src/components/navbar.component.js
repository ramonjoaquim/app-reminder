/* eslint-disable react/no-direct-mutation-state */
import React, { Component } from 'react';
import { Navbar, Nav, Form, ButtonGroup, ButtonToolbar, Badge } from 'react-bootstrap';
import { Link } from "react-router-dom";
import CloseIcon from '@material-ui/icons/Close';
import RemoveSharpIcon from '@material-ui/icons/RemoveSharp';
import Menu from '@material-ui/core/Menu';
import Fade from '@material-ui/core/Fade';
import MenuIcon from '@material-ui/icons/Menu';
import IconButton from '@material-ui/core/IconButton';
import '../App.css';
const ipc = window.require('electron').ipcRenderer;


class MyNavBar extends Component {

  initialState = {
    open: false,
    anchorEl: null
  }

  constructor(props) {
    super(props);
    this.state = this.initialState;
  }

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

  handleClick() {
    if (this.state.open) {
      this.setState({open: this.state.open = false});
      return;
    }

    this.setState({open: this.state.open = true});
  }
  
  onClickCapture() {
    this.setState({open: this.state.open = false});
  }

  render() {
    return (
      <>
        <Navbar variant="dark" className="fixed-nav-bar r-dark">
        <div>
          <IconButton
            style={{marginLeft:'-4vh'}}
            aria-label="more"
            aria-controls="long-menu"
            aria-haspopup="true"
            onClick={() => this.handleClick()}
          >
            <MenuIcon />
          </IconButton>
          <Menu
            id="fade-menu"
            anchorEl={this.state.anchorEl}
            keepMounted
            onClickCapture={() => this.onClickCapture()}
            open={this.state.open}
            onClose={() => this.handleClose}
            TransitionComponent={Fade}
          >
            <Link to="/create-reminder" className="linkMenuOptions">
                Create Reminder
            </Link>
            <br></br>
            <Link to="/show-reminders" className="linkMenuOptions">
                Show reminders
            </Link>
            <br></br>
            <Link to="/settings" className="linkMenuOptions">
                Settings
            </Link>
            <br></br>
            <Link to="/about" className="linkMenuOptions">
                About
            </Link>
          </Menu>
        </div>
          <Link to="/">
            <Badge variant="light">Home</Badge>
          </Link>
          <Nav className="mr-auto titlebar">
          <span>&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;</span>
          </Nav>
          <Form inline>
          <ButtonToolbar aria-label="Toolbar with button groups">
            <ButtonGroup size="sm" className="mr-2">
              <RemoveSharpIcon className="my-button" title="Minimise" onClick={() => this.minimiseWindow()}></RemoveSharpIcon>
            </ButtonGroup>
            <ButtonGroup size="sm">
              <CloseIcon className="my-button-close" title="Close" onClick={() => this.closeWindow()}></CloseIcon>
            </ButtonGroup>
            </ButtonToolbar>
          </Form>
        </Navbar>
      </>
    );
  }

}

export default MyNavBar;