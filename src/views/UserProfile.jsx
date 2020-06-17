/*!

=========================================================
* Light Bootstrap Dashboard React - v1.3.0
=========================================================

* Product Page: https://www.creative-tim.com/product/light-bootstrap-dashboard-react
* Copyright 2019 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/light-bootstrap-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React, { Component } from "react";
import {
  Grid,
  Row,
  Col
} from "react-bootstrap";
import Forminput from 'input-component/input';
import { Card} from "components/Card/Card.jsx";
import { Button,Form } from 'react-bootstrap';
import { FormInputs } from "components/FormInputs/FormInputs.jsx";
import { UserCard } from "components/UserCard/UserCard.jsx";
//import Button from "components/CustomButton/CustomButton.jsx";

import web3 from './../ethereum/web3.js';
import ipfs from './../ipfs';
import healthcare from './../ethereum/healthcare.js';

import avatar from "assets/img/faces/face-3.jpg";

class UserProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state={
      user_id:'',
      ipfsHash:null,
      buffer:'',
      date:'',
      pname:'',
      record_name:'',
      referencingdoctor:''
    }

  };
  CaptureFile =(event) => {

    event.preventDefault()
    const file = event.target.files[0]
    let reader = new window.FileReader()
    reader.readAsArrayBuffer(file)
    reader.onloadend = () => this.convertToBuffer(reader)
  }

 convertToBuffer = async (reader) => {
  //file is converted to a buffer to prepare for uploading to IPFS
    const buffer = await Buffer.from(reader.result);
  //set this buffer -using es6 syntax
    this.setState({buffer});
}
OnSubmit = async (event) => {
  event.preventDefault();

  const accounts = await web3.eth.getAccounts();

  await ipfs.add(this.state.buffer, (err, ipfsHash) => {
  console.log(err,ipfsHash,this.state.user_id);
  this.setState({ ipfsHash:ipfsHash[0].hash });

  var today = new Date();
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  var yyyy = today.getFullYear();

  today = mm + '/' + dd + '/' + yyyy;

  this.setState({date: today.toString()})
  console.log(this.state.date);

  healthcare.methods.addRecord(this.state.user_id , this.state.pname , this.state.record_name , this.state.ipfsHash ,
  this.state.date , this.state.referencingdoctor)
  .send({from: accounts[0] }); //healthcare
  }) //await ipfs.add
 }; //onSubmit
  HandleChange = (event) => {
    this.setState({[event.target.name]:event.target.value})
  }
  render() {
    return (
      <div className="content">
        <Grid fluid>
          <Row>
            <Col md={8}>
              
                  <div>
                  <Form.File
      id="custom-file-translate-scss"
      label="Choose File"
      lang="en"
      onChange={this.CaptureFile}
      custom
    />

      <Forminput
      text="Patient Name"
      type='text'
      placeholder="Enter Patient's name"
      value={this.state.pname}
      handlechange={this.HandleChange}
      name='pname'
      required
        />

      <Forminput
      text="Record Name"
      type='text'
      placeholder='Enter record title'
      value={this.state.record_name}
      handlechange={this.HandleChange}
      name='record_name'
      required
        />

      <Forminput
      text="User ID"
      type='text'
      placeholder='Enter user id'
      value={this.state.user_id}
      handlechange={this.HandleChange}
      name='user_id'
      required
        />

      <Forminput
      text="Doctor ID"
      type='text'
      placeholder='Enter doctor id'
      value={this.state.referencingdoctor}
      handlechange={this.HandleChange}
      name='referencingdoctor'
      required
        />

      <form onSubmit={this.OnSubmit} method="POST">


      <Button
      bsstyle="primary"
      type="submit">
      Send data to patient and doctor
      </Button>
      <br />

    </form>
    </div>

               
            </Col>
            <Col md={4}>
              <UserCard
                bgImage="https://ununsplash.imgix.net/photo-1431578500526-4d9613015464?fit=crop&fm=jpg&h=300&q=75&w=400"
                avatar={avatar}
                name="Mike Andrew"
                userName="michael24"
                description={
                  <span>
                    "Lamborghini Mercy
                    <br />
                    Your chick she so thirsty
                    <br />
                    I'm in that two seat Lambo"
                  </span>
                }
                socials={
                  <div>
                    <Button simple>
                      <i className="fa fa-facebook-square" />
                    </Button>
                    <Button simple>
                      <i className="fa fa-twitter" />
                    </Button>
                    <Button simple>
                      <i className="fa fa-google-plus-square" />
                    </Button>
                  </div>
                }
              />
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}

export default UserProfile;
