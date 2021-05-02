/* eslint-disable react/no-direct-mutation-state */
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

const AppDAO = require('../db/dao').default;
const Crud = require('../db/crud').default;

class ShowReminder extends Component {

  constructor(props) {
    super(props);
    this.state = {
      rows: [],
      open: false,
      setOpen: false,
      anchorEl: null,
      openPop: null,
      currentIdRow: null,
      weekDays: ''
    };
    this.setDatabase();
    this.loadData();
  }

  setDatabase() {
    this.dao = new AppDAO();
    this.db = new Crud(this.dao);
  }

  loadData() {
    var getAllData = this.db.getAll();

    Promise.all(getAllData).then((data) => {
      this.setState({ rows: data });
    })
  }

  deleteItem(id) {
    this.db.delete(id);
    this.db.deleteSheduleByReminderId(id);
    this.loadData();
    this.notify();
  }

  eraseAll() {
    this.db.dropAllReminder();
    this.db.dropAllSheduler();
    this.loadData();
    this.notify();
  }

  classes = makeStyles((theme) => ({
    table: {
      minWidth: 650,
    },
    typography: {
      padding: theme.spacing(2),
    },
  }));

  notify = () => {
    this.setState({ open: true });
  };

  closeNotify = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    this.setState({ open: false });
  };

  openPopOver(id) {
    this.setState({ currentIdRow: this.state.currentIdRow = id });
    this.setState({ anchorEl: this.state.anchorEl = true });
    this.setState({ openPop: this.state.openPop = Boolean(this.state.anchorEl) });
  };

  closePopOver = () => {
    this.setState({ anchorEl: this.state.anchorEl = false });
    this.setState({ openPop: this.state.openPop = Boolean(this.state.anchorEl) });
  };

  formatWeekDays(row) {
    let resultFomated = '';

    if (row.allDays) {
      resultFomated = 'All days';
    } else {

      if (row.checkBoxMon) {
        resultFomated += 'Mon';
      }

      if (row.checkBoxTue) {
        resultFomated += resultFomated === '' ? 'Tue' : ', Tue';
      }

      if (row.checkBoxWed) {
        resultFomated += resultFomated === '' ? 'Wed' : ', Wed';
      }

      if (row.checkBoxThu) {
        resultFomated += resultFomated === '' ? 'Thu' : ', Thu';
      }

      if (row.checkBoxFri) {
        resultFomated += resultFomated === '' ? 'Sex' : ', Sex';
      }

      if (row.checkBoxSat) {
        resultFomated += resultFomated === '' ? 'Sat' : ', Sat';
      }

      if (row.checkBoxSun) {
        resultFomated += resultFomated === '' ? 'Sun' : ', Sun';
      }
    }

    return resultFomated;
  }


  render() {
    return (
      <>
        <Jumbotron>
          <h1>My reminders</h1>
          <p>
            You have {this.state.rows.length} reminders.
            <Link style={{ marginLeft: 20 }} to="/">
              <Button size="small" color="secondary">Back</Button>
            </Link>

            <Button className="float-right" size="small" variant="contained" color="secondary" onClick={() => this.eraseAll()}>Delete All</Button>
          </p>

          <TableContainer component={Paper}>
            <Table className={this.classes.table} size="small" aria-label="a dense table">
            <TableBody>
                  <TableRow >
                    <TableCell component="th" align="left" scope="row">
                      Title
                    </TableCell>
                    <TableCell component="th" align="left" scope="row">
                      Message
                    </TableCell> 
                    <TableCell component="th" align="center" scope="row">
                      Time to reminder
                    </TableCell> 
                    <TableCell component="th" align="center" scope="row">
                      Days to reminder
                    </TableCell> 
                    <TableCell component="th" align="left" scope="row">
                    </TableCell>
                  </TableRow>
              </TableBody>
              <TableBody>
                {this.state.rows.map((row) => (
                  <TableRow key={row.title}>
                    <TableCell component="th" scope="row">
                      {row.title}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {row.message_notification}
                    </TableCell>
                    <TableCell component="th" align="center" scope="row">
                      {row.startAt} {row.timeStartAt} à {row.endAt} {row.timeEndAt}
                    </TableCell>
                    <TableCell align="center">
                      {this.formatWeekDays(row)}
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
          message="Reminder deleted!"
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