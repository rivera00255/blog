import { Link, useLocation } from '@remix-run/react';
import styles from './header.module.scss';

const Header = () => {
  const { pathname } = useLocation();

  return (
    <header className={styles.header}>
      <h1>
        <Link to="/">blog</Link>
      </h1>
      {!pathname.includes('login') && (
        <div className={styles.menu}>
          <Link to="/login">
            <button>login</button>
          </Link>
        </div>
      )}
    </header>
  );
};

export default Header;
