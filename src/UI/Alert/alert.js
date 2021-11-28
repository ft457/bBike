import styles from './alert.module.scss';

const Alert = props => {

    if(props.message.length === 0){
        return null;
    }

    return(
        <div className={styles.alert}>
            <p>{props.message}</p>
            <p onClick={() => props.setMessage('')}>X</p>
        </div>
    )
}

export default Alert;