import Head from 'next/head'
import Image from 'next/image'
import { useState } from 'react'
import {NFTCard} from './components/nftCard'



function Home  () {
  const [wallet, setWalletAddress] = useState("");
  const [collection, setCollectionAddress] = useState("");
  const [NFTs, setNFTs] = useState([]);
  const [fetchForCollection, setFetchForCollection] = useState(false);
  
  const fetchNFTs = async () => {
    let nfts;
    console.log("Searching nfts");

    const API_KEY = `4qq9PZ_bDzVfx589fzh6GdJZ12U4PJY4`;  
    const baseURL = `https://polygon-mumbai.g.alchemy.com/v2/${API_KEY}/getNFTs/`;

    if (!collection.length) {
      var requestOptions = {
        method: 'GET'
      };

      const fetchURL = `${baseURL}?owner=${wallet}`;

      nfts = await fetch(fetchURL, requestOptions).then(data => data.json());
    } else {
      console.log("Searching NFTs for collection owned by address")
      const fetchURL = `${baseURL}?owner=${wallet}&contractAddresses%5B%5D=${collection}`;
      nfts = await fetch(fetchURL, requestOptions).then(data => data.json())
    }
    if (nfts) {
      console.log("These are the NFTs:", nfts);
      setNFTs(nfts.ownedNfts);
    }
  };

  const fetchNFTsForCollection = async () => {
    if (collection.length) {
      var requestOptions = {
        method: 'GET'
      };
      
      //const API_KEY = "INGRESAR API KEY";
      //const baseURL = `https://eth-mainnet.alchemyapi.io/v2/${API_KEY}/getNFTsForCollection/`;
      const baseURL = `https://polygon-mumbai.g.alchemy.com/v2/${API_KEY}/getNFTsForCollection/`;
      
      const fetchURL = `${baseURL}?contractAddress=${collection}&withMetadata=${"true"}`;
      const nfts = await fetch(fetchURL, requestOptions).then(data => data.json());

      if (nfts) {
        console.log("NFTS in collection;", nfts);
        setNFTs(nfts.nfts)
      }
    }
  };
  //onClick={`${nft.contract.address}`}



  return (
    <div className="flex flex-col items-center justify-center py-8 gap-y-3">
      <div className="flex flex-col w-full justify-center items-center gap-y-2">
        <h2 className={"font-bold"}>SEARCH ALL NFTS OF A WALLET ADDRESS IN POLYGON NETWORK</h2>
        <input disabled={fetchForCollection} className="w-2/5 bg-slate-100 py-2 px-2 rounded-lg text-gray-800 focus:outline-blue-300 disabled:bg-slate-50 disable:text-gray-50" onChange={(e) => { setWalletAddress(e.target.value); } } value={wallet} type={"text"} placeholder="Add any wallet address on Polygon"></input>
        <input className="w-2/5 bg-slate-100 py-2 px-2 rounded-lg text-gray-800 focus:outline-blue-300 disabled:bg-slate-50 disable:text-gray-50" onChange={(e) => { setCollectionAddress(e.target.value)}} value={collection} type={"text"} placeholder="Add any collection address on Polygon"></input>  
        <label className="text-gray-600"><input onChange={(e) => {setFetchForCollection(e.target.checked)}} type={"checkbox"}className="mr-3"></input>Search by collection</label>
        <button className={"disabled:bg-slate-500 text-white bg-blue-500 px-4 py-2 mt-3 rounded-sm w-1/5"} onClick={
          () => {
          if(fetchForCollection){
            fetchNFTsForCollection()
            }else fetchNFTs()
          }
        }>View NFTs</button>
      </div>
      <div className='flex flex-wrap gap-y12 mt-4 w-5/6 gap-x-2 justify-center'>
        {
          NFTs.length && NFTs.map(nft =>{
            return (
              <NFTCard nft={nft}></NFTCard>
            )
          })
        }
      </div>
    </div>
  )
}

export default Home
