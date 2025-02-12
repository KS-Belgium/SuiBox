import {useEffect, useState} from 'react';
import {Link} from 'react-router-dom';
import NavBar from "./NavBar.tsx";

function Vaults_grid() {
    const vaults = Array.from({ length: 10 }, (_, i) => i);

    // const account = useCurrentAccount();

    const [lastMessage, setLastMessage] = useState('');
    const [mode, setMode] = useState('read');
    const [pause, setPause] = useState(false);

    // Function to send a command to the Arduino
    const sendCommandToArduino = async (command: string) => {
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


    // Use useEffect to call fetchLastMessage every second
    useEffect(() => {
        const intervalLastMessage = setInterval(fetchLastMessage, 1000);

        // Clean up the intervals on component unmount
        return () => {
            clearInterval(intervalLastMessage);
        };
    }, []);

    const handleConfirmation = () => {
        const userConfirmed = window.confirm("Do you confirm?"); // Display confirmation pop-upw
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

    const styles = {
        vault: {
            display: 'block',
            padding: '10px',
            margin: '10px',
            border: '1px solid #ccc',
            borderRadius: '5px',
            textDecoration: 'none',
            color: '#333',
            pointerEvents: 'none',
            backgroundColor: 'lightgrey', // default grey
        },
        specialVault: {
            display: 'block',
            padding: '10px',
            margin: '10px',
            border: '1px solid #ccc',
            borderRadius: '5px',
            textDecoration: 'none',
            color: '#fff',
            backgroundColor: 'dodgerblue',
        }
    };

    return (
        <>
            <NavBar/>
            {vaults.map((_vault, index) => (
                <Link to={`/coffre/${index + 1}`} key={index} style={index === 4 ? styles.specialVault : styles.vault}>
                    Vault {index + 1}
                </Link>
            ))}
        </>
    );
}

export default Vaults_grid;