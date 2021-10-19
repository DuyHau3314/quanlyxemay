import Google from '../GoogleLogin/GoogleLogin';
import { Switch, Route, Redirect } from 'react-router';
import cookies from 'js-cookie';
import { useState, useEffect } from 'react';
import { withRouter } from 'react-router';
import Authed from '../Authed/Authed';
import ChiTietCoKhi from '../Cokhi/ChiTietCoKhi';

const Layout = (props) => {
  useEffect(() => {
    const cookie = cookies.get('auth');
    if (!cookie) {
      props.history.push('/dang-nhap');
    }

    if (cookie && props.history.location === '/dang-nhap') {
      props.history.push('/');
    }
  }, []);

  return (
    <Switch>
      <Route exact path="/">
        <Authed />
      </Route>
      <Route path="/cokhi/:name">
        <ChiTietCoKhi />
      </Route>
      <Route path="/dang-nhap">
        <Google />
      </Route>
      <Google />
    </Switch>
  );
};

export default withRouter(Layout);
