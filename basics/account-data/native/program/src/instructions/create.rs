use borsh::{ BorshDeserialize, BorshSerialize };
use solana_program::{
    account_info::{ AccountInfo, next_account_info },
    entrypoint::ProgramResult, 
    program::invoke,
    pubkey::Pubkey,
    rent::Rent,
    system_instruction,
    system_program,
    sysvar::Sysvar,
};

use crate::state::AddressInfo;


pub fn create_address_info(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    address_info: AddressInfo,
) -> ProgramResult {

    let accounts_iter = &mut accounts.iter();
    let address_info_account = next_account_info(accounts_iter)?;
    let payer = next_account_info(accounts_iter)?;
    let system_program = next_account_info(accounts_iter)?;

    let account_span = (address_info.try_to_vec()?).len();
    let lamports_required = (Rent::get()?).minimum_balance(account_span);

    invoke(
        &system_instruction::create_account(
            &payer.key,
            &address_info_account.key,
            lamports_required,
            account_span as u64,
            program_id,
        ),
        &[
            payer.clone(), address_info_account.clone(), system_program.clone()
        ]
    )?;
    
    address_info.serialize(&mut &mut address_info_account.data.borrow_mut()[..])?;
    Ok(())
}

