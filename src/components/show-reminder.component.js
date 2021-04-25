import React, { Component } from 'react';
import { Jumbotron } from 'react-bootstrap';
import { Link } from "react-router-dom";
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import '../App.css';
import Logo from '../assets/icon.png'; 

const ipc = window.require('electron').ipcRenderer



class ShowReminder extends Component {

  createData(name, calories, fat, carbs, protein) {
    return { name, calories, fat, carbs, protein };
  }

  rows = [
    this.createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
    this.createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
    this.createData('Eclair', 262, 16.0, 24, 6.0),
    this.createData('Cupcake', 305, 3.7, 67, 4.3),
    this.createData('Gingerbread', 356, 16.0, 49, 3.9), this.createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
    this.createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
    this.createData('Eclair', 262, 16.0, 24, 6.0),
    this.createData('Cupcake', 305, 3.7, 67, 4.3),
    this.createData('Gingerbread', 356, 16.0, 49, 3.9), this.createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
    this.createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
    this.createData('Eclair', 262, 16.0, 24, 6.0),
    this.createData('Cupcake', 305, 3.7, 67, 4.3),
    this.createData('Gingerbread', 356, 16.0, 49, 3.9), this.createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
    this.createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
    this.createData('Eclair', 262, 16.0, 24, 6.0),
    this.createData('Cupcake', 305, 3.7, 67, 4.3),
    this.createData('Gingerbread', 356, 16.0, 49, 3.9), this.createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
    this.createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
    this.createData('Eclair', 262, 16.0, 24, 6.0),
    this.createData('Cupcake', 305, 3.7, 67, 4.3),
    this.createData('Gingerbread', 356, 16.0, 49, 3.9), this.createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
    this.createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
    this.createData('Eclair', 262, 16.0, 24, 6.0),
    this.createData('Cupcake', 305, 3.7, 67, 4.3),
    this.createData('Gingerbread', 356, 16.0, 49, 3.9), this.createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
    this.createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
    this.createData('Eclair', 262, 16.0, 24, 6.0),
    this.createData('Cupcake', 305, 3.7, 67, 4.3),
    this.createData('Gingerbread', 356, 16.0, 49, 3.9), this.createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
    this.createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
    this.createData('Eclair', 262, 16.0, 24, 6.0),
    this.createData('Cupcake', 305, 3.7, 67, 4.3),
    this.createData('Gingerbread', 356, 16.0, 49, 3.9), this.createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
    this.createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
    this.createData('Eclair', 262, 16.0, 24, 6.0),
    this.createData('Cupcake', 305, 3.7, 67, 4.3),
    this.createData('Gingerbread', 356, 16.0, 49, 3.9), this.createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
    this.createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
    this.createData('Eclair', 262, 16.0, 24, 6.0),
    this.createData('Cupcake', 305, 3.7, 67, 4.3),
    this.createData('Gingerbread', 356, 16.0, 49, 3.9), this.createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
    this.createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
    this.createData('Eclair', 262, 16.0, 24, 6.0),
    this.createData('Cupcake', 305, 3.7, 67, 4.3),
    this.createData('Gingerbread', 356, 16.0, 49, 3.9), this.createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
    this.createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
    this.createData('Eclair', 262, 16.0, 24, 6.0),
    this.createData('Cupcake', 305, 3.7, 67, 4.3),
    this.createData('Gingerbread', 356, 16.0, 49, 3.9), this.createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
    this.createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
    this.createData('Eclair', 262, 16.0, 24, 6.0),
    this.createData('Cupcake', 305, 3.7, 67, 4.3),
    this.createData('Gingerbread', 356, 16.0, 49, 3.9), this.createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
    this.createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
    this.createData('Eclair', 262, 16.0, 24, 6.0),
    this.createData('Cupcake', 305, 3.7, 67, 4.3),
    this.createData('Gingerbread', 356, 16.0, 49, 3.9), this.createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
    this.createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
    this.createData('Eclair', 262, 16.0, 24, 6.0),
    this.createData('Cupcake', 305, 3.7, 67, 4.3),
    this.createData('Gingerbread', 356, 16.0, 49, 3.9), this.createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
    this.createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
    this.createData('Eclair', 262, 16.0, 24, 6.0),
    this.createData('Cupcake', 305, 3.7, 67, 4.3),
    this.createData('Gingerbread', 356, 16.0, 49, 3.9), this.createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
    this.createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
    this.createData('Eclair', 262, 16.0, 24, 6.0),
    this.createData('Cupcake', 305, 3.7, 67, 4.3),
    this.createData('Gingerbread', 356, 16.0, 49, 3.9), this.createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
    this.createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
    this.createData('Eclair', 262, 16.0, 24, 6.0),
    this.createData('Cupcake', 305, 3.7, 67, 4.3),
    this.createData('Gingerbread', 356, 16.0, 49, 3.9), this.createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
    this.createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
    this.createData('Eclair', 262, 16.0, 24, 6.0),
    this.createData('Cupcake', 305, 3.7, 67, 4.3),
    this.createData('Gingerbread', 356, 16.0, 49, 3.9),
  ];

  classes = makeStyles({
    table: {
      minWidth: 650,
    },
  });

  render() {
    return (
      <>
        <Jumbotron>
          <h1>
          <img width="7%" height="auto" className="img-responsive" src={Logo}  alt="logo" />
          &ensp;My reminders
          </h1>
          <p>
            You have 35 reminders.
            <Link style={{ marginLeft: 20 }} to="/">
              <Button size="small" color="secondary">Back</Button>
            </Link>
          </p>

          <TableContainer component={Paper}>
            <Table className={this.classes.table} size="small" aria-label="a dense table">
              <TableHead>
                <TableRow>
                  <TableCell>Dessert (100g serving)</TableCell>
                  <TableCell align="right">Calories</TableCell>
                  <TableCell align="right">Fat&nbsp;(g)</TableCell>
                  <TableCell align="right">Carbs&nbsp;(g)</TableCell>
                  <TableCell align="right">Protein&nbsp;(g)</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {this.rows.map((row) => (
                  <TableRow key={row.name}>
                    <TableCell component="th" scope="row">
                      {row.name}
                    </TableCell>
                    <TableCell align="right">{row.calories}</TableCell>
                    <TableCell align="right">{row.fat}</TableCell>
                    <TableCell align="right">{row.carbs}</TableCell>
                    <TableCell align="right">{row.protein}</TableCell>
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
      </>
    );
  }

}

export default ShowReminder;