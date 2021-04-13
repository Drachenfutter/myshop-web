import React, { useState } from 'react';
import { Container } from 'react-bootstrap';
import { CONST } from '../commons/labels';
import { User } from '../entity/user';
import { login } from '../services/userService';

export default function LoginPage(props:any) {
  const [state, setState] = useState({
    email: '',
    password: '',
    isFetching: false,
    error: ''
  });
  
  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    setState( oldState =>({
      ...oldState,
      isFetching: true
    }));
    e.preventDefault();
    try{
      const result: User = await login({email: state.email, password: state.password});
      props.setUser(result);
      if(!result.emailConfirmedAt){
        window.location.href = CONST.PATH.SEND_EMAIL;
      }
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
  }

  return(
    <Container className="col-12 col-md-6 mt-2 p-4">
      <h2 className="mb-4">Sign In</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group text-left">
          <label htmlFor="exampleInputEmail1">Email</label>
          <input type="email" 
                 className="form-control" 
                 id="email"
                 aria-describedby="emailHelp"
                 onChange={handleChangeValueField} 
                 placeholder="Enter your email" required/>
        </div>
        <div className="form-group text-left">
          <label htmlFor="exampleInputPassword1">Password</label>
          <input type="password" 
              className="form-control" 
              id="password"
              onChange={handleChangeValueField} 
              placeholder="Password" required/>
        </div>
        {state.error && <p style={{
          border: '1px solid #e76f51',
          color: '#e76f51',
          padding: '5px 10px',
          backgroundColor: '#f8edeb',
          borderRadius: '5px'}}>
        {state.error}</p>}
        <button type="submit" className="btn btn-dark mt-1 pr-5 pl-5 "
        disabled={state.isFetching} style={{width: '100%'}}>
          {state.isFetching ? 'Please, wait...' : 'Continue'}
        </button>
        <div className="mt-4">Don't have a registration? <a href="/signUp">Click here</a></div>
      </form>
    </Container>
  );
}