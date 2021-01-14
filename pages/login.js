import React from 'react';
import Container from '@material-ui/core/Container';
import Headerbar from '../src/components/Headerbar';
import LoginForm from '../src/components/Form/login';
import styles from '../styles/Login.module.css';

const Login = () => {
  return (
    <div>
      <Headerbar />
      <Container className={styles.container}>
        <LoginForm />
      </Container>
    </div>
  )
};

export default Login;
