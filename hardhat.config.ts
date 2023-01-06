import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import '@typechain/hardhat'
import '@nomiclabs/hardhat-ethers'
// import '@nomiclabs/hardhat-waffle'
import * as dotenv from "dotenv";
dotenv.config({path: '~/.zshrc'});

const DEV1:string = process.env.DEV_PRIVATE_KEY || ""
const DEV2:string =  process.env.DEV_PRIVATE_KEY_2 || ""
const MNEMONIC:string = process.env.TEST_MNEMONIC || ""

const config: HardhatUserConfig = {
  solidity: {compilers: [
    { version: "0.8.17" },
    { version: "0.8.10" }
  ]},
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
    },
    mumbaiSim: {
      url: "https://polygon-mumbai.g.alchemy.com/v2/LlPfIiQ_9R3vvvqY5HOadGN68ej0_I9z",
      // accounts: [DEV1, DEV2],
      accounts: {
        mnemonic: MNEMONIC,
        path: "m/44'/60'/0'/0",
        initialIndex: 0,
        count: 5,
        passphrase: "",
      } /* generates 0x1cCb1bceD04De363b6515367945E8076ca060299
                     0xf760b66ed5A6a58A092eEd2DCf41EeEdcb9EC1c4
                     0x8653f6b8Cea55361c746Df350516Bc62DAA176Df
                     0x437dA8CAB2BbA532f574a8D0238A775bDAb4cBe0
                     0xF47708d43b8D186dc473B779E6Ec19b6B1155c3c
                     */
    },
    mumbaiDev: {
      url: "https://polygon-mumbai.g.alchemy.com/v2/LlPfIiQ_9R3vvvqY5HOadGN68ej0_I9z",
      // accounts: [DEV1, DEV2],
      accounts: [DEV1, DEV2],
    }
  },
  etherscan: {
    apiKey: {
      polygonMumbai: 'H36AJYC5NPVURKBKFZNG3Z8812QBSZBU5S',
      polygon: 'H36AJYC5NPVURKBKFZNG3Z8812QBSZBU5S'
    }
  },
}

export default config;
