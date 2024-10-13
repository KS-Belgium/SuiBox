import {useParams} from "react-router-dom";
import styles from '../App.module.css';

function Vault_config() {
    const { vaultId } = useParams();
    console.log(vaultId)

    return (
        <>
            <div>
                <h1>Vault {vaultId}</h1>
                <img src={"../../public/Vault icon.png"} style={{width:"80vw"}}/>
            </div>
            <button className={styles.button}>Unlock</button>
        </>
    );
}

export default Vault_config;