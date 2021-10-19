import Authed from '../components/Authed/Authed';
import { useEffect } from 'react';
import cookie from 'js-cookie';
import Router from 'next/router';
export default function Home() {
  useEffect(() => {
    if (!cookie.get('auth')) {
      Router.push('/dang-nhap');
    }
  }, []);
  return (
    <div>
      <Authed />
    </div>
  );
}
