import * as actionTypes from './actionTypes';
import axios from "axios";

const compare = ( a, b ) => {
    if ( a.rating < b.rating ){
        return -1;
    }
    if ( a.rating > b.rating ){
        return 1;
    }
    return 0;
}

export const fetchBikes = () => {
    return dispatch => {
        axios.get('http://localhost:8080/bikes')
            .then(response => {

                const bikes = response.data;

                dispatch({
                    type: actionTypes.FETCH_BIKES_SUCCESS,
                    bikes: bikes.sort(compare).reverse()
                });
            })
    }
}