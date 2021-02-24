import React from 'react';
import Container from '@material-ui/core/Container';
import Headerbar from '@/components/Headerbar';
import LoginForm from '@/components/Form/Login/login';
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
