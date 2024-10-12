import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS

function App() {
    const [response, setResponse] = useState('');
    const [status, setStatus] = useState('');
    const [lastMessage, setLastMessage] = useState('');
    const [showRoomList, setShowRoomList] = useState(false);
    const [selectedRoom, setSelectedRoom] = useState('');
    const [code, setCode] = useState(''); // Code to send

    // Function to create a new card
    const createCard = async () => {
        setShowRoomList(true);
        await sendCommandToArduino('write'); // Send 'write' to the Arduino
    };

    // Function to select a room
    const selectRoom = (room) => {
        setSelectedRoom(room);
        setCode(''); // Reset the code when a room is selected
    };

    // Function to send the code to the Arduino
    const sendCodeToArduino = async () => {
        if (!selectedRoom || !code) return; // Check if a room and code are selected
        try {
            const res = await fetch('http://localhost:3000/send', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ message: `${code}` }) // Message with the code
            });
            const data = await res.text();
            setResponse(data);
            setShowRoomList(false); // Hide the list after sending
            setSelectedRoom(''); // Reset the selected room
            setCode(''); // Reset the code
        } catch (error) {
            console.error('Error:', error);
            setResponse('Error sending the code.');
        }
    };

    // Function to send a command to the Arduino
    const sendCommandToArduino = async (command) => {
        try {
            const res = await fetch('http://localhost:3000/send', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ message: command }) // Send the command
            });
            const data = await res.text();
            setResponse(data);
        } catch (error) {
            console.error('Error:', error);
            setResponse('Error sending the command.');
        }
    };

    // Function to send an error message to the Arduino
    const cancelAction = async () => {
        try {
            const res = await fetch('http://localhost:3000/send', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ message: 'error' }) // Send the error message
            });
            const data = await res.text();
            setResponse(data);
            setShowRoomList(false); // Hide the list after cancellation
            setSelectedRoom(''); // Reset the selected room
            setCode(''); // Reset the code
        } catch (error) {
            console.error('Error:', error);
            setResponse('Error sending the cancellation message.');
        }
    };

    // Function to fetch the state of the safe
    const fetchStatus = async () => {
        try {
            const res = await fetch('http://localhost:3000/status');
            const data = await res.text();
            setStatus('Safe status: ' + data);
        } catch (error) {
            console.error('Error:', error);
            setStatus('Error fetching the status.');
        }
    };

    // Function to fetch the last message from the Arduino
    const fetchLastMessage = async () => {
        try {
            const res = await fetch('http://localhost:3000/last-message');
            const data = await res.text();
            setLastMessage('Last message from Arduino: ' + data);
        } catch (error) {
            console.error('Error:', error);
            setLastMessage('No message received.');
        }
    };

    // Use useEffect to call fetchStatus and fetchLastMessage every 2 seconds
    useEffect(() => {
        const intervalStatus = setInterval(fetchStatus, 2000);
        const intervalLastMessage = setInterval(fetchLastMessage, 2000);

        // Clean up the intervals on component unmount
        return () => {
            clearInterval(intervalStatus);
            clearInterval(intervalLastMessage);
        };
    }, []);

    return (
        <div className="container mt-5">
            <h1 className="text-center">Control the Arduino Safe</h1>
            <div className="row">
                <div className="col-md-4">
                    {!showRoomList && ( // Show the button only if the list is hidden
                        <button className="btn btn-primary mb-3" onClick={createCard}>
                            Add a new card
                        </button>
                    )}
                    {showRoomList && (
                        <div className="list-group">
                            <a 
                                href="#" 
                                className="list-group-item list-group-item-action" 
                                onClick={() => selectRoom('Room 1')}>
                                Room 1
                            </a>
                            <a 
                                href="#" 
                                className="list-group-item list-group-item-action disabled">
                                Room 2 (Disabled)
                            </a>
                            <a 
                                href="#" 
                                className="list-group-item list-group-item-action" 
                                onClick={() => selectRoom('Room 3')}>
                                Room 3
                            </a>
                        </div>
                    )}
                </div>
                <div className="col-md-8">
                    {selectedRoom && (
                        <div>
                        <h3>Selected: {selectedRoom}</h3>
                        <div className="form-group">
                            <label htmlFor="codeInput">Code to send:</label>
                            <input 
                                type="text" 
                                className="form-control" 
                                id="codeInput" 
                                value={code} 
                                onChange={(e) => setCode(e.target.value)} // Update the code on input change
                                placeholder="Enter your code here"
                                required
                            />
                        </div>
                        <button className="btn btn-danger me-2 mt-3" onClick={cancelAction}>
                            Cancel
                        </button>
                        <button className="btn btn-success mt-3" onClick={sendCodeToArduino}>
                            Send code
                        </button>
                    </div>
                    )}
                    <div className="alert alert-info mt-3" role="alert">
                        {response}
                    </div>
                    <div className="alert alert-secondary" role="alert">
                        {status}
                    </div>
                    <div className="alert alert-light" role="alert">
                        {lastMessage}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;
