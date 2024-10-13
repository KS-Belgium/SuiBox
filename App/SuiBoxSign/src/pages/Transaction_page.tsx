import {useCurrentAccount, useSignAndExecuteTransaction, useSuiClient} from "@mysten/dapp-kit";
import NavBar from "../components/NavBar.tsx";
import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';
import { verifyTransactionSignature } from '@mysten/sui/verify';
import { Transaction } from '@mysten/sui/transactions';
import {useState} from "react";

function Transaction_page(){

    const [signature, setSignature] = useState<string>("");

    const contract_address = "0x3b89d1a08bdf678ccb8f106ccce08779a29a7b96fdb9fbcab8731c662967e3ce";
    const last_transactionID = "0x13c18c0c359b0d528894c3e1f8a2420f9698d2596e31573bca6feb425134d227";

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

    async function call_new_transaction(){
        const timestamp = Date.now();
        const tx = new Transaction();

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

    // @ts-ignore
    async function is_valid() : Promise<boolean>{
        const tx = new Transaction();

        tx.moveCall({
            arguments: [
                tx.object(last_transactionID),
                tx.object("0x6")
            ],
            target: `${contract_address}::safehotel::is_valid`
        });

        signAndExecute({
            transaction: tx
        },{
            onSuccess: (result) => {
                console.log(result);
            },
            onError: (error) => {
                console.log(error);
            }
        })
    }

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

    return(
        <>
            <NavBar/>
            {/*<button onClick={call_test}>Transaction</button>*/}
            <button onClick={call_new_transaction}>WOLOLO</button>
            <button onClick={is_valid}>Valide ?</button>
            <p>
                Signature: {signature}
            </p>
        </>
    )
}

export default Transaction_page;