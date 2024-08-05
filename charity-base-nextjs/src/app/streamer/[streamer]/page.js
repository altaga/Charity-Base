"use client";
import { getStreams } from "@/api/getPlaybackInfo";
import { getStreamers } from "@/api/userData";
import StreamerContainer from "@/app/components/streamerContainer";
import StreamerContainerStream from "@/app/components/streamerContainerStream";
import { abiERC20 } from "@/contracts/erc20";
import { epsilonRound } from "@/utils/utils";
import { Button } from "@mui/material";
import {
  useWeb3ModalAccount,
  useWeb3ModalProvider,
} from "@web3modal/ethers5/react";
import { BigNumber, Contract, providers } from "ethers";
import {
  formatEther,
  formatUnits,
  parseEther,
  parseUnits,
} from "ethers/lib/utils";
import "hls-video-element";
import Image from "next/image";
import Link from "next/link";
import React, { useCallback } from "react";

export default function Streamer({ params }) {
  const [streamer, setStreamer] = React.useState({});
  const [streamers, setStreamers] = React.useState([]);
  const { isConnected } = useWeb3ModalAccount();
  const { walletProvider } = useWeb3ModalProvider();
  const [balance, setBalance] = React.useState(BigNumber.from(0));
  const [balanceBTC, setBalanceBTC] = React.useState(BigNumber.from(0));
  const [balanceCharity, setBalanceCharity] = React.useState(BigNumber.from(0));
  const [balanceBTCCharity, setBalanceBTCCharity] = React.useState(
    BigNumber.from(0)
  );
  const [amount, setAmount] = React.useState("");
  const [tokenSelected, setTokenSelected] = React.useState("BASE");
  const [loading, setLoading] = React.useState(false);

  const setup = useCallback(async () => {
    const [users, streams] = await Promise.all([getStreamers(), getStreams()]);
    const streamers = users.map((user) => {
      return {
        ...user,
        online: streams[user.streamID] ?? false,
      };
    });
    const streamer = streamers.find(
      (user) => user.username === params.streamer
    );
    setStreamer(streamer);
    setStreamers(streamers);
  }, [params.streamer]);

  const cryptoSetup = useCallback(async () => {
    const ethersProvider = new providers.Web3Provider(walletProvider);
    const erc20Contract = new Contract(
      "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
      abiERC20,
      ethersProvider
    );
    const signer = await ethersProvider.getSigner();
    const address = await signer.getAddress();
    const [balance, balanceCharity, balanceUSDC, balanceUSDCCharity] =
      await Promise.all([
        signer.getBalance(),
        ethersProvider.getBalance(streamer.publicKey),
        erc20Contract.balanceOf(address),
        erc20Contract.balanceOf(streamer.publicKey),
      ]);
    setBalance(balance);
    setBalanceCharity(balanceCharity);
    setBalanceBTC(balanceUSDC);
    setBalanceBTCCharity(balanceUSDCCharity);
  }, [walletProvider, streamer]);

  const donate = useCallback(async () => {
    setLoading(true);
    try {
      if (tokenSelected === "USDC") {
        const ethersProvider = new providers.Web3Provider(walletProvider);
        const signer = await ethersProvider.getSigner();
        const erc20Contract = new Contract(
          "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
          abiERC20,
          signer
        );
        const tx = await erc20Contract.transfer(
          streamer.publicKey,
          parseUnits(amount, 6)
        );
        await tx.wait();
        cryptoSetup();
        setLoading(false);
      }
      if (tokenSelected === "BASE") {
        const ethersProvider = new providers.Web3Provider(walletProvider);
        const signer = await ethersProvider.getSigner();
        const tx = await signer.sendTransaction({
          to: streamer.publicKey,
          value: parseEther(amount),
        });
        await tx.wait();
        cryptoSetup();
        setLoading(false);
      }
    } catch (e) {
      setLoading(false);
    }
  }, [amount, tokenSelected, walletProvider, cryptoSetup, streamer]);

  React.useEffect(() => {
    setup();
  }, [setup]);

  React.useEffect(() => {
    if (isConnected && streamers.length > 0) {
      cryptoSetup();
    }
  }, [isConnected, streamers, cryptoSetup]);

  return (
    <div className="container">
      <div className="side-bar">
        <h5
          style={{
            color: "#ffffff",
            textAlign: "left",
            width: "90%",
            marginBottom: "10px",
            marginTop: "15px",
          }}
        >
          RECOMMENDED CHANNELS
        </h5>
        {streamers.map((streamerKey, i) => {
          return <StreamerContainer key={i} {...streamerKey} />;
        })}
      </div>
      <div className="home-container2">
        {JSON.stringify(streamer) !== "{}" && (
          <div className="video-container2">
            {streamer.online ? (
              <hls-video
                src={`https://livepeercdn.studio/hls/${streamer.streamURL}/index.m3u8`}
                height="auto"
                width="100%"
                controls
              />
            ) : (
              <video height="auto" width="100%" controls>
                <source src={streamer.defaultSession} />
              </video>
            )}
            <StreamerContainerStream {...streamer} />
          </div>
        )}
      </div>
      <div className="side-bar2">
        <h3
          style={{
            color: "#ffffff",
            textAlign: "center",
            width: "90%",
          }}
        >
          <Link
            href={`https://base.blockscout.com/address/${streamer.publicKey}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#ffffff" }}
          >
            {streamer?.charity}
          </Link>
        </h3>
        <h4
          style={{
            color: "#ffffff",
            textAlign: "left",
            width: "90%",
          }}
        >
          Amount Raised
        </h4>
        <div className="token-container2">
          <Image
            style={{ border: "2px solid #ffffff", borderRadius: "50%" }}
            src="/assets/base.png"
            alt="Token Logo"
            width={40}
            height={40}
          />
          <div
            style={{
              color: "#ffffff",
            }}
          >
            {epsilonRound(formatEther(balanceCharity), 4)} BASE
          </div>
        </div>
        <div className="token-container2">
          <Image
            style={{ border: "2px solid #ffffff", borderRadius: "50%" }}
            src="/assets/usdc.png"
            alt="Token Logo"
            width={40}
            height={40}
          />
          <div
            style={{
              color: "#ffffff",
            }}
          >
            {epsilonRound(formatUnits(balanceBTCCharity, 8), 8)} USDC
          </div>
        </div>
        <div
          style={{
            borderBottom: "1px solid #ffffff",
            width: "90%",
            paddingTop: "10px",
          }}
        />
        <h4
          style={{
            color: "#ffffff",
            textAlign: "left",
            width: "90%",
            marginBottom: "20px",
            marginTop: "20px",
          }}
        >
          Account Balance
        </h4>
        <div
          className="token-container"
          onClick={() => setTokenSelected("BASE")}
        >
          <Image
            style={{ border: "2px solid #ffffff", borderRadius: "50%" }}
            src="/assets/base.png"
            alt="Token Logo"
            width={40}
            height={40}
          />
          <div
            style={{
              color: "#ffffff",
            }}
          >
            {epsilonRound(formatEther(balance), 4)} BASE
          </div>
        </div>
        <div
          className="token-container"
          onClick={() => setTokenSelected("USDC")}
        >
          <Image
            style={{ border: "2px solid #ffffff", borderRadius: "50%" }}
            src="/assets/usdc.png"
            alt="Token Logo"
            width={40}
            height={40}
          />
          <div
            style={{
              color: "#ffffff",
            }}
          >
            {epsilonRound(formatUnits(balanceBTC, 8), 8)} USDC
          </div>
        </div>
        <div
          style={{
            borderBottom: "1px solid #ffffff",
            width: "90%",
            paddingTop: "10px",
          }}
        />
        <h4
          style={{
            color: "#ffffff",
            textAlign: "left",
            width: "90%",
            marginBottom: "20px",
            marginTop: "20px",
          }}
        >
          Token to Donate {tokenSelected}
        </h4>
        <input
          label="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="input-field"
          type="number"
        />
        <Button
          disabled={(amount === "" && !loading) || !isConnected}
          onClick={() => donate()}
          variant="contained"
          color="base"
          style={{ color: "#ffffff", fontSize: "20px", fontFamily: "Inter" }}
        >
          Donate
        </Button>
      </div>
    </div>
  );
}
