import {useEffect, useState} from "react";
import {default as SingleRestaurant} from '../Components/Bike/bike';
import axios from "axios";
import {useParams} from "react-router";

const Bike = props => {

    const params = useParams();

    // get a restaurant and its reviews

    const [bike, setBike] = useState({});
    const [reviews, setReviews] = useState([]);

    useEffect(()=>{
        axios.get('http://localhost:8080/bike/' + params.bikeId)
            .then(res=>{
                setBike(res.data);
            })
            .catch(err => {
                console.log(err);
            });

        axios.get('http://localhost:8080/reviews/' + params.bikeId)
            .then(res=>{
                setReviews(res.data);
            })
            .catch(err => {
                console.log(err);
            });
    }, [params.bikeId])

    return(
        <div className='withWidth'>
            <SingleRestaurant bike={bike} reviews={reviews} {...props} />
        </div>
    )
}

export default Bike;