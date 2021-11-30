import {default as AllBikes} from '../Components/Bikes/bikes';
import Modal from "../UI/Modal/modal";
import {useRef, useState} from "react";
import styles from './fileInput.module.scss';
import {connect} from "react-redux";
import axios from "axios";
import FormData from 'form-data';

const Bikes = props => {

    //filters
    const [filterModal, setFilterModal] = useState(false);
    const [models, setModels] = useState([]);
    const [colors, setColors] = useState([]);
    const [locations, setLocations] = useState([]);
    const [rateAverage, setRateAverage] = useState(false);

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

        if (!event.target.checked) {
            switch (type) {
                case 'Model':
                    const updatedModels = [...models];
                    updatedModels.splice(updatedModels.indexOf(name));
                    setModels(updatedModels);
                    break;
                case 'Color':
                    const updatedColors = [...colors];
                    updatedColors.splice(updatedColors.indexOf(name));
                    setColors(updatedColors);
                    break;
                case 'Location':
                    const updatedLocations = [...locations];
                    updatedLocations.splice(updatedLocations.indexOf(name));
                    setLocations(updatedLocations);
                    break;
                default:
                    break;
            }
        } else {
            switch (type) {
                case 'Model':
                    const updatedModels = [...models];
                    updatedModels.push(name);
                    setModels(updatedModels);
                    break;
                case 'Color':
                    const updatedColors = [...colors];
                    updatedColors.push(name);
                    setColors(updatedColors);
                    break;
                case 'Location':
                    const updatedLocations = [...locations];
                    updatedLocations.push(name);
                    setLocations(updatedLocations);
                    break;
                default:
                    break;
            }
        }

    }

    const filteredBikes = () => {
        if (models.length === 0 && colors.length === 0 && locations.length === 0) {
            return props.bikes;
        }
        const modelBikes = [];
        const colorBikes = [];
        const locationBikes = [];

        props.bikes.forEach(bike => {
            if (models.length !== 0) {
                if (models.includes(bike.model)) {
                    modelBikes.push(bike)
                }
            }
            if (colors.length !== 0) {
                if (colors.includes(bike.color)) {
                    colorBikes.push(bike)
                }
            }
            if (locations.length !== 0) {
                if (locations.includes(bike.location)) {
                    locationBikes.push(bike)
                }
            }
        });

        return [...new Set([...modelBikes, ...colorBikes, ...locationBikes])];
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

    const compare = (a, b) => {
        if (a.rating < b.rating) {
            return -1;
        }
        if (a.rating > b.rating) {
            return 1;
        }
        return 0;
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
                        return (
                            <div key={model} style={{display: 'flex', alignItems: 'center', height: '50px'}}>
                                <input style={{width: '40px', transform: 'scale(0.6)'}} checked={models.includes(model)}
                                       type='checkbox' onChange={e => onCheckboxChange(e, 'Model', model)}/>
                                <p style={{margin: '0 10px 0 0', fontSize: '14px', color: '#222428'}}>{model}</p>
                            </div>
                        )
                    })}
                </div>

                <h3 style={{fontWeight: 'bold', marginTop: '0.6rem'}}>Colors</h3>
                <div style={{display: 'flex', flexWrap: 'wrap'}}>
                    {getModels().colors.map(color => {
                        return (
                            <div key={color} style={{display: 'flex', alignItems: 'center', height: '50px'}}>
                                <input style={{width: '40px', transform: 'scale(0.6)'}} checked={colors.includes(color)}
                                       type='checkbox' onChange={e => onCheckboxChange(e, 'Color', color)}/>
                                <p style={{margin: '0 10px 0 0', fontSize: '14px', color: '#222428'}}>{color}</p>
                            </div>
                        )
                    })}
                </div>

                <h3 style={{fontWeight: 'bold', marginTop: '0.6rem'}}>Locations</h3>
                <div style={{display: 'flex', flexWrap: 'wrap'}}>
                    {getModels().locations.map(location => {
                        return (
                            <div key={location} style={{display: 'flex', alignItems: 'center', height: '50px'}}>
                                <input style={{width: '40px', transform: 'scale(0.6)'}}
                                       checked={locations.includes(location)} type='checkbox'
                                       onChange={e => onCheckboxChange(e, 'Location', location)}/>
                                <p style={{margin: '0 10px 0 0', fontSize: '14px', color: '#222428'}}>{location}</p>
                            </div>
                        )
                    })}
                </div>

                <h3 style={{fontWeight: 'bold', marginTop: '0.6rem'}}>Rate Average</h3>
                <div style={{display: 'flex', alignItems: 'center', height: '50px'}}>
                    <input style={{width: '40px', transform: 'scale(0.6)'}} checked={rateAverage} type='checkbox'
                           onChange={e => setRateAverage(e.target.checked)} />
                    <p style={{margin: '0 10px 0 0', fontSize: '14px', color: '#222428'}}>Rate Average</p>
                </div>

            </Modal>

            <div>
                <div style={{display: 'flex', justifyContent: 'space-between'}}>
                    <h1 style={{margin: '1rem 0', fontWeight: 900}}>Our Bikes</h1>
                    <div>
                        {(props.isAuth && props.role === 'Manager') ? (
                            <button className={styles.submit} onClick={() => setModalOpen(true)}>Add Bike</button>
                        ) : null}
                        <button className={styles.submit} onClick={() => setFilterModal(true)}>Apply Filters</button>
                    </div>
                </div>

                <AllBikes bikes={rateAverage ? filteredBikes().sort(compare).reverse() : filteredBikes()}/>
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