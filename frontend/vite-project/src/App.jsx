import { useState } from 'react';
import './App.css';
import { ConnectButton, useWallet } from "@suiet/wallet-kit";
import Vaults_grid from "./components/Vaults_grid.jsx";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Vault_config from "./components/Vault_config.jsx";

function App() {
    const [count, setCount] = useState(0);

    return (
        <>
            <Router>
                <div className="app">
                    <ConnectButton />
                    <Routes>
                        <Route path="/" element={<Vaults_grid />} />
                        <Route path="/coffre/:vaultId" element={<Vault_config />} />
                    </Routes>
                </div>
            </Router>
        </>
    );
}

export default App;