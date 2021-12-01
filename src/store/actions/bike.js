import * as actionTypes from './actionTypes';
import axios from "axios";

export const fetchBikes = () => {
    return dispatch => {
        axios.get('http://localhost:8080/bikes')
            .then(response => {

                dispatch({
                    type: actionTypes.FETCH_BIKES_SUCCESS,
                    bikes: response.data
                });
            })
    }
}