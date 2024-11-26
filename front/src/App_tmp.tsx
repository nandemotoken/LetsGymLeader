import React from 'react';
import {
  DynamicContextProvider,
  DynamicWidget,
} from "@dynamic-labs/sdk-react-core";
import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";

export default function App() {
  return (
    <DynamicContextProvider
      settings={{
        environmentId: "28351dce-984f-4ae2-9624-1264f9470f06",
        walletConnectors: [EthereumWalletConnectors],
      }}
    >
      <DynamicWidget />
    </DynamicContextProvider>
  );
}
