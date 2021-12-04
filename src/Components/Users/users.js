import {useEffect, useRef, useState} from "react";
import styles from './users.module.scss';
import axios from "axios";
import {connect} from "react-redux";
import {fetchBikes} from "../../store/actions/bike";
import Modal from "../../UI/Modal/modal";

const Users = props => {

    //Add user modal

    const [modalOpen, setModalOpen] = useState(false);
    let name = useRef(null);
    let email = useRef(null);
    let password = useRef(null);
    let role = useRef(null);
    const [error, setError] = useState('');

    const addUser = () => {
        if(props.isAuth && props.role === 'Manager'){
            if(name.value.length === 0){
                setError("Name can't be empty");
            }
            else if(!validateEmail(email.value)){
                setError("Enter a valid email");
            }
            else if(password.value.length < 5){
                setError("Password must be 5 characters long!");
            }
            else if(role.value === 'None'){
                setError("Please select user role!");
            }
            else {
                axios.post('http://localhost:8080/user', {name: name.value, email: email.value, password: password.value, role: role.value}, {headers: {Authorization: props.token}})
                    .then(res => {
                        if(res.data.message === 'User added successfully!'){
                            window.location.reload();
                        }
                        setError(res.data.message);
                    })
                    .catch(err => {
                        if(err.response){
                            setError(err.response.data.message);
                        }else {
                            setError(err.toString());
                        }
                    })
            }
        }
        else {
            setError('Not authenticated')
        }
    }

    const validateEmail = (email) => {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    //update modal

    const [editModalOpen, setEditModalOpen] = useState(false);
    let editName = useRef(null);
    let editEmail = useRef(null);
    const [editError, setEditError] = useState('');
    const [current, setCurrent] = useState({id: '', name: '', email: ''});

    const updateUser = (id) => {
        if(props.isAuth && props.role === 'Manager'){
            if(editName.value.length === 0){
                setEditError("Name can't be empty!");
            }
            else if(!validateEmail(editEmail.value)){
                setEditError("Enter a valid email");
            }
            else {
                axios.put('http://localhost:8080/user/' + id, {name: editName.value, email: editEmail.value}, {headers: {Authorization: props.token}})
                    .then(res => {
                        setEditError(res.data.message);
                        if(res.data.message === 'User edited successfully.'){
                            window.location.reload();
                        }
                    })
                    .catch(err => {
                        if(err.response){
                            setEditError(err.response.data.message);
                        }else {
                            setEditError(err.toString());
                        }
                    })
            }
        }
        else {
            setEditError('Not authenticated')
        }
    }

    //get all users

    const [users, setUsers] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:8080/users',{headers: {Authorization: props.token}})
            .then(res => {
                const updatedUsers = res.data.filter(user=> user._id !== props.userId);
                setUsers(updatedUsers);
            })
            .catch(err=> {
                console.log(err);
            })
    }, [props.token, props.userId]);

    // delete a user

    const deleteUser = (userId) => {

        if(props.isAuth && props.role === 'Manager'){
            axios.delete('http://localhost:8080/user/' + userId, {headers: {Authorization: props.token}})
                .then(res => {
                    if(res.data.message === 'User deleted successfully.'){
                        props.onFetchBikes();
                        window.location.reload();
                    }
                    else{
                        console.log(res.data);
                    }
                })
                .catch(err => {
                    console.log(err);
                })
        }
    }

    return(
        <div style={{minHeight: '90vh'}}>

            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <h1>Users</h1>
                {(props.isAuth && props.role === 'Manager') ? (
                    <button className={styles.submit} onClick={()=>setModalOpen(true)}>Add User</button>
                ) : null}
            </div>

            {/*add user modal*/}

            <Modal modalOpen={modalOpen} setModalOpen={setModalOpen}>
                <h2>Add user</h2>
                <input ref={el => name = el} type='text' name='name' placeholder='Full Name'/>
                <input ref={el => email = el} type='email' name='email' placeholder='Email'/>
                <input ref={el => password = el} type='password' name='password' placeholder='Password'/>
                <select ref={el=>role=el}>
                    <option value="None">Select</option>
                    <option value="Manager">Manager</option>
                    <option value="User">User</option>
                </select>
                <h3 className={styles.error} style={{color: error === 'User added successfully!' ? 'green' : 'red'}}>{error}</h3>
                <button onClick={addUser}>Submit</button>
            </Modal>

            {/*update user modal*/}

            <Modal modalOpen={editModalOpen} setModalOpen={setEditModalOpen}>
                <h2>Edit user</h2>
                <input ref={el => editName = el} type='text' name='name' defaultValue={current.name} placeholder='Full Name'/>
                <input ref={el => editEmail = el} type='email' name='email' defaultValue={current.email} placeholder='Email'/>
                <h3 className={styles.error} style={{color: editError === 'User edited successfully.' ? 'green' : 'red'}}>{editError}</h3>
                <button onClick={()=>updateUser(current.id)}>Submit</button>
            </Modal>

            <table className={styles.users}>
                <thead>
                <tr>
                    <th>Sr.</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>

                {users.map((user, index) => {
                    return (
                        <tr key={user._id}>
                            <td><p>{index+1}</p></td>
                            <td><p>{user.name}</p></td>
                            <td><p>{user.email}</p></td>
                            <td><p>{user.role}</p></td>
                            <td>
                                <p className={styles.delete} onClick={()=>{
                                    setEditModalOpen(true);
                                    setCurrent({id: user._id, name: user.name, email: user.email});
                                }}>Edit</p>
                                <p className={styles.delete} onClick={()=>deleteUser(user._id)}>Delete</p>
                            </td>
                        </tr>
                    )
                })}

                </tbody>

            </table>
        </div>
    )
}

const mapStateToProps = state => {
    return{
        isAuth: state.auth.isAuthenticated,
        email: state.auth.email,
        role: state.auth.role,
        userId: state.auth.userId,
        token: state.auth.token
    }
}

const mapDispatchToProps = dispatch => {
    return{
        onFetchBikes: () => dispatch(fetchBikes())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Users);