import {useParams} from "react-router-dom";

function Vault_config() {
    const { vaultId } = useParams();
    console.log(vaultId)

    return (
        <>
        <div>
            <h1>Détails du Coffre {vaultId}</h1>
            <p>Informations du coffre {vaultId}</p>
        </div>
        <button>Ouvrir</button>
        </>
    );
}

export default Vault_config;