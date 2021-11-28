import * as actionTypes from '../actions/actionTypes';

const initialState = {
    bikes: []
};

const reducer = (state = initialState, action) => {
    switch (action.type){
        case actionTypes.FETCH_BIKES_SUCCESS:
            return {
                bikes: action.bikes
            }
        default:
            return state;
    }
}

export default reducer;