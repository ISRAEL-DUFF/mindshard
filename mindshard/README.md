MindShard Move Package (with coin handling)
------------------------------------------

Build:
  cd move_package
  sui move build

Publish (example):
  sui client publish --gas 0x... --package move_package

Notes:
- buy_listing uses sui::coin::split and transfer::transfer to handle royalty and seller payouts.
- Ensure your Sui toolchain version supports the used stdlib APIs; these are compatible with modern Sui stdlib versions (v0.33+).
