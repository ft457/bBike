import styles from "../Components/Bikes/bikes.module.scss";
import Bike from "../UI/Bike/bike";
import {connect} from "react-redux";

const UserReservations = props => {

    const reservations = props.bikes.filter(bike => bike.reservedBy === props.userId);

    return(
        <div className='withWidth'>
            <h1 style={{margin: '1rem 0', fontWeight: 900}}>Your Reservations</h1>

            {reservations.length === 0 ?
                <p style={{margin: '2rem 0 0 0', textAlign: 'center'}}>No Reservation</p> : null}
            <div className={styles.restaurants}>
                {reservations.map(bike => {
                    return (<Bike key={bike._id} id={bike._id} model={bike.model} rating={bike.rating} available={bike.available}
                                  totalReviews={bike.reviews.length} img={bike.imageUrl.replace('\\', '/')}/>)
                })}
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

export default connect(mapStateToProps)(UserReservations);