import {
    Connection,
    Keypair,
    sendAndConfirmTransaction,
    SystemProgram,
    Transaction,
    TransactionInstruction,
} from '@solana/web3.js';
import * as borsh from "borsh";
import { Buffer } from "buffer";

function createKeypairFromFile(path: string): Keypair {
    return Keypair.fromSecretKey(
        Buffer.from(JSON.parse(require('fs').readFileSync(path, "utf-8")))
    )
};


describe("CPI Example", () => {
  
    const connection = new Connection(`http://localhost:8899`, 'confirmed');
    const payer = createKeypairFromFile(require('os').homedir() + '/.config/solana/id.json');
    const hand = createKeypairFromFile('./target/so/hand-keypair.json');
    const lever = createKeypairFromFile('./target/so/lever-keypair.json');

    class Assignable {
        constructor(properties) {
            Object.keys(properties).map((key) => {
                return (this[key] = properties[key]);
            });
        };
    };

    class PowerStatus extends Assignable {
        toBuffer() { return Buffer.from(borsh.serialize(PowerStatusSchema, this)) }
    };
    const PowerStatusSchema = new Map([[ PowerStatus, { kind: 'struct', fields: [ ['is_on', 'u8'] ]} ]]);
    
    class SetPowerStatus extends Assignable {
        toBuffer() { return Buffer.from(borsh.serialize(SetPowerStatusSchema, this)) }
    };
    const SetPowerStatusSchema = new Map([[ SetPowerStatus, { kind: 'struct', fields: [ ['name', 'string'] ]} ]]);
  
    const powerAccount = Keypair.generate();
  
    it("Initialize the lever!", async () => {

        let ix = new TransactionInstruction({
            keys: [
                {pubkey: powerAccount.publicKey, isSigner: true, isWritable: true},
                {pubkey: payer.publicKey, isSigner: true, isWritable: true},
                {pubkey: SystemProgram.programId, isSigner: false, isWritable: false}
            ],
            programId: lever.publicKey,
            data: (new PowerStatus({is_on: true})).toBuffer(),
        });

        await sendAndConfirmTransaction(
            connection, 
            new Transaction().add(ix),
            [payer, powerAccount]
        );
  
    });
  
    it("Pull the lever!", async () => {

        let ix = new TransactionInstruction({
            keys: [
                {pubkey: powerAccount.publicKey, isSigner: false, isWritable: true},
                {pubkey: lever.publicKey, isSigner: false, isWritable: false},
            ],
            programId: hand.publicKey,
            data: new SetPowerStatus({name: "Chris"}).toBuffer(),
        });

        await sendAndConfirmTransaction(
            connection, 
            new Transaction().add(ix),
            [payer]
        );
  
    });
  
    it("Pull it again!", async () => {
  
        let ix = new TransactionInstruction({
            keys: [
                {pubkey: powerAccount.publicKey, isSigner: false, isWritable: true},
                {pubkey: lever.publicKey, isSigner: false, isWritable: false},
            ],
            programId: hand.publicKey,
            data: new SetPowerStatus({name: "Ashley"}).toBuffer(),
        });

        await sendAndConfirmTransaction(
            connection, 
            new Transaction().add(ix),
            [payer]
        );
  
    });
});
  
  