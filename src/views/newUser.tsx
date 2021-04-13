import React, { useState } from 'react';
import { Container } from 'react-bootstrap';
import { CONST } from '../commons/labels';
import { newUser } from '../services/userService';

export default function NewUserPage(props:any) {
  const [state, setState] = useState({
    userName: '',
    email: '',
    password: '',
    confirmPassword: '',
    isFetching: false,
    error: ''
  });
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    setState( oldState =>({
      ...oldState,
      isFetching: true
    }));

    e.preventDefault();

    try{
      await newUser({
        name: state.userName,
        email: state.email,
        password: state.password
      });
      window.location.href = CONST.PATH.SIGN_IN;
    }catch(err){
      setState(ov=>({
        ...ov,
        error: err.message}));
    }
    setState( oldState =>({
      ...oldState,
      isFetching: false
    }));
  };

  const handleChangeValueField = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {id, value} = e.target;
    setState( oldState =>({
      ...oldState,
      [id]: value,
      error: ''
    }));
    if(state.password && state.confirmPassword &&
      state.password !== state.confirmPassword){
      setState(ov=>({
        ...ov,
        error: 'Enter the same password'}));
    }
  }

  return(
    <Container className="col-12 col-md-6 mt-2 p-4">
      <h2 className="mb-4">Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group text-left">
          <label>Your Name</label>
          <input type="userName" 
                 className="form-control" 
                 id="userName" 
                 onChange={handleChangeValueField}
                 placeholder="Enter your name" required/>
        </div>
        <div className="form-group text-left">
          <label>Email</label>
          <input type="email" 
                 className="form-control" 
                 id="email"
                 onChange={handleChangeValueField} 
                 placeholder="Enter your email" required/>
        </div>
        <div className="form-group text-left">
          <label >Password</label>
          <input type="password" 
              className="form-control" 
              id="password"
              onChange={handleChangeValueField} 
              placeholder="Password" required/>
        </div>
        <div className="form-group text-left mb-4">
          <label>Confirm your new Password</label>
          <input type="password" 
              className="form-control" 
              id="confirmPassword"
              onChange={handleChangeValueField} 
              placeholder="Confirm Password" required/>
        </div>

        {state.error &&
          <p style={{
            border: '1px solid #e76f51', color: '#e76f51', padding: '5px 10px',
            backgroundColor: '#f8edeb', borderRadius: '5px'}}>
              {state.error}
          </p>
        }

        <button type="submit" className="btn btn-dark mt-1 pr-5 pl-5"
          disabled={state.isFetching} style={{width: '100%'}}>
          {state.isFetching ? 'Please, wait...' : 'Register'}
        </button>

        <div className="mt-4">Already registered? <a href="/signIn">Click here</a></div>
      </form>
    </Container>
  );
}