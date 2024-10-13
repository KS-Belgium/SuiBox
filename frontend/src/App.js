import React, { useState, useEffect } from 'react';
import './App.css'; // Assurez-vous de créer ce fichier pour le CSS
import { 
    sendCommandToArduino, 
    sendCodeToArduino, 
    cancelAction, 
    fetchStatus, 
    fetchLastMessage, 
    handleConfirmationResponse 
} from './arduinoFunctions';

function App() {
    const [response, setResponse] = useState('');
    const [status, setStatus] = useState('');
    const [lastMessage, setLastMessage] = useState('');
    const [showRoomList, setShowRoomList] = useState(false);
    const [selectedRoom, setSelectedRoom] = useState('');
    const [code, setCode] = useState(''); // Code to send
    const [mode, setMode] = useState('read'); // Mode of the safe
    const [showConfirmationModal, setShowConfirmationModal] = useState(false); // State for modal visibility requests

    // Function to create a new card
    const createCard = async () => {
        setShowRoomList(true);
        await sendCommandToArduino('write'); // Send 'write' to the Arduino
        setMode("write");
    };

    // Function to select a room
    const selectRoom = (room) => {
        setSelectedRoom(room);
        setCode(''); // Reset the code when a room is selected
    };

    // Function to send the code to the Arduino
    const sendCode = async () => {
        const res = await sendCodeToArduino(selectedRoom, code);
        setResponse(res);
        setShowRoomList(false); // Hide the list after sending
        setSelectedRoom(''); // Reset the selected room
        setCode(''); // Reset the code
    };

    // Function to fetch the state of the safe
    const fetchSafeStatus = async () => {
        const status = await fetchStatus();
        setStatus('Safe status: ' + status);
    };

    // Function to fetch the last message from the Arduino
    const fetchArduinoLastMessage = async () => {
        const message = await fetchLastMessage();
        setLastMessage('Last message from Arduino: ' + message);
        console.log(message); // Debug log

        if (message === "Which code do you want to write? (enter the code)") {
            setMode("write");
        }

        else if (message === "Ask for contract confirmation") {
            setMode("confirmation");
            setShowConfirmationModal(true); // Show the confirmation modal
        }
        else{
            setMode("read");
        }
    };

    // Function to handle confirmation response
    const handleResponse = async (response) => {
        const res = await handleConfirmationResponse(response);
        setResponse(res);
        setTimeout(() => {
            setShowConfirmationModal(false);
            setMode("read");
        }, 3000); // 2000 milliseconds = 2 seconds
    };


    // Use useEffect to call fetchStatus and fetchLastMessage every 2 seconds
    useEffect(() => {
        const intervalStatus = setInterval(fetchSafeStatus, 1000); // Always fetch status every 1 second
    
        let intervalLastMessage; // Define intervalLastMessage here, but don't start it yet
    
        // Only start the fetchArduinoLastMessage interval if mode is not "confirmation"
        if (mode !== "confirmation") {
            intervalLastMessage = setInterval(fetchArduinoLastMessage, 1000);
        }
    
        // Cleanup function to clear the intervals when component unmounts or mode changes
        return () => {
            clearInterval(intervalStatus); // Always clear the status interval
            if (intervalLastMessage) {
                clearInterval(intervalLastMessage); // Only clear message interval if it was started
            }
        };
    }, []); // Re-run the effect when `mode` changes
    

    return (
        <div className="app-container">
            <h1>Control the Arduino Safe</h1>
            <div className="room-selection">
                {!showRoomList && (
                    <button className="button" onClick={createCard}>
                        Add a new card
                    </button>
                )}
                {showRoomList && (
                    <div className="room-list">
                        <div 
                            className="room-item" 
                            onClick={() => selectRoom('Room 1')}>
                            Room 1
                        </div>
                        <div className="room-item disabled">
                            Room 2 (Disabled)
                        </div>
                        <div 
                            className="room-item" 
                            onClick={() => selectRoom('Room 3')}>
                            Room 3
                        </div>
                    </div>
                )}
            </div>
            <div className="code-entry">
                {selectedRoom && (
                    <div>
                        <h3>Selected: {selectedRoom}</h3>
                        <input 
                            type="text" 
                            className="code-input" 
                            value={code} 
                            onChange={(e) => setCode(e.target.value)} // Update the code on input change
                            placeholder="Enter your code here"
                            required
                        />
                        <button className="button cancel" onClick={cancelAction}>
                            Cancel
                        </button>
                        <button className="button send" onClick={sendCode}>
                            Send code
                        </button>
                    </div>
                )}
                <div className="response-message">{response}</div>
                <div className="status-message">{status}</div>
                <div className="last-message">{lastMessage}</div>
                <div className="mode">{mode}</div>
            </div>

            {/* Confirmation Modal */}
            {showConfirmationModal && mode == "confirmation" &&(
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={() => setShowConfirmationModal(false)}>&times;</span>
                        <h2>Confirmation Required</h2>
                        <p>Do you confirm the action?</p>
                        <button className="button" onClick={() => handleResponse('no')}>
                            No
                        </button>
                        <button className="button" onClick={() => handleResponse('yes')}>
                            Yes
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default App;
