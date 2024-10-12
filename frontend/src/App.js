import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; // Importer le CSS de Bootstrap

function App() {
    const [response, setResponse] = useState('');
    const [status, setStatus] = useState('');
    const [lastMessage, setLastMessage] = useState('');
    const [showRoomList, setShowRoomList] = useState(false);
    const [selectedRoom, setSelectedRoom] = useState('');
    const [code, setCode] = useState(''); // Code à envoyer

    // Fonction pour créer une nouvelle carte
    const createCard = async () => {
        setShowRoomList(true);
        await sendCommandToArduino('write'); // Envoyer 'write' à l'Arduino
    };

    // Fonction pour sélectionner une chambre
    const selectRoom = (room) => {
        setSelectedRoom(room);
        setCode(''); // Réinitialiser le code lors de la sélection d'une chambre
    };

    // Fonction pour envoyer le code à l'Arduino
    const sendCodeToArduino = async () => {
        if (!selectedRoom || !code) return; // Vérifier si une chambre et un code sont sélectionnés
        try {
            const res = await fetch('http://localhost:3000/send', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ message: `${code}` }) // Message avec le code
            });
            const data = await res.text();
            setResponse(data);
            setShowRoomList(false); // Masquer la liste après l'envoi
            setSelectedRoom(''); // Réinitialiser la chambre sélectionnée
            setCode(''); // Réinitialiser le code
        } catch (error) {
            console.error('Erreur:', error);
            setResponse('Erreur lors de l\'envoi du code.');
        }
    };

    // Fonction pour envoyer une commande à l'Arduino
    const sendCommandToArduino = async (command) => {
        try {
            const res = await fetch('http://localhost:3000/send', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ message: command }) // Envoyer la commande
            });
            const data = await res.text();
            setResponse(data);
        } catch (error) {
            console.error('Erreur:', error);
            setResponse('Erreur lors de l\'envoi de la commande.');
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
        <div className="container mt-5">
            <h1 className="text-center">Contrôler le Coffre Arduino</h1>
            <div className="row">
                <div className="col-md-4">
                    {!showRoomList && ( // Afficher le bouton seulement si la liste est masquée
                        <button className="btn btn-primary mb-3" onClick={createCard}>
                            Ajouter une nouvelle carte
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
                                Room 2 (Désactivé)
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
                            <h3>Sélectionné : {selectedRoom}</h3>
                            <div className="form-group">
                                <label htmlFor="codeInput">Code à envoyer :</label>
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    id="codeInput" 
                                    value={code} 
                                    onChange={(e) => setCode(e.target.value)} // Mettre à jour le code à chaque saisie
                                    placeholder="Entrez votre code ici"
                                    required
                                />
                            </div>
                            <button className="btn btn-success mt-3" onClick={sendCodeToArduino}>
                                Envoyer le code
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
