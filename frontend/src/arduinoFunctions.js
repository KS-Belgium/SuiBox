// arduinoFunctions.js

export const sendCommandToArduino = async (command) => {
    try {
        const res = await fetch('http://localhost:3000/send', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message: command }) // Send the command
        });
        const data = await res.text();
        return data;
    } catch (error) {
        console.error('Error:', error);
        return 'Error sending the command.';
    }
};

export const sendCodeToArduino = async (selectedRoom, code) => {
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
        return data;
    } catch (error) {
        console.error('Error:', error);
        return 'Error sending the code.';
    }
};

export const cancelAction = async () => {
    try {
        const res = await fetch('http://localhost:3000/send', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message: 'error' }) // Send the error message
        });
        const data = await res.text();
        return data;
    } catch (error) {
        console.error('Error:', error);
        return 'Error sending the cancellation message.';
    }
};

export const fetchStatus = async () => {
    try {
        const res = await fetch('http://localhost:3000/status');
        const data = await res.text();
        return data;
    } catch (error) {
        console.error('Error:', error);
        return 'Error fetching the status.';
    }
};

export const fetchLastMessage = async () => {
    try {
        const res = await fetch('http://localhost:3000/last-message');
        const data = await res.text();
        return data;
    } catch (error) {
        console.error('Error:', error);
        return 'No message received.';
    }
};

export const handleConfirmationResponse = async (response) => {
    try {
        const res = await fetch('http://localhost:3000/send', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message: response === 'yes' ? "true" : "false" }) // Send true or false to Arduino
        });
        const data = await res.text();
        return data;
    } catch (error) {
        console.error('Error:', error);
        return 'Error sending the confirmation response.';
    }
};
