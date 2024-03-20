import { Link } from '@remix-run/react';
import './header.css';

const Header = () => {
  return (
    <header className="header">
      <h1>
        <Link to='/'>Blog</Link>
      </h1>
      <div className='menu'>
        <button>SignIn</button>
      </div>
    </header>
  );
}

export default Header;