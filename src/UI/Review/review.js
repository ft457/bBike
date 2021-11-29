import styles from './review.module.scss';
import {connect} from "react-redux";
import {Fragment, useRef, useState} from "react";
import axios from "axios";
import {fetchBikes} from "../../store/actions/bike";
import Modal from "../Modal/modal";
import fileStyle from "../../pages/fileInput.module.scss";

const Review = props => {

    //edit review popup
    const [modalOpen, setModalOpen] = useState(false);
    const [error, setError] = useState('');
    let feedback = useRef(null);

    const editReview = () => {
        if(feedback.value.length === 0){
            setError('Enter the feedback.')
        }
        else {
            axios.put('http://localhost:8080/review/' + props.id, {comment: feedback.value},{headers: {Authorization: props.token}})
                .then(res => {
                    setError(res.data.message);
                    if (res.data.message === 'Review edited successfully!') {
                        props.onFetchBikes();
                        window.location.reload();
                    }
                })
                .catch(err => {
                    setError(err.response.data.message);
                })
        }
    }

    //delete review

    const deleteReview = () => {
        if(props.isAuth && props.role === 'Manager'){
            axios.delete('http://localhost:8080/review/' + props.id, {headers: {Authorization: props.token}})
                .then(res => {
                    props.onFetchBikes()
                    window.location.reload();
                })
                .catch(err=> {
                    console.log(err.response);
                })
        }
    }

    let stars = props.stars ? parseInt(props.stars) : 0;

    return(
        <Fragment>

            <Modal modalOpen={modalOpen} setModalOpen={setModalOpen}>
                <h2>Edit Review</h2>
                <br />
                <textarea ref={el => feedback = el} placeholder='Leave your feedback' type='text'/>
                <h3 className={fileStyle.error}
                    style={{color: error === 'Review edited successfully!' ? 'green' : 'red'}}>{error}</h3>
                <button onClick={editReview}>Submit</button>
            </Modal>

            <div className={styles.review}>
                <div className={styles.top}>
                    <div className={styles.image}>
                        <img src={process.env.PUBLIC_URL + '/review.png'} alt='Review' />
                    </div>
                    <div className={styles.name}>
                        <h2>{props.name}</h2>
                        <p>Visited on: {props.date}</p>
                    </div>
                </div>
                <p className={styles.comment}>{props.comment}</p>
                <p className={styles.stars}>
                    {
                        [...Array(stars)].map(()=>(
                            <span key={Math.random()}><i className="fas fa-star" /></span>
                        ))
                    }

                    {
                        [...Array(5 - stars)].map(()=>(
                            <span key={Math.random()}><i className="far fa-star" /></span>
                        ))
                    }
                </p>


                {(props.isAuth && props.role === 'Manager') ? (
                    <div className={styles.bottomLinks}>
                        <p onClick={() => setModalOpen(true)}>Edit</p>
                        <p onClick={deleteReview}>Delete</p>
                    </div>
                ) : null}
            </div>
        </Fragment>
    )
}

const mapStateToProps = state => {
    return{
        isAuth: state.auth.isAuthenticated,
        email: state.auth.email,
        role: state.auth.role,
        token: state.auth.token
    }
}

const mapDispatchToProps = dispatch => {
    return{
        onFetchBikes: () => dispatch(fetchBikes())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Review);