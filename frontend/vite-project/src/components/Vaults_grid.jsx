import React from 'react';
import { useNavigate } from 'react-router-dom';

function Vaults_grid() {
    const vaults = Array.from({ length: 10 }, (_, i) => i);

    const navigate = useNavigate();

    const handleNavigate = (vaultId) => {
        navigate(`/coffre/${vaultId}`);
    };

    return (
        <>
            {vaults.map((vault, index) => (
                <button onClick={() => handleNavigate(index + 1)} key={index}>
                    Coffre {index + 1}
                </button>
            ))}
        </>
    );
}

export default Vaults_grid;