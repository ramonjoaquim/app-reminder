import React, { Component } from 'react';
import { Jumbotron } from 'react-bootstrap';
import { Link } from "react-router-dom";
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Promise from "bluebird";
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';


import '../App.css';
import Logo from '../assets/icon.png';

const ipc = window.require('electron').ipcRenderer

const AppDAO = require('../db/dao').default;
const Crud = require('../db/crud').default;

class ShowReminder extends Component {

  constructor(props) {
    super(props);
    this.state = {
      rows: [],
      open: false,
      setOpen: false
    };
    this.setDatabase();
    this.loadData();
  }

  setDatabase() {
    this.dao = new AppDAO('./database.sqlite3');
    this.db = new Crud(this.dao);
    this.db.createTable()
      .then(() => {
        console.log('db is created...')
      })
      .catch((err) => {
        console.log('Error: ')
        console.log(JSON.stringify(err))
      });
  }

  loadData() {
    var getAllData = this.db.getAll();

    Promise.all(getAllData).then((data) => {
      this.setState({ rows: data });
    })
  }

  deleteItem(id) {
    this.db.delete(id);
    this.loadData();
    this.notify();
  }

  classes = makeStyles({
    table: {
      minWidth: 650,
    },
  });

  notify = () => {
    this.setState({ open: true });
  };

  closeNotify = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    this.setState({ open: false });
  };

  render() {
    return (
      <>
        <Jumbotron>
          <h1>
            <img width="7%" height="auto" className="img-responsive" src={Logo} alt="logo" />
          &ensp;My reminders
          </h1>
          <p>
            You have {this.state.rows.length} reminders.
            <Link style={{ marginLeft: 20 }} to="/">
              <Button size="small" color="secondary">Back</Button>
            </Link>
          </p>

          <TableContainer component={Paper}>
            <Table className={this.classes.table} size="small" aria-label="a dense table">
              <TableBody>
                {this.state.rows.map((row) => (
                  <TableRow key={row.title}>
                    <TableCell component="th" scope="row">
                      {row.title}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {row.message_notification}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {row.startAt}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      à
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {row.endAt}
                    </TableCell>
                    <TableCell align="right">
                      <Button variant="contained" size="small" color="dark">Details</Button>
                    </TableCell>
                    <TableCell align="right">
                      <Button variant="contained" size="small" onClick={() => this.deleteItem(row.id)} color="dark">delete</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <br />

          <Link style={{ marginRight: 20 }} to="/">
            <Button size="small" color="secondary">Back</Button>
          </Link>
        </Jumbotron>

        <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          open={this.state.open}
          autoHideDuration={6000}
          onClose={this.closeNotify}
          message="Deleted!"
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

export default ShowReminder;