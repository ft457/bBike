import {connect} from "react-redux";

import styles from './bikes.module.scss';
import Bike from "../../../UI/Bike/bike.js";

const Bikes = props => {
    return (
        <div className={styles.bikes}>
            <h3>Some of our</h3>
            <h2>Famous Bikes</h2>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod <br/>tempor incididunt
                consectetur adipiscing elit.</p>

            <div className={styles.allBikes}>
                {props.bikes.slice(0, 3).map(bike => {
                    return (<Bike key={bike._id} id={bike._id} model={bike.model} rating={bike.rating} available={bike.available}
                                  totalReviews={bike.reviews.length} img={bike.imageUrl.replace('\\', '/')}/>)
                })}
            </div>
        </div>
    )
}

const mapStateToProps = state => {
    return {
        bikes: state.bike.bikes,
        error: state.bike.error
    }
}

export default connect(mapStateToProps)(Bikes);