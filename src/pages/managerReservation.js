import Reservations from "../Components/Reservations/reservations";
import {useEffect, useState} from "react";
import axios from "axios";
import {connect} from "react-redux";

const ManagerReservation = props => {

    const [reservations, setReservations] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:8080/reservations',{headers: {Authorization: props.token}})
            .then(res => {
                setReservations(res.data);
            })
            .catch(err => {
                console.log(err.response.data.message)
            })
    }, []);

    return(
        <div className='withWidth'>
            <h1 style={{margin: '1rem 0', fontWeight: 900}}>Reservations</h1>
            <Reservations reservations={reservations} />
        </div>
    )
}

const mapStateToProps = state => {
    return{
        isAuth: state.auth.isAuthenticated,
        email: state.auth.email,
        role: state.auth.role,
        userId: state.auth.userId,
        token: state.auth.token
    }
}

export default connect(mapStateToProps)(ManagerReservation);