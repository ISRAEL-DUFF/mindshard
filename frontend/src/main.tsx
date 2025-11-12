import { createRoot } from "react-dom/client";
import App from "./App.tsx";

import { createNetworkConfig, SuiClientProvider, WalletProvider } from '@mysten/dapp-kit';
import { getFullnodeUrl, SuiClient, SuiHTTPTransport } from '@mysten/sui/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { walrus } from '@mysten/walrus';
import '@mysten/dapp-kit/dist/index.css';


import "./index.css";

// Config options for the networks you want to connect to
const { networkConfig } = createNetworkConfig({
	// localnet: { url: getFullnodeUrl('localnet') },
	// devnet: { url: getFullnodeUrl('devnet') },
  testnet: { url: getFullnodeUrl('testnet') },
	mainnet: { url: getFullnodeUrl('mainnet') },
});
const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
    <QueryClientProvider client={queryClient}>
        <SuiClientProvider networks={networkConfig} defaultNetwork="testnet" createClient={(network, config) => {
				return new SuiClient({
					transport: new SuiHTTPTransport({
						url: getFullnodeUrl('testnet'),
                        
						// rpc: {
						// 	headers: {
						// 		Authorization: 'xyz',
						// 	},
						// },
					}),
				}).$extend(
                    walrus({
                        network: network,
                        packageConfig: {
                            systemObjectId: '0x98ebc47370603fe81d9e15491b2f1443d619d1dab720d586e429ed233e1255c1',
                            stakingPoolId: '0x20266a17b4f1a216727f3eef5772f8d486a9e3b5e319af80a5b75809c035561d',
                        },
                    }),
                );
			}}>
            <WalletProvider autoConnect>
                <App />
            </WalletProvider>
        </SuiClientProvider>
    </QueryClientProvider>
);
