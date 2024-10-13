import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function Vault_config() {
    const { vaultId } = useParams();
    const navigate = useNavigate(); // Hook for navigation
    const [code, setCode] = useState(''); // State to store the input code

    // Function to send the "write" command to the Arduino
    const sendCommandToArduino = async (command) => {
        try {
            const res = await fetch('http://localhost:3000/send', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: command }) // Send the "write" command
            });
            const data = await res.text();
            console.log("Arduino response: ", data);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    // Function to send an error message to the Arduino
    const cancelAction = async () => {
        try {
            const res = await fetch('http://localhost:3000/send', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: 'error' }) // Send the error message
            });
            const data = await res.text();
            console.log("Cancel response: ", data);
            navigate('/'); // Navigate back to the main app screen
        } catch (error) {
            console.error('Error:', error);
        }
    };

    // Function to handle reservation
    const handleReservation = async () => {
        if (!code) {
            alert("Please enter a code."); // Basic validation
            return;
        }

        try {
            const res = await fetch('http://localhost:3000/send', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: code }) // Send the code to the Arduino
            });
            const data = await res.text();
            console.log("Reservation response: ", data);
            navigate('/'); // Navigate back to the main app screen after sending the code
        } catch (error) {
            console.error('Error:', error);
        }
    };

    // useEffect hook to run when the component loads
    useEffect(() => {
        // Send the "write" command to the Arduino when the component loads
        sendCommandToArduino('write');
    }, []); // Empty dependency array to run only once on mount

    return (
        <>
            <div>
                <h1>Détails du Coffre {vaultId}</h1>
                <p>Informations du coffre {vaultId}</p>
                <div className="form-group">
                    <label htmlFor="codeInput">Enter code for reservation:</label>
                    <input
                        type="text"
                        className="form-control"
                        id="codeInput"
                        value={code}
                        onChange={(e) => setCode(e.target.value)} // Update state on input change
                        placeholder="Enter your code here"
                        required
                    />
                </div>
            </div>
            <button className="btn btn-success mt-3" onClick={handleReservation}>
                Réserver
            </button>
            <button className="btn btn-danger mt-3" onClick={cancelAction}>
                Annuler
            </button>
        </>
    );
}

export default Vault_config;
