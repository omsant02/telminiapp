import { ArgentTMA } from '@argent/tma-wallet';

export const argentTMA = ArgentTMA.init({
  environment: "sepolia",
  appName: "winterhack",
  appTelegramUrl: "https://t.me/winterhackbot/winterhack",
  sessionParams: {
    allowedMethods: [
      {
        // ETH on Starknet contract
        contract: "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7",
        selector: "transfer"
      },
      {
        // STRK token contract
        contract: "0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d",
        selector: "transfer"
      }
    ],
    validityDays: 90
  },
});

// Token addresses for reference
export const TOKEN_ADDRESSES = {
  ETH: "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7",
  STRK: "0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d"
} as const;