/// Module: safehotel
module safehotel::safehotel {
    use sui::clock::{Clock};

    public struct Transaction has store, key {
        id: UID,
        created_at: u64,
        expiration: u64,
    }

    public entry fun new_transaction(expiration: u64, clock: &Clock, ctx: &mut TxContext) {
        let transaction = Transaction {
            id: object::new(ctx),
            created_at: clock.timestamp_ms(),
            expiration,
        };
        transfer::public_transfer(transaction, ctx.sender());
    }

    public fun is_valid(transaction: &Transaction, clock: &Clock): bool {
        return (clock.timestamp_ms() > transaction.expiration)
    }

}
// sui client ptb --gas-budget 100000000 --assign sender @%MY_ADDRESS% --move-call 0x6775e42517e3e00f9cd719ec1e3419ee8e8222fc3231ec91f519f52f6e33ff07::safehotel::new_transaction --help
