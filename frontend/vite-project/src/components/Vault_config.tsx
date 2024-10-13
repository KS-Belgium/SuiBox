import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Transaction } from '@mysten/sui/transactions';
import {useCurrentAccount, useSignAndExecuteTransaction, useSuiClient} from "@mysten/dapp-kit";
import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';
import { verifyTransactionSignature } from '@mysten/sui/verify';

function Vault_config() {
    const { vaultId } = useParams();
    const navigate = useNavigate(); // Hook for navigation
    const [signature, setSignature] = useState<string>("");

    const account = useCurrentAccount();
    const client = useSuiClient();
    const { mutate: signAndExecute } = useSignAndExecuteTransaction({
        execute: async ({ bytes, signature }) =>
            await client.executeTransactionBlock({
                transactionBlock: bytes,
                signature,
                options: {
                    showRawEffects: true,
                    showEffects: true,
                },
            }),
    });


    useEffect(() => {
        handleReservation().then(r => console.log(r));
    }, [signature]);

    // Function to send the "write" command to the Arduino
    async function sendCommandToArduino(command){
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

    async function generate_signature(sender: string) {
        const tx = new Transaction();
        tx.setSender(sender);
        const bytes = await tx.build({client});

        const keypair = new Ed25519Keypair();
        const {signature} = await keypair.signTransaction(bytes);

        const publicKey = await verifyTransactionSignature(bytes, signature);

        if (publicKey.toSuiAddress() !== keypair.getPublicKey().toSuiAddress()) {
            throw new Error('Signature was valid, but was signed by a different keyPair');
        }
        return signature.toString();
    }

    // Function to send an error message to the Arduino
    async function cancelAction()  {
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

    async function call_new_transaction(){
        const timestamp = Date.now();
        const tx = new Transaction();
        const contract_address = "0x3b89d1a08bdf678ccb8f106ccce08779a29a7b96fdb9fbcab8731c662967e3ce";

        tx.moveCall({
            arguments: [
                tx.pure.u64(timestamp),
                tx.object("0x6")
            ],
            target: `${contract_address}::safehotel::new_transaction`
        });

        signAndExecute({
            transaction: tx
        },{
            onSuccess: (result) => {
                const objectId = result.effects?.created?.[0]?.reference?.objectId;
                if (objectId) {
                    console.log(`Created object with ID: ${objectId}`);
                    generate_signature(account?.address as string).then((result) => {
                        setSignature(result);
                    });
                }
            },
            onError: (error) => {
                console.log(error);
            }
        })
    }

    // Function to handle reservation
    async function handleReservation() {
        try {
            const res = await fetch('http://localhost:3000/send', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: signature }) // Send the code to the Arduino
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
            </div>
            <button className="btn btn-success mt-3" onClick={call_new_transaction}>
                Réserver
            </button>
            <button className="btn btn-danger mt-3" onClick={cancelAction}>
                Annuler
            </button>
        </>
    );
}

export default Vault_config;
