import * as anchor from "@project-serum/anchor";
import { ProcessingInstructions } from "../target/types/processing_instructions";


describe("custom-instruction-data", () => {

  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const program = anchor.workspace.ProcessingInstructions as anchor.Program<ProcessingInstructions>;

  it("Go to the park!", async () => {
    
    // Again, Anchor makes it super simple.
    //
    await program.methods.goToPark("Jimmy", 3)
    .accounts({})
    .rpc();
    await program.methods.goToPark("Mary", 10)
    .accounts({})
    .rpc();

  });
});
