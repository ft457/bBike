import {default as SignupPage} from "../Components/Signup/signup";
import axios from "axios";
import {connect} from "react-redux";
import * as actionTypes from "../store/actions/actionTypes";
import {fetchBikes} from "../store/actions/bike";
import {useState} from "react";

const Signup = (props) => {

    //signup modal

    const [error, setError] = useState('');

    const onSignup = (name, email, password, checked) => {

        if(!checked){
            setError('Accept terms & condition')
        }
        else if(name.length === 0){
            setError("Name can't be empty");
        }
        else if(!validateEmail(email)){
            setError("Enter a valid email");
        }
        else if(password.length < 5){
            setError("Password must be 5 characters long!");
        }
        else {
            axios.post('http://localhost:8080/signup', {name: name, email: email, password: password})
                .then(res => {
                    setError(res.data.message);
                })
                .catch(err => {
                    setError(err.response.data.message);
                })
        }
    }

    const validateEmail = (email) => {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    return(
        <div className='withWidth'>
            <SignupPage onSignup={onSignup} error={error} />
        </div>
    )
}

const mapDispatchToProps = dispatch => {
    return{
        onFetchBikes: () => dispatch(fetchBikes()),
        onSignin: (email, role, id, token) => dispatch({type: actionTypes.SUCCESS_SIGNIN, email: email, role: role, userId: id, token: token})
    }
}

export default connect(null, mapDispatchToProps)(Signup);
