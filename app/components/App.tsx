"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useEffect, useRef, useState } from "react";
import { useAccount } from "wagmi";
import { UploadImage } from "./UploadImage";
import iArtNFTJson from "../api/assets/contracts/iArtNFT.json";
import { NextPage } from "next";
import Head from "next/head";

// export default function App() {
const App: NextPage = () => {
    const { address, isConnected } = useAccount();

    const [paintingTitle, setpaintingTitle] = useState<string>("");
    const [paintingDescription, setPaintingDescription] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [status, setStatus] = useState<string>("");
    
    const styles = [
      { emoji: "🖼️", value: "Realism", name: "Realismo" },
      { emoji: "🖼️", value: "Painterly", name: "Pictórico" },
      { emoji: "🖼️", value: "Impressionism", name: "Impresionismo" },
      { emoji: "🖼️", value: "Expressionism", name: "Expresionismo" },
      { emoji: "🖼️", value: "Fauvism", name: "Fauvismo" },
      { emoji: "🖼️", value: "Photorealism", name: "Foto realismo" },
      { emoji: "🖼️", value: "Cubism", name: "Cubismo" },
    ];
  
    const [state, setState] = useState({
      style: "",
      imageSize: "medium",
      batchSize: "1",
      resolution: "1",
      temperature:"0"
    }); 
  
    const handleChange = ({
      target: { name, value },
    }: React.ChangeEvent<HTMLInputElement>) => {
      setState({
        ...state,
        [name]: value,
      });
    };
  
    const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
      const { name, value } = event.target;
      setState({
        ...state,
        [name]: value,
      });
    };
  
    const [imageIsLoading, setImageIsLoading] = useState(false);
    const [image, setImage] = useState<string | null>(null);
  
    const messagesContainerRef = useRef<HTMLDivElement>(null);
  
    useEffect(() => {
      if (messagesContainerRef.current) {
        messagesContainerRef.current.scrollTop =
          messagesContainerRef.current.scrollHeight;
      }
    }, [paintingDescription]);
  
    return (
        <div >
            <Head>
                <title>iArt NFTs</title>
                <meta
                content=""
                name="iArt NFTs"
                />
                <link href="/favicon.ico" rel="icon" />
            </Head>

            <div className="text-center flex flex-col">
                <h1 className="font-semibold font-sans text-3xl">{process.env.NEXT_PUBLIC_RAINBOW_PROJECT_NAME || 'iArt NFTs'}</h1>
                <div className="flex flex-wrap justify-center mt-4">
                <ConnectButton />
                </div>
                { 
                    !isConnected ? (
                        <div className="mt-4 font-semibold">Conecta tu billetera para comenzar 🚀</div>
                    ) 
                    :
                    (
                        <>
                            {
                            image && 
                            <div className="card w-full h-screen max-w-md py-5 mx-auto stretch">
                                <img src={`data:image/jpeg;base64,${image}`} />
                                <textarea
                                className="mt-4 w-full text-white bg-black h-64"
                                value={`Titulo: ${paintingTitle}\n\nDescripción: ${paintingDescription}`}
                                readOnly
                                />
                                <div className="flex flex-col bg-base-100 px-10 py-10 text-center items-center max-w-xs rounded-3xl">
                                    <UploadImage 
                                        backend_url={`${process.env.NEXT_PUBLIC_API_URL}/ipfs`} 
                                        imageContent={image}
                                        imageTitle={paintingTitle}
                                        imageDescription={paintingDescription}
                                        contractAddress={process.env.NEXT_PUBLIC_NFT_CONTRACT_ADDR || '0x'}
                                        contractAbi={iArtNFTJson.abi}
                                        walletAddress={address}
                                        className="w-full"
                                    />
                                </div>
                            </div>
                            }
                            { imageIsLoading &&
                            <div className="flex justify-center items-center h-screen">
                                <div className="loader">
                                    <div className="animate-pulse flex space-x-4">
                                        <div className="rounded-full bg-slate-700 h-10 w-10"></div>
                                        <span className="h-10 justify-center content-center">{status}</span>
                                    </div>
                                </div>
                            </div>
                            } 
                            { !imageIsLoading &&
                            <div className="flex flex-col w-full h-screen max-w-md py-5 mx-auto stretch">
                                <div className="overflow-auto mb-8 w-full" ref={messagesContainerRef}>
                                {isLoading && (
                                    <div className="flex justify-end pr-4">
                                    <span className="animate-bounce">...</span>
                                    </div>
                                )}
                                </div>
                                <div className="center-0 w-full">
                                    <div className="flex flex-col justify-center mb-2 items-center">
                                        {paintingDescription.length === 0 && (
                                        <div>
                                            <div className="space-y-4 bg-opacity-50 bg-gray-700 rounded-lg p-4">
                                            <h3 className="w-full text-xl font-semibold justify-center text-center">Selecciona el Estilo de tu NFT:</h3>
                                
                                            <div className="flex flex-wrap justify-center">
                                                {styles.map(({ value, emoji, name }) => (
                                                <div
                                                    key={value}
                                                    className="p-4 m-2 bg-opacity-25 bg-gray-600 rounded-lg"
                                                >
                                                    <input
                                                    id={value}
                                                    type="radio"
                                                    name="style"
                                                    value={value}
                                                    onChange={handleChange}
                                                    />
                                                    <label className="ml-2" htmlFor={value}>
                                                    {`${emoji} ${name}`}
                                                    </label>
                                                </div>
                                                ))}
                                            </div>
                                            </div>
                                            <div className="text-center mt-4">
                                                <button
                                                    className="bg-blue-500 p-2 text-white rounded-lg shadow-xl"
                                                    disabled={isLoading || !state.style}
                                                    onClick={
                                                        async () => {
                                                        setIsLoading(true);
                                                        setImageIsLoading(true);
                                                        setStatus("Generando la descripcion de tu NFT...");
                                                        console.log(`api: ${process.env.NEXT_PUBLIC_API_URL}/chat`);
                                                        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chat`, {
                                                            method: "POST",
                                                            headers: {
                                                            "Content-Type": "application/json",
                                                            },
                                                            body: JSON.stringify({
                                                            message: state.style,
                                                            }),
                                                    });
                                                    const data = await response.json();
                                                    
                                                    // Cleanup the response:
                                                    const generatedImageIdea = data.messsage.replace(/\r\n|\n|\r/gm," ").replace("   ", " ");
                                                    // console.log(`Generated image idea (text): ${generatedImageIdea}`);
                                                    
                                                    // Parse it to JSON:
                                                    const objGeneratedImageIdea =  JSON.parse(generatedImageIdea);
                                                    console.log(`Generated image idea: ${objGeneratedImageIdea.paintingDescription}`);
                                                    
                                                    // Set the painting description
                                                    setpaintingTitle(objGeneratedImageIdea.paintingTitle);
                                                    setPaintingDescription(objGeneratedImageIdea.paintingDescription);
                                                    setIsLoading(false);
                                                    setStatus("Generando la pintura NFT...");
                                
                                                    // Image generation
                                                    const imageResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/images`, {
                                                        method: "POST",
                                                        headers: {
                                                            "Content-Type": "application/json",
                                                        },
                                                            body: JSON.stringify({
                                                            message: objGeneratedImageIdea.paintingDescription,
                                                        }),
                                                    });
                                                    const imageData = await imageResponse.json();
                                                    setImage(imageData);
                                                    setImageIsLoading(false);
                                                    setStatus("Generando tu NFT...");
                                                    }
                                                }
                                                >
                                                    Pintar mi NFT
                                                </button>
                                            </div>
                                        </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            }
                        </>
                    )
                }   
            </div>
        </div>
    );  
  };

  export default App;