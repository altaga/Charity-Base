# Charity Base

<img src="https://i.ibb.co/y62JZKQ/logoW.png" >

<p>

 Charity Base is a BASEd decentralized streaming platform where creators can create charity-based streams for social, environmental and economic causes.

# Watch our demo video:

[![Demo](https://i.ibb.co/ts552Ph/image.png)]()

# Test the product:

## URL: https://charity-base.vercel.app/

## Requirements

- Use Base Mainnet on Metamask Wallet!
  - Get it on Metamask: https://metamask.io/
  - https://docs.base.org/docs/using-base/

# Diagram:

<img src="https://i.ibb.co/fxRr2Wh/main-diagram-drawio.png" >

## Tech we Use:

- Base Network:
  - ETH and USDC Donations.
- Livepeer:
  - RTMP URL:
    - Url to easily transmit from the OBS and start our transmission.
  - Livestreams and Recordings API:
    - Obtaining the url if a streamer is live.
    - Obtaining the last record of each streamer if he is offline.

# How it's built:

## Base Network:

ETH management and ERC20 Tokens (USDC). This in order to be able to receive and send tokens in the Base ecosystem.

<img src="https://i.ibb.co/4ZTRGgd/image.png">

In order to obtain the balances of each of the ERC20 Tokens in the Base network, the ERC20 interface of the following contract was used, this is the standard ERC20 contract for any EVM, all controlled by the library [Ethers.js](https://docs.ethers.org/v5/).

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

[Complete Code](./charity-base-nextjs/src/app/streamer/[streamer]/page.js)

Within our platform we have a summary where we can see all the donations in real time.

<img src="https://i.ibb.co/VWjxqq8/image.png">

## Livepeer:

<img src="https://i.ibb.co/pf527Tc/image.png">

All the streaming services were done through Livepeer.

<img src="https://i.ibb.co/yRc0xRY/livepeer-diagram-drawio.png">

To manage Streamers, the profiles of each of the Streamers were created within the Livepeer dashboard, with which we were able to provide each Streamer with their keys to perform their Streams.

<img src="https://i.ibb.co/5hq2C1C/Screenshot-2024-07-23-183857.png">

Thanks to the Livepeer APIs it was possible for us to obtain if the Streamers were doing a Live, thanks to this the viewers could always be aware when a live stream is made.

<img src="https://i.ibb.co/Nr3Kdxc/image.png">

The section of code that allows us to obtain the profiles, recordings and states (live or offline) is the following.

Code Snippet:

    "use server";
    import { Livepeer } from "livepeer";

    const livepeer = new Livepeer({
        apiKey: process.env.LIVEPEER_APIKEY,
    });

    export async function getStreams() {
        const result = await livepeer.stream.getAll("<value>");
        let json = {};
        result.data.forEach((streamer) => {
            json[streamer.id] = streamer.isActive;
        });
        return json;
    }

[Complete Code](./charity-base-nextjs/src/api/getPlaybackInfo.js)

# References

https://www.twitch.tv/creatorcamp/en/connect-and-engage/charity-streaming/

https://www.donordrive.com/charity-streaming/

https://www.youtube.com/watch?v=Hh4T4RuK1H8
