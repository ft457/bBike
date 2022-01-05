import {fetchBikes} from "./store/actions/bike";
import * as actionTypes from "./store/actions/actionTypes";
import {connect} from "react-redux";
import {useEffect} from "react";
import {Route, Routes} from "react-router";

import Index from "./pages/index";
import NotFound from "./pages/notFound";
import Navbar from "./UI/Navbar/navbar";
import Footer from "./UI/Footer/footer";
import Signup from "./pages/signup";
import Signin from "./pages/signin";
import Bikes from "./pages/bikes";
import Bike from "./pages/bike";
import Users from "./pages/users";
import UserReservations from "./pages/userReservations";
import ManagerReservation from "./pages/managerReservation";

const App = props => {

    useEffect(() => {
        if (window.localStorage.getItem('email') && window.localStorage.getItem('role') && window.localStorage.getItem('userId') && window.localStorage.getItem('token')) {
            props.onSignin(window.localStorage.getItem('email'), window.localStorage.getItem('role'), window.localStorage.getItem('userId'), window.localStorage.getItem('token'));
        }
        props.onFetchBikes();
    }, []);

    return (
        <div>

            <Navbar />

            <Routes>
                <Route path='/' exact element={<Index/>} />

                <Route path='/signup' exact element={<Signup />} />

                <Route path='/signin' exact element={<Signin />} />

                <Route path='/bikes' exact element={<Bikes />} />

                <Route path='/bikes/:bikeId' exact element={<Bike />} />

                <Route path='/users' exact element={<Users />} />

                {props.isAuth && props.role === 'User' ?
                    <Route path='/reservations' exact element={<UserReservations />} /> :
                    null
                }

                {props.isAuth && props.role === 'Manager' ?
                    <Route path='/reservations' exact element={<ManagerReservation />} /> :
                    null
                }

                <Route path='*' element={<NotFound />}/>
            </Routes>

            <Footer />
        </div>
    );
}

const mapStateToProps = state => {
    return {
        isAuth: state.auth.isAuthenticated,
        email: state.auth.email,
        role: state.auth.role,
        token: state.auth.token,
        bikes: state.bike.bikes
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onFetchBikes: () => dispatch(fetchBikes()),
        onSignin: (email, role, id, token) => dispatch({
            type: actionTypes.SUCCESS_SIGNIN,
            email: email,
            role: role,
            userId: id,
            token: token
        })
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
