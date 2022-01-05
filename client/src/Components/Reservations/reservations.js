import styles from './reservations.module.scss';
import {Link} from "react-router-dom";

const Reservations = props => {

    return(
        <div className={styles.reservations}>
            <table className={styles.users}>
                <thead>
                <tr>
                    <th>Sr.</th>
                    <th>Reserved By</th>
                    <th>Bike</th>
                    <th>Reserved From</th>
                    <th>Reserved To</th>
                </tr>
                </thead>
                <tbody>

                {props.reservations.map((reservation, index) => {
                    return (
                        <tr key={reservation._id}>
                            <td><p>{index+1}</p></td>
                            <td><p>{reservation.name}</p></td>
                            <td><Link to={'/bikes/' + reservation.reservedBike}>{reservation.model}</Link></td>
                            <td><p>{reservation.reservedFrom}</p></td>
                            <td><p>{reservation.reservedTo}</p></td>
                        </tr>
                    )
                })}

                </tbody>

            </table>
        </div>
    )
}

export default Reservations;