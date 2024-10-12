import React, { useState, useEffect } from 'react';

function App() {
    const [messageInput, setMessageInput] = useState('');
    const [response, setResponse] = useState('');
    const [status, setStatus] = useState('');
    const [lastMessage, setLastMessage] = useState('');

    // Fonction pour envoyer un message à l'Arduino
    const sendMessage = async (e) => {
        e.preventDefault();
        if (!messageInput) return;

        try {
            const res = await fetch('http://localhost:3000/send', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ message: messageInput })
            });
            const data = await res.text();
            setResponse(data);
            setMessageInput(''); // Réinitialiser le champ de saisie
        } catch (error) {
            console.error('Erreur:', error);
            setResponse('Erreur lors de l\'envoi.');
        }
    };

    // Fonction pour récupérer l'état du coffre
    const fetchStatus = async () => {
        try {
            const res = await fetch('http://localhost:3000/status');
            const data = await res.text();
            setStatus('État du coffre: ' + data);
        } catch (error) {
            console.error('Erreur:', error);
            setStatus('Erreur lors de la récupération de l\'état.');
        }
    };

    // Fonction pour récupérer le dernier message de l'Arduino
    const fetchLastMessage = async () => {
        try {
            const res = await fetch('http://localhost:3000/last-message');
            const data = await res.text();
            setLastMessage('Dernier message Arduino: ' + data);
        } catch (error) {
            console.error('Erreur:', error);
            setLastMessage('Aucun message reçu.');
        }
    };

    // Utiliser useEffect pour appeler fetchStatus et fetchLastMessage toutes les 2 secondes
    useEffect(() => {
        const intervalStatus = setInterval(fetchStatus, 2000);
        const intervalLastMessage = setInterval(fetchLastMessage, 2000);

        // Nettoyer les intervalles lors du démontage du composant
        return () => {
            clearInterval(intervalStatus);
            clearInterval(intervalLastMessage);
        };
    }, []);

    return (
        <div>
            <h1>Contrôler le Coffre Arduino</h1>
            <form onSubmit={sendMessage}>
                <input 
                    type="text" 
                    value={messageInput} 
                    onChange={(e) => setMessageInput(e.target.value)} 
                    placeholder="Entrez votre message" 
                    required 
                />
                <button type="submit">Envoyer</button>
            </form>
            <div id="response">{response}</div>
            <div id="status">{status}</div>
            <div id="lastMessage">{lastMessage}</div>
        </div>
    );
}

export default App;
