import { Buffer } from 'node:buffer';
import { describe, test } from 'node:test';
import { Keypair, PublicKey, SystemProgram, Transaction, TransactionInstruction } from '@solana/web3.js';
import * as borsh from 'borsh';
import { start } from 'solana-bankrun';

describe('Create a system account', async () => {
  const PROGRAM_ID = PublicKey.unique();
  const context = await start([{ name: 'program', programId: PROGRAM_ID }], []);
  const client = context.banksClient;
  const payer = context.payer;

  class Assignable {
    constructor(properties) {
      for (const [key, value] of Object.entries(properties)) {
        this[key] = value;
      }
    }
  }

  class AddressData extends Assignable {
    toBuffer() {
      return Buffer.from(borsh.serialize(AddressDataSchema, this));
    }
  }

  const AddressDataSchema = new Map([
    [
      AddressData,
      {
        kind: 'struct',
        fields: [
          ['name', 'string'],
          ['address', 'string'],
        ],
      },
    ],
  ]);

  test('Create the account', async () => {
    const newKeypair = Keypair.generate();

    const addressData = new AddressData({
      name: 'Marcus',
      address: '123 Main St. San Francisco, CA',
    });

    // We're just going to serialize our object here so we can check
    // the size on the client side against the program logs
    const addressDataBuffer = addressData.toBuffer();
    console.log(`Address data buffer length: ${addressDataBuffer.length}`);

    const ix = new TransactionInstruction({
      keys: [
        { pubkey: payer.publicKey, isSigner: true, isWritable: true },
        { pubkey: newKeypair.publicKey, isSigner: true, isWritable: true },
        { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
      ],
      programId: PROGRAM_ID,
      data: addressDataBuffer,
    });

    const tx = new Transaction();
    const blockhash = context.lastBlockhash;
    tx.recentBlockhash = blockhash;
    tx.add(ix).sign(payer, newKeypair);

    await client.processTransaction(tx);
  });
});
