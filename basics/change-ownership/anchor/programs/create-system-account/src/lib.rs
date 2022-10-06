use anchor_lang::prelude::*;
use anchor_lang::system_program;


declare_id!("6gUwvaZPvC8ZxKuC1h5aKz4mRd7pFyEfUZckiEsBZSbk");

const LAMPORTS_PER_SOL: u64 = 1000000000;

#[program]
pub mod create_system_account {
    use super::*;

    pub fn create_system_account(ctx: Context<CreateSystemAccount>) -> Result<()> {

        msg!("Program invoked. Creating a system account...");
        msg!("  New public key will be: {}", &ctx.accounts.new_account.key().to_string());

        system_program::create_account(
            CpiContext::new(
                ctx.accounts.system_program.to_account_info(),
                system_program::CreateAccount {
                    from: ctx.accounts.payer.to_account_info(),         // From pubkey
                    to: ctx.accounts.new_account.to_account_info(),     // To pubkey
                },
            ),
            1 * LAMPORTS_PER_SOL,                           // Lamports (1 SOL)
            0,                                         // Space
            &ctx.accounts.system_program.key(),         // Owner
        )?;

        msg!("Account created succesfully.");
        Ok(())
    }
}

#[derive(Accounts)]
pub struct CreateSystemAccount<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,
    #[account(mut)]
    pub new_account: Signer<'info>,
    pub system_program: Program<'info, System>,
}