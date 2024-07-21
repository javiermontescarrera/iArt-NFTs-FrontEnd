import { useState } from "react";
import { parseEther } from "viem";
// import { useContractWrite, usePrepareContractWrite, useWaitForTransaction } from "wagmi";
import { 
  type BaseError, 
  useWaitForTransactionReceipt, 
  useWriteContract 
} from 'wagmi';

export function UploadImage(params: any) {
  // console.log(JSON.stringify(params));

  // Wagmi new version====================================================================================
  const { 
    data: hash,
    error,  
    isPending, 
    writeContract 
  } = useWriteContract() 

  const { isLoading: isConfirming, isSuccess: isConfirmed } = 
    useWaitForTransactionReceipt({ 
      hash, 
    })
  // =====================================================================================================

  const [nftMinted, setNftMinted] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [ipfsHash, setIpfsHash] = useState("");

  const handleMintNFT = (event: any) => {
    console.log(`Minting nft...`);
    setLoading(true);

    const objIPFSUploadBody = {imageContent: params.imageContent};
    // console.log(`objIPFSUploadBody: ${JSON.stringify(objIPFSUploadBody)}`);

    try {
      // Uploading the rimage to IPFS:
      fetch(`${params.backend_url}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(objIPFSUploadBody),
      })
      .then(res => res.json())
      .then(ipfsData => {
        console.log(`IPFS response: ${JSON.stringify(ipfsData)}`);
        setIpfsHash(ipfsData.result.IpfsHash);
        setLoading(false);
  
        console.log(`ipfsData.IpfsHash> ${ipfsData.result.IpfsHash}`);
        try {
          writeContract({ 
            address: params.contractAddress, 
            abi: params.contractAbi, 
            functionName: 'mintToPayer', 
            args: [
              `iArtNFT - ${params.imageTitle}`, 
              `${params.imageDescription}`, 
              ipfsData.result.IpfsHash
            ],
            // value: parseEther('0.0015'), 
            value: parseEther('0.0000015'), 
          })

          setNftMinted(true);
        } catch (error) {
          console.error(error);
        }
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleNewDiagnose = (event: any) => {
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    fileInput.click();
  }

  if (isLoading) return(
    <div className="animate-pulse flex space-x-4">
      <div className="rounded-full bg-slate-700 h-10 w-10"></div>
      <span className="h-10 justify-center content-center">Subiendo to image a IPFS...</span>
    </div>
  );

  return (
    <>
      <div className="w-full display:flex flex-col justify-center align-center">
        {
          (!nftMinted) && 
          <button 
            className="bg-blue-500 p-2 text-white rounded-lg shadow-xl" 
            disabled={nftMinted}
            onClick={handleMintNFT}>
            Mintear mi NFT
          </button> 
        } 
        {hash && <div>Transaction Hash: {hash}</div>}
        {isConfirming && <div>Waiting for confirmation...</div>} 
        {isConfirmed && (
          <div>
            <div>Transacción confirmada.</div>
            <div className="text-center text-yellow-500 font-bold">Felicitaciones, tu NFT 🖼️ ha sido minteado 😎!</div>
          </div>
          )}  
        {error && ( 
          <div>Error: {(error as BaseError).shortMessage || error.message}</div> 
          )}
      </div>
    </>
  );
}
