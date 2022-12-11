import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import '@typechain/hardhat'
import '@nomiclabs/hardhat-ethers'
// import '@nomiclabs/hardhat-waffle'
import * as dotenv from "dotenv";
dotenv.config({path: '~/.zshrc'});

const DEV1:string = process.env.DEV_PRIVATE_KEY || ""
const DEV2:string =  process.env.DEV_PRIVATE_KEY_2 || ""

const config: HardhatUserConfig = {
  solidity: {compilers: [
    { version: "0.8.17" },
    { version: "0.8.10" }
  ]},
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
    },
    mumbai: {
      url: "https://polygon-mumbai.g.alchemy.com/v2/LlPfIiQ_9R3vvvqY5HOadGN68ej0_I9z",
      // accounts: [DEV1, DEV2],
      accounts: {
        mnemonic: "find blind choose clarify exercise spider faith laundry modify coast scorpion mansion buyer ceiling meadow hospital license hedgehog cost divide length boy ceiling critic",
        path: "m/44'/60'/0'/0",
        initialIndex: 0,
        count: 5,
        passphrase: "",
      } /* generates ['0x0bFe1e2D713B25606aF16c5A6969Ef89F062e108',
                      '0x8b0b487bc4c727E7086a94a3843E6d5b1BeF3859',
                      '0x80BF2f7A7391FfeD0BD61F752B24492D835123CB',
                      '0xc90aCECc8D50d116317797fD0330c7be77FdA0BA',
                      '0xC160ab0Db7E12419f24A2d20a4dD851a20BCE215' ]*/


    }
  },
  etherscan: {
    apiKey: {
      mumbai: 'H36AJYC5NPVURKBKFZNG3Z8812QBSZBU5S',
      polygon: 'H36AJYC5NPVURKBKFZNG3Z8812QBSZBU5S'
    }
  },
}

export default config;
