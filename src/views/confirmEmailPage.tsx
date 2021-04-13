import React, { useEffect, useState } from 'react';
import { Button, Col, Container, Row } from 'react-bootstrap';
import { useHistory, useParams } from 'react-router-dom';
import { CONST } from '../commons/labels';
import { User } from '../entity/user';
import { confirmEmail } from '../services/userService';

export default function ConfirmEmailPage(props: any) {
  const [error, setError] = useState('');
  const [user, setUser] = useState<User>();
  const params: any = useParams();
  const history = useHistory();

  const _confirmEmail = async () => {
    try{
      const user: User = await confirmEmail(params.confirmationCode);
      setUser(user);
    }catch(err){
      setError(err.message);
    }
  };

  const errorBody = () => {
    return (
      <Container className="col-10 col-md-10 mt-4 p-4">
        <h2 className="text-center">Oops, something went wrong</h2>
        <Row className="text-center mt-5 mb-4">
          <h5>The link accessed is not valid.</h5>
        </Row>
        <Row>
          <Col className="col-md-10">
          <Button className="btn btn-info mt-3 align-center" onClick={()=>{history.push("/")}}>
            Go Home
          </Button>
          </Col>
        </Row>
        <Row className="p-3 mt-5 mb-3 col-12">
          {error && <p style={{
            border: '1px solid #e76f51',
            color: '#e76f51',
            padding: '5px 10px',
            backgroundColor: '#f8edeb',
            borderRadius: '5px',
            width: '100%'
          }}>
          {error}</p>}
        </Row>
      </Container>
    );
  };
  
  const okBody = () => {
    return (
      <Container className="col-md-10 mt-4 p-4 align-center">
        <h1 className="text-center">Huh!</h1>
        <Row>
          <Col className="col-12 mt-4">
            <h3 className="text-center">Your account has been successfully activated!</h3>
          </Col>
        </Row>
        <Row>
          <Col className="col-12 mt-4">
          <Button className="btn btn-info mt-3 align-center" onClick={()=>{history.push(CONST.PATH.HOME)}}>
            Go Home
          </Button>
          </Col>
        </Row>
        <Row className="p-3 mt-5 mb-3 col-12">
          {error && <p style={{
            border: '1px solid #e76f51',
            color: '#e76f51',
            padding: '5px 10px',
            backgroundColor: '#f8edeb',
            borderRadius: '5px',
            width: '100%'
          }}>
          {error}</p>}
        </Row>
      </Container>
    );
  };

  useEffect(():void => {
    if(!user && !error){
      _confirmEmail();
    }  
  });

  if(!user && !error){
    return (
      <Container className="col-md-10 mt-4 p-4 align-center">
        <h1 className="text-center">Please wait...</h1>
        <Row>
          <Col className="col-12 mt-4">
            <h3 className="text-center">Your account has been successfully activated!</h3>
          </Col>
        </Row>
      </Container>
    );
  }else{
    if(user){
      return okBody();
    }else{
      return errorBody();
    }
  }

}