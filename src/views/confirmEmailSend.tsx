import React, {useEffect, useState } from 'react';
import { Button, Col, Container, Row } from 'react-bootstrap';
import MailOutlineIcon from '@material-ui/icons/MailOutline';
import { isLogged } from '../services/auth';
import { User } from '../entity/user';
import { sendEmailConfirmation } from '../services/userService';
import { useHistory } from 'react-router-dom';
import { CONST } from '../commons/labels';

export default function ConfirmEmailSendPage() {
  const [error, setError] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [emailOk, setEmailOk] = useState(false);
  const history = useHistory();

  useEffect(()=>{
    if(!userEmail && !error){
      const user = isLogged() as User;
      if(user){
        if(user.emailConfirmedAt && user.email){
          history.push(CONST.PATH.HOME);
        }else{
          setUserEmail(user.email);
          setUserName(user.name);
        }
      }else{
        history.push(CONST.PATH.SIGN_IN);
      }
    }
  }, [userEmail, error, history]);

  const handleClick = async () => {
    try{
      await sendEmailConfirmation(userEmail);
      setEmailOk(true);
    }catch(err){
      setError(err.message);
    }
  }

  return (
    <Container className="col-10 mt-4 p-4">
      <h2 className="text-center">Welcome <strong>{userName.split(" ")[0]}</strong>!</h2>
      <Row>
          <Col className="col-12 mt-5">
            <h5 hidden={emailOk}>To use all the features, you need to confirm your email.</h5>
            <h5 hidden={emailOk}> You will receive a confirmation link at:</h5>
            <h4 hidden={emailOk} className="text-center mt-4 mb-3">{userEmail}</h4>
            <h5 hidden={!emailOk}>Email sent o/</h5>
            <h5 hidden={!emailOk}>Check your inbox and spam.</h5>
          </Col>
        </Row>
      <Col className="text-center mt-4 mb-3">
        <Button className="btn btn-info mt-3 align-center" onClick={()=>{emailOk ? history.push("/") : handleClick()}}>
          <MailOutlineIcon className="mr-2" />{emailOk ? 'Go Home' : 'Send the email!'}
        </Button>
      </Col>
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
}