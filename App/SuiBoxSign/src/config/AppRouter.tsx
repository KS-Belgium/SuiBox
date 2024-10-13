import {BrowserRouter, Route, Routes} from 'react-router-dom';
import '../../App.css';
import Transaction_page from "../pages/Transaction_page.tsx";
import Vaults_grid from "../components/Vaults_grid.tsx";
import Vault_config from "../components/Vault_config.tsx";

function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/test" element={<Transaction_page />} />

                {/*Others part*/}
                <Route path="/" element={<Vaults_grid />} />
                <Route path="/coffre/:vaultId" element={<Vault_config />} />
            </Routes>
        </BrowserRouter>
    );
}

export default AppRouter;