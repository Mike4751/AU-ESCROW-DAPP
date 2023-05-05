import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import deploy from '../components/deploy';
import Escrow from '../components/Escrow';

export async function approve(escrowContract, signer) {
  const approveTxn = await escrowContract.connect(signer).approve();
  await approveTxn.wait();
}

export default function Home() {
  const [escrows, setEscrows] = useState([]);
  const [account, setAccount] = useState();
  const [signer, setSigner] = useState();
  const [provider, setProvider] = useState();

 useEffect(() => {
  if (!provider) {
    if (typeof window.ethereum !== 'undefined' || typeof window.web3 !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      setProvider(provider);
    }
  }
}, [provider]);

useEffect(() => {
  async function getAccounts() {
    const accounts = await provider.send('eth_requestAccounts', []);

    setAccount(accounts[0]);
    setSigner(provider.getSigner());
  }

  if (provider && !account && !signer) {
    getAccounts();
  }
});

  async function newContract() {
    const beneficiary = document.getElementById('beneficiary').value;
    const arbiter = document.getElementById('arbiter').value;
    const value = ethers.BigNumber.from(document.getElementById('wei').value);
    const escrowContract = await deploy(signer, arbiter, beneficiary, value);


    const escrow = {
      address: escrowContract.address,
      arbiter,
      beneficiary,
      value: value.toString(),
      handleApprove: async () => {
        escrowContract.on('Approved', () => {
          document.getElementById(escrowContract.address).className =
            'complete';
          document.getElementById(escrowContract.address).innerText =
            "✓ It's been approved!";
        });

        await approve(escrowContract, signer);
      },
    };

    setEscrows([...escrows, escrow]);
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-purple-300 via-violet-600 to-purple-300'>
      <header className='text-6xl font-bold underline text-center'>Escrow Contract Factory</header>

        <div className="grid grid-cols-3 gap-10 border-solid border-4 rounded border-indigo-600 m-6">
          <h1 className="text-3xl font-bold underline col-start-1 col-end-4 text-center pt-6"> New Contract </h1>

          <label className='font-bold underline m-2'>
            Arbiter Address
            <input className='border-solid border-4 rounded border-indigo-600 m-2' type="text" id="arbiter" />
          </label>

          <label className='font-bold underline m-2'>
            Beneficiary Address
            <input className='border-solid border-4 rounded border-indigo-600 m-2' type="text" id="beneficiary" />
          </label>

          <label className='font-bold underline m-2'>
            Deposit Amount (in Wei)
            <input className='border-solid border-4 rounded border-indigo-600 m-2' type="text" id="wei" />
          </label>

          <div className="flex m-2 space-x-2 justify-start">
          <button
            className="inline-block px-6 py-2.5 bg-purple-700 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-purple-800 hover:shadow-lg focus:bg-purple-800 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-purple-900 active:shadow-lg transition duration-150 ease-in-out"
            id="deploy"
            onClick={(e) => {
              e.preventDefault();

              newContract();
            }}
          >
            Deploy</button>
          </div>
        </div>

        <div className="grid grid-cols-5 gap-10 border-solid border-4 rounded border-indigo-600 m-6">
          <h1 className="text-3xl font-bold underline col-start-1 col-end-6 text-center pt-6"> Existing Contracts </h1>

          <div className='col-start-auto' id="container">
            {escrows.map((escrow) => {
              return <Escrow key={escrow.address} {...escrow} />;
            })}
          </div>
        </div>
      </div>
  );
}