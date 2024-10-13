import logo from "/logo/vite.svg";
import "../styles/components/Style-NavBar.scss";
import { ConnectButton } from '@mysten/dapp-kit';
import { Link } from "react-router-dom";
import '@mysten/dapp-kit/dist/index.css';

function NavBar() {
  return (
      <nav className="navbar">
        <div className="navbar-brand">
          <a className="navbar-item" href="/">
            <img src={logo} alt="Logo"/>
          </a>
        </div>
        <div className="navbar-menu">
          <Link to="/" className="navbar-item">
            Home
          </Link>
          <Link to="/about" className="navbar-item">
            About
          </Link>
          <Link to="/user" className="navbar-item">
            User
          </Link>
          <ConnectButton/>
        </div>
      </nav>
  );
}

export default NavBar;