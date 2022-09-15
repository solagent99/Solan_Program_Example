use anchor_lang::prelude::*;

use instructions::*;

pub mod instructions;
pub mod state;


declare_id!("FFKtnYFyzPj1qFjE9epkrfYHJwZMdh8CvJrB6XsKeFVz");


#[program]
pub mod anchor_program_example {
    use super::*;

    pub fn create_page_visits(
        ctx: Context<CreatePageVisits>
    ) -> Result<()> {
        
        instructions::create::create_page_visits(ctx)
    }

    pub fn increment_page_visits(
        ctx: Context<IncrementPageVisits>
    ) -> Result<()> {
        
        instructions::increment::increment_page_visits(ctx)
    }
}