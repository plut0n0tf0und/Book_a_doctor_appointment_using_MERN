import React, { useState } from 'react'
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { message } from 'antd';
import p2 from "../../p2.jpg";
import { Button, Form } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import {
  MDBContainer,
  MDBCard,
  MDBCardBody,
  MDBCardImage,
  MDBRow,
  MDBCol,
  MDBInput,
  MDBRadio,
} from 'mdb-react-ui-kit';
import axios from 'axios';

const Register = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    fullName: 'eg:Mother Fuucer', email: '', password: '', phone: '', type: ''
  });

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:8001/api/user/register', user);
      if (res.data.success) {
        message.success('Registered Successfully');
        navigate("./Components/common/Login");
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      console.log(error);
      message.error('Something went wrong');
    }
  };

  return (
    <>
      <Navbar expand="lg" className="bg-body-tertiary">
        <Container fluid>
          <Navbar.Brand>
            <Link to={'/'}>MediCareBook</Link>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="navbarScroll" />
          <Navbar.Collapse id="navbarScroll">
            <Nav className="me-auto my-2 my-lg-0" style={{ maxHeight: '100px' }} navbarScroll />
            <Nav>
              <Link to={'/'}>Home</Link>
              <Link to={'/login'}>Login</Link>
              <Link to={'/register'}>Register</Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <MDBContainer className="my-5">
        <MDBCard style={{ border: 'none' }}>
          <MDBRow style={{ background: 'rgb(190, 203, 203)' }} className='g-0 border-none p-3'>
            <MDBCol md='6'>
              <MDBCardBody className='d-flex mx-3 flex-column'>
                <div className='d-flex flex-row mb-2'>
                  <span className="h1 text-center fw-bold">Sign up to your account</span>
                </div>
                <div className="p-2">
                  <Form onSubmit={handleSubmit}>
                    <label className="my-1 form-label" htmlFor="fullName">Full name</label>
                    <MDBInput style={{ height: '40px' }} name='fullName' value={user.fullName} onChange={handleChange} id='fullName' type='text' size="sm" />
                    
                    <label className="my-1 form-label" htmlFor="email">Email</label>
                    <MDBInput style={{ height: '40px' }} name='email' value={user.email} onChange={handleChange} id='email' type='email' size="sm" />
                    
                    <label className="my-1 form-label" htmlFor="password">Password</label>
                    <MDBInput style={{ height: '40px' }} name='password' value={user.password} onChange={handleChange} id='password' type='password' size="sm" />
                    
                    <label className="my-1 form-label" htmlFor="phone">Phone</label>
                    <MDBInput style={{ height: '40px' }} name='phone' value={user.phone} onChange={handleChange} id='phone' type='text' size="sm" />

                    <Container className='my-3'>
                      <MDBRadio
                        name='type'
                        id='adminRadio'
                        checked={user.type === 'admin'}
                        value='admin'
                        onChange={handleChange}
                        label='Admin'
                        inline
                      />
                      <MDBRadio
                        name='type'
                        id='userRadio'
                        checked={user.type === 'user'}
                        value='user'
                        onChange={handleChange}
                        label='User'
                        inline
                      />
                    </Container>

                    <Button style={{ marginTop: '20px' }} className="mb-4 bg-dark" variant='dark' size='lg' type="submit">Register</Button>
                  </Form>
                  <p className="mb-5 pb-md-2" style={{ color: '#393f81' }}>
                    Have an account? <Link to={'/login'} style={{ color: '#393f81' }}>Login here</Link>
                  </p>
                </div>
              </MDBCardBody>
            </MDBCol>

            <MDBCol md='6'>
              <MDBCardImage style={{ mixBlendMode: 'darken' }} src={p2} alt="login form" className='rounded-start w-100' />
            </MDBCol>
          </MDBRow>
        </MDBCard>
      </MDBContainer>
    </>
  );
};

export default Register;
