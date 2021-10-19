import { GoogleLogin } from 'react-google-login';
import cookies from 'js-cookie';
import classes from './Google.module.css';
import Router from 'next/router';
import { useState, useEffect } from 'react';

const Google = (props) => {
  const [error, setError] = useState(null);

  useEffect(() => {
    const cookie = cookies.get('auth');
    if (cookie) {
      Router.push('/');
    }
  }, []);
  const responseGoogle = (response) => {
    if (response.googleId === '105107137800913112561') {
      setError(null);
      cookies.set('auth', response.googleId);
      Router.push('/');
    } else {
      setError('Vui lòng đăng nhập đúng tài khoản');
    }
  };

  return (
    <div className={classes['text-center']}>
      <h2>Quản lý hàng hoá</h2>
      <GoogleLogin
        clientId="41977367140-6kq6mvjkeb38f452qa92b5188c6fs5nc.apps.googleusercontent.com"
        buttonText="Đăng nhập bằng Google"
        onSuccess={responseGoogle}
        onFailure={responseGoogle}
        cookiePolicy={'single_host_origin'}
      />
      <br />
      {error && <p className={classes.error}>{error}</p>}
    </div>
  );
};

export default Google;