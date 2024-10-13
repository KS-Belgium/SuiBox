import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from "framer-motion";

function Vaults_grid() {
    const container = {
        hidden: { opacity: 0, scale: 0.8 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: {
                delayChildren: 0.3,
                staggerChildren: 0.2,
            },
        },
    };

    const item = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
        },
    };

    const vaults = Array.from({ length: 10 }, (_, i) => i);
    const navigate = useNavigate();
    const activeVaultIndex = 3; // Seul ce coffre sera activé

    const handleNavigate = (vaultId, isDisabled) => {
        if (isDisabled) {
            alert("Vault occupied");
        } else {
            navigate(`/coffre/${vaultId}`);
        }
    };

    return (
        <>
            <motion.ul
                className="container"
                variants={container}
                initial="hidden"
                animate="visible"
                style={{
                    listStyle: 'none',
                    padding: 0,
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                {vaults.map((vault, index) => {
                    const isDisabled = index !== activeVaultIndex;
                    return (
                        <motion.li key={index} className="item" variants={item}>
                            <button
                                onClick={() => handleNavigate(index + 1, isDisabled)}
                                style={{
                                    padding: '10px 20px',
                                    width: '80px',
                                    height: '80px',
                                    margin: '10px',
                                    background: isDisabled ? '#ccc' : '#007bff',
                                    color: '#fff',
                                    border: 'none',
                                    borderRadius: '5px',
                                    cursor: isDisabled ? 'not-allowed' : 'pointer',
                                }}

                            >
                                Coffre <span style={{ fontSize: '30px' }}>{index + 1}</span>
                            </button>
                        </motion.li>
                    );
                })}
            </motion.ul>
        </>
    );
}

export default Vaults_grid;