"use client";
import '@rainbow-me/rainbowkit/styles.css';

// Rainbowkit ===================================================================================================
import { useEffect, useRef, useState } from "react";
import { 
  ConnectButton, 
  getDefaultConfig, 
  RainbowKitProvider, 
  darkTheme } from '@rainbow-me/rainbowkit';
import { arbitrum, arbitrumSepolia } from "wagmi/chains";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const config = getDefaultConfig({
  appName: 'iArt-NFTs',
  projectId: '68600200b77103f00d60e60690ae4e20',
  chains: [arbitrumSepolia, arbitrum],
});

const queryClient = new QueryClient();
// ==============================================================================================================

export default function Chat() {
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
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider theme={darkTheme()}>
          <div className="text-center flex flex-col " >
            <h1 className="font-semibold font-sans text-3xl">EducatETH - iArt-NFTs</h1>
            <div className="flex flex-wrap justify-center mt-4">
              <ConnectButton />
            </div>
            {
              image &&
              <div className="card w-full h-screen max-w-md py-24 mx-auto stretch">
                <img src={`data:image/jpeg;base64,${image}`} />
                <textarea
                  className="mt-4 w-full text-white bg-black h-64"
                  value={paintingDescription}
                  readOnly
                />
              </div>
            }
            { imageIsLoading &&
              <div className="flex justify-center items-center h-screen">
                <div className="loader">
                  <div className="animate-pulse flex space-x-4 justify-center content-center">
                    <div className="rounded-full bg-slate-700 h-10 w-10"></div>
                    <span className="h-10">{status}</span>
                  </div>
                </div>
              </div>
            } 
            { !imageIsLoading &&
              <div className="flex flex-col w-full h-screen max-w-md py-24 mx-auto stretch">
                <div className="overflow-auto mb-8 w-full" ref={messagesContainerRef}>
                  {isLoading && (
                    <div className="flex justify-end pr-4">
                      <span className="animate-bounce">...</span>
                    </div>
                  )}
                </div>
                <div className="fixed center-0 w-full max-w-md">
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
                            className="bg-blue-500 p-2 text-white rounded shadow-xl"
                            disabled={isLoading || !state.style}
                            onClick={
                              async () => {
                              setIsLoading(true);
                              setImageIsLoading(true);
                              setStatus("Generando la descripcion de tu NFT...");
                              
                              const response = await fetch("api/chat", {
                                method: "POST",
                                headers: {
                                  "Content-Type": "application/json",
                                },
                                body: JSON.stringify({
                                  message: state.style,
                                }),
                              });
                              const data = await response.json();
                              // alert(data.messsage);
                              setPaintingDescription(data.messsage);
                              setIsLoading(false);
                              setStatus("Generando la pintura NFT...");
        
                              // Image generation
                              const imageResponse = await fetch("api/images", {
                                method: "POST",
                                headers: {
                                  "Content-Type": "application/json",
                                },
                                body: JSON.stringify({
                                  message: data.messsage,
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
          </div>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );  
}