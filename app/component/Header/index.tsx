import { Link, useLocation } from '@remix-run/react';
import styles from './header.module.scss';
import { User, signOut } from 'firebase/auth';
import { auth } from '~/lib/firebase';
import { usePageMarkerState } from '~/store/pageMarker';

const Header = ({ user }: { user: User | null }) => {
  const { pathname } = useLocation();
  const { reset } = usePageMarkerState();

  return (
    <header className={styles.header}>
      <h1>
        <Link to="/">blog</Link>
      </h1>
      <nav className={styles.nav}>
        {!user && !pathname.includes('login') && (
          <ul>
            <li>
              <Link to="/login" onClick={() => reset()}>
                <button>login</button>
              </Link>
            </li>
          </ul>
        )}
        {user && (
          <ul>
            <li>
              <Link to="/edit" onClick={() => reset()}>
                <button>edit</button>
              </Link>
            </li>
            <li>
              <Link to="/mypage" state={{ uid: user.uid }} onClick={() => reset()}>
                <button>mypage</button>
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
