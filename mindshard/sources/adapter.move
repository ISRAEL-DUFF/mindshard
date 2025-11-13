module mindshard::adapter;

use sui::event;
use std::option;
use sui::address;
use mindshard::errorCode;

public struct Adapter has key, store {
    id: UID,
    uploader: address,
    cid: vector<u8>,
    manifest_hash: vector<u8>,
    version: u64,
    parent: option::Option<ID>,
    license: vector<u8>,
    flags: u8
}

public struct AdapterMinted has copy, drop {
    id: ID,
    uploader: address,
    cid: vector<u8>,
    manifest_hash: vector<u8>,
    version: u64
}

public struct AdapterUpdated has copy, drop {
    id: ID,
    updater: address,
    cid: vector<u8>,
    manifest_hash: vector<u8>,
    version: u64
}

public struct AdapterFlagged has copy, drop {
    id: ID,
    reporter: address,
    reason: vector<u8>
}

public entry fun publish_adapter(
    cid: vector<u8>,
    manifest_hash: vector<u8>,
    license: vector<u8>,
    uploader: address,
    ctx: &mut TxContext
) {
    // let uploader = tx_context::sender(ctx);
    let adapter = Adapter {
        id: object::new(ctx),
        uploader,
        cid,
        manifest_hash,
        version: 1u64,
        parent: option::none<ID>(),
        license,
        flags: 0u8
    };

    event::emit(AdapterMinted {
        id: object::uid_to_inner(&adapter.id),
        uploader,
        cid: adapter.cid,
        manifest_hash: adapter.manifest_hash,
        version: adapter.version
    });

    transfer::transfer(adapter, uploader);

    // adapter
}

public entry fun update_adapter(
    mut adapter: Adapter,
    new_cid: vector<u8>,
    new_manifest_hash: vector<u8>,
    ctx: &mut TxContext
) {
    let sender = tx_context::sender(ctx);
    assert!(sender == adapter.uploader, errorCode::onlyAdapterCanUpdate());

    adapter.parent = option::some(object::uid_to_inner(&adapter.id));
    adapter.cid = new_cid;
    adapter.manifest_hash = new_manifest_hash;
    adapter.version = adapter.version + 1u64;

    event::emit(AdapterUpdated {
        id: object::uid_to_inner(&adapter.id),
        updater: sender,
        cid: adapter.cid,
        manifest_hash: adapter.manifest_hash,
        version: adapter.version
    });

    transfer::transfer(adapter, sender);
} 

public entry fun flag_adapter(mut adapter: Adapter, reason: vector<u8>, ctx: &mut TxContext) {
    let reporter = tx_context::sender(ctx);
    let uploader: address = adapter.uploader;
    adapter.flags = adapter.flags | 1u8;

    event::emit(AdapterFlagged {
        id: object::uid_to_inner(&adapter.id),
        reporter,
        reason
    });

    transfer::transfer(adapter, uploader);
}

public fun summarize(adapter: &Adapter): (address, vector<u8>, vector<u8>, u64) {
    (adapter.uploader, adapter.cid, adapter.manifest_hash, adapter.version)
}

public fun id(adapter: &Adapter): ID {
    object::uid_to_inner(&adapter.id)
}

public fun uploader(adapter: &Adapter): address {
    adapter.uploader
}

