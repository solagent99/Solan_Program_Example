import * as anchor from "@project-serum/anchor";
import { AnchorProgramExample } from "../target/types/anchor_program_example";

describe("Account Data!", () => {

  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const payer = provider.wallet as anchor.Wallet;
  const program = anchor.workspace.AnchorProgramExample as anchor.Program<AnchorProgramExample>;

  const addressInfoAccount = anchor.web3.Keypair.generate();

  it("Create the address info account", async () => {
    console.log(`Payer Address      : ${payer.publicKey}`);
    console.log(`Address Info Acct  : ${addressInfoAccount.publicKey}`);
    await program.methods.createAddressInfo(
      "Joe C",
      136,
      "Mile High Dr.",
      "Solana Beach",
    )
      .accounts({
        addressInfo: addressInfoAccount.publicKey,
        payer: payer.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([payer.payer])
      .rpc();
  });

  it("Read the new account's data", async () => {
    const addressInfo = await program.account.addressInfo.fetch(
      addressInfoAccount.publicKey
    );
    console.log(`Name     : ${addressInfo.name}`);
    console.log(`House Num: ${addressInfo.houseNumber}`);
    console.log(`Street   : ${addressInfo.street}`);
    console.log(`City     : ${addressInfo.city}`);
  });
});
