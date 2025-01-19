import { ArgentTMA } from '@argent/tma-wallet';

export const argentTMA = ArgentTMA.init({
  environment: "sepolia",
  appName: "winterhack",
  appTelegramUrl: "https://t.me/winterhackbot/winterhack",
  sessionParams: {
    allowedMethods: [
      {
        contract: "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7", // STRK token contract
        selector: "transfer" // Method to allow token transfers
      }
    ],
    validityDays: 90
  },
});