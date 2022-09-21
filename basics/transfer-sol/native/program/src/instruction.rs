use solana_program::{
    account_info::{ AccountInfo, next_account_info }, 
    entrypoint::ProgramResult, 
    program::invoke,
    pubkey::Pubkey,
    system_instruction,
};


pub fn transfer_sol_with_cpi(
    accounts: &[AccountInfo],
    amount: u64,
) -> ProgramResult {

    let accounts_iter = &mut accounts.iter();
    let payer = next_account_info(accounts_iter)?;
    let recipient = next_account_info(accounts_iter)?;
    let system_program = next_account_info(accounts_iter)?;

    invoke(
        &system_instruction::transfer(payer.key, recipient.key, amount),
        &[payer.clone(), recipient.clone(), system_program.clone()],
    )?;
    
    Ok(())
}

pub fn transfer_sol_with_program(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    amount: u64,
) -> ProgramResult {

    let accounts_iter = &mut accounts.iter();
    let payer = next_account_info(accounts_iter)?;
    let recipient = next_account_info(accounts_iter)?;

    **payer.try_borrow_mut_lamports()? -= amount;
    **recipient.try_borrow_mut_lamports()? += amount;
    
    Ok(())
}