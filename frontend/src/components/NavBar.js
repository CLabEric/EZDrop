import { Link } from 'react-router-dom'

const NavBar = () => {
    return ( 
        <header className="navBar">
            <Link to="/">Home</Link>
            <div>Drop Shop</div>
            <Link to="/login">Login</Link>
        </header>
    );
}
 
export default NavBar;