import { BigInt, Bytes } from "@graphprotocol/graph-ts";
import { LiquidityPool, User } from "../generated/schema";
import { LiquidityPool as LiquidityPoolContract } from "../generated/LiquidityPool/LiquidityPool";

export function handleLiquidityPool(event: EthereumEvent): void {
  let pool = LiquidityPool.load(event.address.toHex());
  if (!pool) {
    pool = new LiquidityPool(event.address.toHex());
  }

  let contract = LiquidityPoolContract.bind(event.address);
  pool.token0 = contract.token0();
  pool.token1 = contract.token1();
  pool.reserve0 = contract.reserve0();
  pool.reserve1 = contract.reserve1();
  pool.totalSupply = contract.totalSupply();
  pool.save();
}

export function handleUserBalance(event: EthereumEvent): void {
  let user = User.load(event.params.user.toHex());
  if (!user) {
    user = new User(event.params.user.toHex());
  }

  let contract = LiquidityPoolContract.bind(event.address);
  user.balance = contract.balanceOf(event.params.user);
  user.initialLiquidity = contract.initialLiquidity(event.params.user);
  user.roi = contract.calculateROI(event.params.user);
  user.save();
}