import { useState, useEffect } from 'react';
import './App.css';
import { ConnectButton } from "@suiet/wallet-kit";
import Vaults_grid from "./components/Vaults_grid.jsx";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Vault_config from "./components/Vault_config.tsx";

function App() {
    const [lastMessage, setLastMessage] = useState('');
    const [mode, setMode] = useState('read');
    const [pause, setPause] = useState(false);

    // Function to send a command to the Arduino
    const sendCommandToArduino = async (command) => {
        try {
            const res = await fetch('http://localhost:3000/send', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ message: command })
            });
            const data = await res.text();
            setLastMessage(data);
        } catch (error) {
            console.error('Error:', error);
            setLastMessage('Error sending the command.');
        }
    };

    // Function to fetch the last message from the Arduino
    const fetchLastMessage = async () => {
        try {
            const res = await fetch('http://localhost:3000/last-message');
            const data = await res.text();
            setLastMessage(data);

            // Check for confirmation message only if not paused
            if (data === "Ask for contract confirmation" && !pause) {
                setPause(true);
                setMode('confirmation');
                handleConfirmation();
            } else {
                setMode("read");
            }
        } catch (error) {
            console.error('Error:', error);
            setLastMessage('No message received.');
        }
    };

    const handleConfirmation = () => {
        const userConfirmed = window.confirm("Do you confirm?"); // Display confirmation pop-up
        if (userConfirmed) {
            sendCommandToArduino("true"); // Send confirmation to Arduino
        } else {
            sendCommandToArduino("false"); // Send cancellation to Arduino
        }

        setMode("read"); // Set mode back to 'read'

        // Set a timeout to reset pause after confirmation
        setTimeout(() => {
            setPause(false); // Allow future confirmations
        }, 2000); // 2000 milliseconds = 2 seconds
    };

    // Use useEffect to call fetchLastMessage every second
    useEffect(() => {
        const intervalLastMessage = setInterval(fetchLastMessage, 1000);

        // Clean up the intervals on component unmount
        return () => {
            clearInterval(intervalLastMessage);
        };
    }, []);

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
