module mindshard::marketplace;

use sui::event;
use sui::address;
use sui::coin::{Self, Coin, split};
use sui::sui::SUI;
use sui::balance;
use sui::transfer;

use mindshard::adapter::{Adapter};
use mindshard::errorCode;

public struct Listing has key, store {
    id: UID,
    adapter_id: ID,
    seller: address,
    price: u64,
    royalty_basis_points: u64,
    active: bool
}

public struct ListedEvent has copy, drop {
    listing_id: ID,
    adapter_id: ID,
    seller: address,
    price: u64
}

public struct PurchasedEvent has copy, drop {
    listing_id: ID,
    adapter_id: ID,
    buyer: address,
    price_paid: u64
}

public entry fun create_listing(
    adapter: Adapter,
    price: u64,
    royalty_basis_points: u64,
    ctx: &mut TxContext
) {
    let seller = tx_context::sender(ctx);

    let listing = Listing {
        id: object::new(ctx),
        adapter_id: adapter.id(),
        seller,
        price,
        royalty_basis_points,
        active: true
    };

    event::emit(ListedEvent {
        listing_id: object::uid_to_inner(&listing.id),
        adapter_id: listing.adapter_id,
        seller,
        price
    });

    // Transfer the listing to the seller
    transfer::public_transfer(listing, seller);
    transfer::public_transfer(adapter, seller);
}

public entry fun cancel_listing(mut listing: Listing, ctx: &mut TxContext) {
    let sender = tx_context::sender(ctx);
    assert!(sender == listing.seller, errorCode::onlySellerCanCancel());
    listing.active = false;

    transfer::public_transfer(listing, sender);
}

public entry fun buy_listing(
    mut listing: Listing,
    mut payment: Coin<SUI>,
    mut adapter: Adapter,
    ctx: &mut TxContext 
) {
    let buyer = tx_context::sender(ctx);
    assert!(listing.active, errorCode::listingNotActive());
    let paid_amount = coin::value(&payment);

    assert!(paid_amount >= listing.price, errorCode::insufficientPayment());

    let royalty = (listing.price * listing.royalty_basis_points) / 10000u64;
    let seller_amount = listing.price - royalty;

    let royalty_coin = split(&mut payment, royalty, ctx);
    let seller_coin = split(&mut payment, seller_amount, ctx);

    let seller = listing.seller;

    transfer::public_transfer(royalty_coin, adapter.uploader());
    transfer::public_transfer(seller_coin, seller);

    event::emit(PurchasedEvent {
        listing_id: object::uid_to_inner(&listing.id), 
        adapter_id: listing.adapter_id,
        buyer,
        price_paid: listing.price
    });

    listing.active = false;

    // TODO: verify that this transfers is correct
    transfer::public_transfer(listing, seller); 
    transfer::public_transfer(adapter, seller);
    transfer::public_transfer(payment, seller);

}

public fun is_active(listing: &Listing): bool { listing.active }
public fun get_price(listing: &Listing): u64 { listing.price }


#[test]
fun test_listing_helpers() {
    // create a dummy transaction context for testing
    let ctx = &mut sui::tx_context::dummy();
    let seller = sui::tx_context::sender(ctx);

    // create a UID for the listing and derive an ID for the adapter (reusing the UID's inner
    // value is fine for this small unit test; we consume the UID below)
    let listing_uid = sui::object::new(ctx);
    let adapter_id = sui::object::uid_to_inner(&listing_uid);

    let listing = Listing {
        id: listing_uid,
        adapter_id: adapter_id,
        seller: seller,
        price: 100u64,
        royalty_basis_points: 250u64,
        active: true
    };

    // assert helpers
    assert!(is_active(&listing), 1);
    assert!(get_price(&listing) == 100u64, 2);

    // clean up: transfer the listing to the seller so the test doesn't leak objects
    sui::transfer::public_transfer(listing, seller);
}
