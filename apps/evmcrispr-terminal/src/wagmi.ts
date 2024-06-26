import { createConfig, http } from "wagmi";
import { injected, walletConnect } from "wagmi/connectors";

import {
  arbitrum,
  gnosis,
  goerli,
  mainnet,
  optimism,
  polygon,
  polygonZkEvm,
  sepolia,
} from "wagmi/chains";

import { safe } from "./overrides/safe";

const WALLETCONNECT_PROJECT_ID = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID;
const isIframe = window.self !== window.top;

export const config = createConfig({
  chains: [
    mainnet,
    sepolia,
    goerli,
    gnosis,
    polygon,
    polygonZkEvm,
    optimism,
    arbitrum,
  ],
  connectors: [
    !isIframe && injected(),
    !isIframe &&
      WALLETCONNECT_PROJECT_ID &&
      walletConnect({
        projectId: WALLETCONNECT_PROJECT_ID,
      }),
    isIframe &&
      safe({
        allowedDomains: [/app.safe.global$/],
        unstable_getInfoTimeout: 500,
      }),
  ].filter(Boolean),
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
    [goerli.id]: http(),
    [gnosis.id]: http(),
    [polygon.id]: http(),
    [polygonZkEvm.id]: http(),
    [optimism.id]: http(),
    [arbitrum.id]: http(),
  },
});
