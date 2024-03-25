import { Link, useLocation } from '@remix-run/react';
import styles from './header.module.scss';
import { User, signOut } from 'firebase/auth';
import { auth } from '~/lib/firebase';

const Header = ({ user }: { user: User | null }) => {
  const { pathname } = useLocation();

  return (
    <header className={styles.header}>
      <h1>
        <Link to="/">blog</Link>
      </h1>
      <nav className={styles.nav}>
        {!user && !pathname.includes('login') && (
          <ul>
            <li>
              <Link to="/login">
                <button>login</button>
              </Link>
            </li>
          </ul>
        )}
        {user && (
          <ul>
            <li>
              <Link to="/edit">
                <button>edit</button>
              </Link>
            </li>
            <li>
              <button onClick={() => signOut(auth)}>logout</button>
            </li>
          </ul>
        )}
      </nav>
    </header>
  );
};

export default Header;
