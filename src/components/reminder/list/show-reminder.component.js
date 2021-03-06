/* eslint-disable react/no-direct-mutation-state */
/* eslint no-console: ["error", { allow: ["info", "error"] }] */
import React, { Component } from 'react';
import { Jumbotron } from 'react-bootstrap';
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
import moment from 'moment';
import '../../../app.css';
import ReminderService from '../../../service/reminderService';
import { TableHead } from '@material-ui/core';

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
      weekDays: '',
    };
    this.setDatabase();
    this.loadData();
  }

  setDatabase() {
    this.service = new ReminderService();
  }

  loadData() {
    var getAllData = this.service.getAll();

    Promise.all(getAllData).then((data) => {
      this.setState({ rows: data });
    })
  }

  deleteItem(id) {
    this.service.delete(id);
    this.service.deleteSheduleByReminderId(id);
    this.loadData();
    this.notify();
  }

  eraseAll() {
    this.service.dropAllReminder();
    this.service.dropAllSheduler();
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

  formatDate(date) {
    return moment(date).format('DD/MM/yyyy');
  }

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
        resultFomated += resultFomated === '' ? 'Fri' : ', Fri';
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

  setExpandableTableContent(value) {
    this.expandeTableContent = value;
  }

  createRow(row)  {
    return (
      <TableRow key={row.id}>
        <TableCell component="th" scope="row">
          {row.title}
        </TableCell>
        <TableCell component="th" scope="row">
          {row.message_notification}
        </TableCell>
        <TableCell component="th" align="center" scope="row">
          {this.formatDate(row.startAt)} {row.timeStartAt} ?? {this.formatDate(row.endAt)} {row.timeEndAt}
        </TableCell>
        <TableCell align="center">
          {row.interval}
        </TableCell>
        <TableCell align="center">
          {this.formatWeekDays(row)}
        </TableCell>
        <TableCell align="right">
          <Button className='buttonSecondary' size="small" onClick={() => this.deleteItem(row.id)} color="dark">delete</Button>
        </TableCell>
      </TableRow>
    )
  }

  render() {
    return (
      <>
        <Jumbotron>
          <h1>My reminders</h1>
          <p>
            You have {this.state.rows.length} reminders.

            <Button className="float-right buttonActionColor" size="small" variant="contained" onClick={() => this.eraseAll()}>Delete All</Button>
          </p>

          <TableContainer component={Paper}>
            <Table className={this.classes.table} size="small" aria-label="a dense table">
              <TableHead>
                <TableRow>
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
                      Interval
                    </TableCell> 
                    <TableCell component="th" align="center" scope="row">
                      Days to reminder
                    </TableCell> 
                    <TableCell component="th" align="left" scope="row">
                    </TableCell>
                  </TableRow>
              </TableHead>
              <TableBody>
                {this.state.rows.map((row) => (
                  this.createRow(row)
                ))}
              </TableBody>
            </Table>
          </TableContainer>
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