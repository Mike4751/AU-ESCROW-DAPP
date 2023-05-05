Decentralized Escrow Application
This is an Escrow Dapp built with Hardhat.

Project Layout
There are three top-level folders:

/app - contains the front-end application
/contracts - contains the solidity contract
/test - contains tests for the solidity contract
Setup
Install dependencies in the top-level directory with npm install.

After you have installed hardhat locally, you can use commands to test and compile the contracts, among other things. To learn more about these commands run npx hardhat help.

Compile the contracts using npx hardhat compile. The artifacts will be placed in the /app folder, which will make it available to the front-end. This path configuration can be found in the hardhat.config.js file.

Front-End
cd into the /app directory and run npm install

To run the front-end application run npm run dev from the /app directory. Open http://localhost:3000 to view it in your browser.