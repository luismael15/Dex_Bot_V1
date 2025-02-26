# Dex_Bot_V1: A Beginner's Guide to Decentralized Exchange (DEX) Interactions with Ethers.js on L2 Base

## Overview

Dex_Bot_V1 is a learning project designed to explore the fundamentals of interacting with Decentralized Exchanges (DEXs) on the L2 Base network using Ethers.js. This project provides a hands-on introduction to blockchain data retrieval and event monitoring, specifically focusing on analyzing swap events.

**Important Disclaimer:** This project is strictly for educational purposes. It is not intended for and should not be used for any financial or commercial activities. The authors and contributors are not responsible for any losses incurred as a result of using this software.

## Project Goals

*   Understand how to connect to and interact with the Base network using Ethers.js.
*   Learn how to fetch and interpret raw blockchain logs.
*   Explore how to extract relevant information about token pools.
*   Monitor and analyze swap events on specific DEX pools.

## Technologies Used

*   **Ethers.js:** A comprehensive JavaScript library for interacting with the Ethereum blockchain and its compatible layers (like Base).
*   **Node.js:**  A JavaScript runtime environment.
*   **Alchemy (or similar):** A blockchain development platform providing API access to the Base network.

## Project Structure and Script Descriptions

The project consists of three main JavaScript files, each designed to demonstrate a specific aspect of DEX interaction:

1.  **`FetchRawLogs.js`**:

    *   **Purpose:** This script demonstrates how to retrieve raw blockchain logs from the Base network using an HTTP request via Alchemy (or a similar provider). It allows you to inspect the structure and format of the data returned, providing a foundation for understanding more specific log types.
    *   **Key Concepts:**
        *   Connecting to the Base network with `JsonRpcProvider`.
        *   Using `provider.getLogs()` to fetch raw logs based on a filter.
        *   Inspecting the raw log data to understand its structure.
    *   **Usage:**  This script helps familiarize you with the raw data format returned by the blockchain.

2.  **`FetchPoolTokens.js`**:

    *   **Purpose:** This script focuses on extracting information about token pools on a DEX. Given a pool address, it retrieves the addresses, symbols, and decimals of the two tokens in the pool.
    *   **Key Concepts:**
        *   Using `ethers.Contract` to interact with smart contracts (Pool and ERC20 contracts).
        *   Calling contract methods (`token0()`, `token1()`, `symbol()`, `decimals()`) to retrieve data.
        *   Using `Promise.all()` to efficiently make multiple asynchronous calls.
    *   **Usage:**  This script provides the foundation for identifying and understanding the composition of different liquidity pools.

3.  **`FetchSwapLogs.js`**:

    *   **Purpose:** This script builds upon the previous two, demonstrating how to subscribe to and analyze swap events on specific DEX pools. It listens for `Swap` events, parses the log data to extract the amounts of tokens swapped, and calculates the price of the token pair.
    *   **Key Concepts:**
        *   Connecting to the Base network using `WebSocketProvider` for real-time event monitoring.
        *   Subscribing to specific events on a contract using `provider.on()`.
        *   Parsing log data to extract relevant information (token amounts, price).
        *   Converting hexadecimal data to usable decimal values.
    *   **Dependencies:** Requires `FetchPoolTokens.js` to retrieve token details for each pool.
    *   **Configuration:** Relies on a `config.js` file to specify the pools to monitor and their corresponding event signatures.
    *   **Usage:**  This script allows you to observe and analyze swap activity on the DEX in real-time, providing insights into market dynamics.

## Setup and Installation

1.  **Install Node.js:** Ensure you have Node.js installed on your system.
2.  **Install Dependencies:** Navigate to the project directory in your terminal and run:

    ```
    npm install ethers
    ```

3.  **Configuration:**
    *   Create a `.env` file in the project root and add your Alchemy (or other provider) API key:

        ```
        Network_URL="YOUR_ALCHEMY_API_KEY"
        Network_URL_Websocket="YOUR_ALCHEMY_WEBSOCKET_API_KEY"
        ```

    *   Create a `config.js` file (if it doesn't exist) to configure the pools you want to monitor.  This file should export a `config` object containing:
        *   `Network_URL`: Your Alchemy API URL for standard requests.
        *   `Network_URL_Websocket`: Your Alchemy WebSocket URL for real-time events.
        *   `pools`: An array of pool objects, each with:
            *   `name`: A descriptive name for the pool.
            *   `address`: The address of the pool contract.
            *   `SwapEventSignature`: The event signature for `Swap` events in the pool contract.  (e.g., `"0xc42079f94a6350d7e6e0f4930f67412214228e4dcc55149f5f7a6da6bcfa1c4"`).  You can typically find this in the contract ABI or by searching online.

    ```
    // config.js
    export const config = {
        Network_URL: 'YOUR_ALCHEMY_API_KEY',
        Network_URL_Websocket: 'YOUR_ALCHEMY_WEBSOCKET_API_KEY',
        pools: [
            {
                name: 'PoolName',
                address: '0xPoolAddress',
                SwapEventSignature: '0xSwapEventSignature'
            }
        ]
    };
    ```

## Running the Scripts

1.  **FetchRawLogs.js:**

    ```
    node FetchRawLogs.js
    ```

2.  **FetchPoolTokens.js:**

    ```
    node FetchPoolTokens.js
    ```

    *   **Note:** You might need to modify this script to specify a pool address to fetch tokens for.  You can either hardcode the address or pass it as a command-line argument.

3.  **FetchSwapLogs.js:**

    ```
    node FetchSwapLogs.js
    ```

    *   This script will connect to the WebSocket, subscribe to the `Swap` events for the pools defined in your `config.js` file, and print the swap information to the console in real-time.

## Further Exploration

*   **Error Handling:** Implement robust error handling in all scripts.
*   **Data Storage:** Store the fetched data in a database or file for later analysis.
*   **More DEX Interactions:** Explore other DEX functionalities, such as adding/removing liquidity.
*   **UI Integration:**  Create a simple user interface to visualize the data.
*   **Security Best Practices:**  Learn about security best practices for interacting with smart contracts.

## License

This project is open-source and available under the [Choose a License - MIT, Apache 2.0, etc.].

## Contributing

Contributions are welcome! Please feel free to submit pull requests or open issues.

