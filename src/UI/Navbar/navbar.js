import {Link} from "react-router-dom";
import styles from './navbar.module.scss';
import {connect} from "react-redux";
import * as actionTypes from "../../store/actions/actionTypes";
import {useState} from "react";

const Navbar = props => {

    const [nav, setNav] = useState(false);

    return (
        <div className='withWidth'>
            <div className={styles.navbar}>
                <h1><Link to='/'>Bikes</Link></h1>

                <span style={{position: nav ? 'fixed' : 'static'}} className={styles.bars}
                      onClick={() => setNav(prevState => !prevState)}> <i className="fas fa-bars"/> </span>

                <ul style={{left: nav ? '0' : '-100%'}}>
                    <li onClick={() => setNav(false)}>
                        <Link to='/'>Home</Link>
                    </li>
                    <li onClick={() => setNav(false)}>
                        <Link to='/bikes'>Bikes</Link>
                    </li>

                    {(props.isAuth && props.role === 'Manager') ? (
                        <li onClick={() => setNav(false)}>
                            <Link to='/users'>Users</Link>
                        </li>
                    ) : null}

                    {(props.isAuth) ? (
                        <li onClick={() => setNav(false)}>
                            <Link to='/reservations'>Reservations</Link>
                        </li>
                    ) : null}

                    <li onClick={() => setNav(false)}>
                        <Link to='/'>Contact</Link>
                    </li>

                    <li onClick={() => setNav(false)} className={styles.auth}>
                        {props.isAuth ? (
                            <p onClick={() => {
                                props.onSignout();
                                window.location.replace('/signin');
                            }}>Signout</p>
                        ) : (
                            <Link to='/signin'>Signin</Link>
                        )}
                    </li>
                </ul>

            </div>
        </div>
    )
}

const mapStateToProps = state => {
    return {
        isAuth: state.auth.isAuthenticated,
        userId: state.auth.userId,
        email: state.auth.email,
        role: state.auth.role,
        token: state.auth.token,
        bikes: state.bike.bikes
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onSignout: () => dispatch({type: actionTypes.SUCCESS_SIGNOUT})
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Navbar);