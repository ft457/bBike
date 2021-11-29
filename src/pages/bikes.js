import {default as AllBikes} from '../Components/Bikes/bikes';
import Modal from "../UI/Modal/modal";
import {useEffect, useRef, useState} from "react";
import styles from './fileInput.module.scss';
import {connect} from "react-redux";
import axios from "axios";
import FormData from 'form-data';

const Bikes = props => {

    //filters
    const [filterModal, setFilterModal] = useState(false);
    const [filter, setFilter] = useState({models: [], colors: [], locations: []});

    const getModels = () => {
        const models = [];
        const colors = [];
        const locations = [];

        props.bikes.forEach(bike => {
            models.push(bike.model);
            colors.push(bike.color);
            locations.push(bike.location);
        });

        return {models: [...new Set(models)], colors: [...new Set(colors)], locations: [...new Set(locations)]};
    }

    const onCheckboxChange = (event, type, name) => {

        if(event.target.checked){
            setFilter(prevState => {
                if(type === 'Model'){
                    prevState.models.push(name);
                }
                else if(type === 'Color'){
                    prevState.colors.push(name);
                }else {
                    prevState.locations.push(name);
                }
                return prevState;
            })
        }
        else {
            setFilter(prevState => {
                if(type === 'Model'){
                    const index = filter.models ? filter.models.indexOf(name) : -2;
                    if (index > -1) {
                        prevState.models.splice(index, 1);
                    }
                }
                else if(type === 'Color'){
                    const index = filter.colors ? filter.colors.indexOf(name) : -2;
                    if (index > -1) {
                        prevState.colors.splice(index, 1);
                    }
                }else {
                    const index = filter.locations ? filter.locations.indexOf(name) : -2;
                    if (index > -1) {
                        prevState.locations.splice(index, 1);
                    }
                }

                return prevState;
            })
        }
    }

    //post bike modal

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
                        window.location.href = '/bikes/' + res.data.bike._id;
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

            <Modal modalOpen={filterModal} setModalOpen={setFilterModal}>
                <h2>Filters</h2>

                <h3 style={{fontWeight: 'bold', marginTop: '0.6rem'}}>Model</h3>
                <div style={{display: 'flex', flexWrap: 'wrap'}}>
                    {getModels().models.map(model => {
                        return(
                            <div key={model} style={{display: 'flex', alignItems: 'center', height: '50px'}}>
                                <input style={{width: '40px', transform: 'scale(0.6)'}} type='checkbox' onChange={e => onCheckboxChange(e, 'Model', model)}/>
                                <p style={{margin: '0 10px 0 0', fontSize: '14px', color: '#222428'}}>{model}</p>
                            </div>
                        )
                    })}
                </div>

                <h3 style={{fontWeight: 'bold', marginTop: '0.6rem'}}>Colors</h3>
                <div style={{display: 'flex', flexWrap: 'wrap'}}>
                    {getModels().colors.map(color => {
                        return(
                            <div key={color} style={{display: 'flex', alignItems: 'center', height: '50px'}}>
                                <input style={{width: '40px', transform: 'scale(0.6)'}} type='checkbox'/>
                                <p style={{margin: '0 10px 0 0', fontSize: '14px', color: '#222428'}}>{color}</p>
                            </div>
                        )
                    })}
                </div>

                <h3 style={{fontWeight: 'bold', marginTop: '0.6rem'}}>Locations</h3>
                <div style={{display: 'flex', flexWrap: 'wrap'}}>
                    {getModels().locations.map(location => {
                        return(
                            <div key={location} style={{display: 'flex', alignItems: 'center', height: '50px'}}>
                                <input style={{width: '40px', transform: 'scale(0.6)'}} type='checkbox'/>
                                <p style={{margin: '0 10px 0 0', fontSize: '14px', color: '#222428'}}>{location}</p>
                            </div>
                        )
                    })}
                </div>

            </Modal>

            <div>
                <div style={{display: 'flex', justifyContent: 'space-between'}}>
                    <h1 style={{margin: '1rem 0', fontWeight: 900}}>Our Bikes</h1>
                    {(props.isAuth && props.role === 'Manager') ? (
                        <button className={styles.submit} onClick={() => setModalOpen(true)}>Add Bike</button>
                    ) : <button className={styles.submit} onClick={() => setFilterModal(true)}>Apply Filters</button>}
                </div>

                <AllBikes bikes={props.bikes} />
            </div>
        </div>
    )
}

const mapStateToProps = state => {
    return {
        isAuth: state.auth.isAuthenticated,
        email: state.auth.email,
        role: state.auth.role,
        token: state.auth.token,
        bikes: state.bike.bikes
    }
}

export default connect(mapStateToProps)(Bikes);