import {default as AllBikes} from '../Components/Bikes/bikes';
import Modal from "../UI/Modal/modal";
import {useRef, useState} from "react";
import styles from './fileInput.module.scss';
import {connect} from "react-redux";
import axios from "axios";
import FormData from 'form-data';

const Bikes = props => {

    //post review modal

    const [modalOpen, setModalOpen] = useState(false);
    const [error, setError] = useState('');
    const [filename, setFilename] = useState('Select file');

    let nameInput = useRef(null);
    let colorInput = useRef(null);
    let locationInput = useRef(null);
    let imageInput = useRef(null);

    const postBike = () => {
        if (nameInput.value.trim().length === 0 || colorInput.value.trim().length === 0 || locationInput.value.trim().length === 0) {
            setError('Enter all the fields');
        } else if (imageInput.value === '') {
            setError('Please select an image.');
        } else {
            const data = new FormData();
            data.set('model', nameInput.value);
            data.set('color', colorInput.value);
            data.set('location', locationInput.value);
            data.set('image', imageInput.files[0]);

            axios.post('http://localhost:8080/bike', data, {
                headers: {
                    Authorization: props.token,
                    'Content-Type': `multipart/form-data; boundary=${data._boundary}`
                }
            })
                .then(res => {
                    setError(res.data.message);
                    if (res.data.message === 'Bike added successfully!') {
                        window.location.reload();
                    }
                })
                .catch(err => {
                    setError(err.response.data.message);
                })
        }
    }

    return (
        <div className='withWidth'>

            {(props.isAuth && props.role === 'Manager') ? (
                <Modal modalOpen={modalOpen} setModalOpen={setModalOpen}>
                    <h2>Add Bike</h2>
                    <input ref={el => nameInput = el} placeholder='Bike Model' type='text'/>

                    <input ref={el => colorInput = el} placeholder='Bike color' type='text'/>

                    <input ref={el => locationInput = el} placeholder='Location' type='text'/>

                    <label className={styles.file}>
                        <input ref={el => imageInput = el} onChange={event => {
                            setFilename(event.target.files[0].name)
                        }} multiple={false} type="file" accept='.jpg,.jpeg,.png' required/>
                        <span className={styles.fileCustom}> {filename} </span>
                    </label>

                    <h3 className={styles.error}
                        style={{color: error === 'Bike added successfully!' ? 'green' : 'red'}}>{error}</h3>
                    <button onClick={postBike}>Submit</button>
                </Modal>
            ) : null}


            <div>
                <div style={{display: 'flex', justifyContent: 'space-between'}}>
                    <h1 style={{margin: '1rem 0', fontWeight: 900}}>Our Bikes</h1>
                    {(props.isAuth && props.role === 'Manager') ? (
                        <button className={styles.submit} onClick={() => setModalOpen(true)}>Add Bike</button>
                    ) : null}
                </div>
                <AllBikes/>
            </div>
        </div>
    )
}

const mapStateToProps = state => {
    return {
        isAuth: state.auth.isAuthenticated,
        email: state.auth.email,
        role: state.auth.role,
        token: state.auth.token
    }
}

export default connect(mapStateToProps)(Bikes);