import { Links, Meta, Outlet, Scripts, ScrollRestoration } from '@remix-run/react';
import './reset.css';
import { cssBundleHref } from '@remix-run/css-bundle';
import { useEffect, useState } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { MetaFunction } from '@remix-run/node';
import Header from './component/Header';
import { auth } from './lib/firebase';
import QueryProvider from './lib/QueryProvider';
import Notification from './component/Notification';
import { useNotifyStore } from './store/notify';

export const meta: MetaFunction = () => {
  return [{ title: 'Blog' }, { name: 'Blog', content: 'personal commentary' }];
};

export const links = () => [...(cssBundleHref ? [{ rel: 'stylesheet', href: cssBundleHref }] : [])];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  const [user, setUser] = useState<User | null>(auth.currentUser);
  const { notify } = useNotifyStore();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      user ? setUser(user) : setUser(null);
    });
  }, []);

  return (
    <QueryProvider>
      {notify.message && <Notification message={notify.message} />}
      <Header user={user} />
      <Outlet context={user} />
    </QueryProvider>
  );
}
