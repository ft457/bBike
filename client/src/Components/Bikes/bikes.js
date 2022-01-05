import styles from './bikes.module.scss';
import Bike from "../../UI/Bike/bike.js";

const Bikes = props => {

    return (
        <div style={{minHeight: '90vh'}}>
            {props.bikes.length === 0 ?
                <p style={{margin: '2rem 0 0 0', textAlign: 'center'}}>No Bikes</p> : null}
            <div className={styles.bikes}>
                {props.bikes.map(bike => {
                    return (<Bike key={bike._id} id={bike._id} model={bike.model} rating={bike.rating} available={bike.available}
                                  totalReviews={bike.reviews.length} img={bike.imageUrl.replace('\\', '/')}/>)
                })}
            </div>
        </div>
    )
}

export default Bikes;