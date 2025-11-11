module mindshard::errorCode;

// only uploader can update adapter
const EOnlyAdapter: u64 = 101;

// only seller can cancel listing
const EOnlySeller: u64 = 201;

const EListingNotActive: u64 = 301;

// insufficient payment
const EInsufficientPayment: u64 = 302;


public fun onlyAdapterCanUpdate(): u64 { EOnlyAdapter }
public fun onlySellerCanCancel(): u64 { EOnlySeller }
public fun listingNotActive(): u64 { EListingNotActive }
public fun insufficientPayment(): u64 { EInsufficientPayment }