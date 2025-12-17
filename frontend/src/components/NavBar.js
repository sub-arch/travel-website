import { Link, useLocation } from 'react-router-dom';

const NavBar = ({ token, onLogout }) => {
  const location = useLocation();

  return (
    <header className="nav-bar">
      <div className="brand">Smart Travel Planner</div>
      <nav>
        {token ? (
          <>
            <Link className={location.pathname === '/' ? 'active' : ''} to="/">
              Destinations
            </Link>
            <Link className={location.pathname === '/favorites' ? 'active' : ''} to="/favorites">
              Favorites
            </Link>
            <button className="link-button" onClick={onLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link className={location.pathname === '/login' ? 'active' : ''} to="/login">
              Login
            </Link>
            <Link className={location.pathname === '/register' ? 'active' : ''} to="/register">
              Register
            </Link>
          </>
        )}
      </nav>
    </header>
  );
};

export default NavBar;


