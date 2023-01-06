
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { Client, createClient } from 'urql'
import { getToken } from '../scripts/helpers/authenticate';

const API_URL = 'https://api-mumbai.lens.dev'

let clients:{[address: string]: Client} = {}


// returns authenticated client to call from
export const mumbaiClient = async (deployer: SignerWithAddress) => {
  console.log(`mumbaiClient called, deployer is ${deployer.address}`)
if(clients[deployer.address]) return clients[deployer.address]
const token = await getToken(deployer)

clients[deployer.address] = createClient({
  url: API_URL,
  fetchOptions: {
    headers: { authorization: token ? `Bearer ${token}` : '' },
  },
  requestPolicy: "network-only"
})
return clients[deployer.address]
}


export const client = createClient({
  url: API_URL,
})

export const challenge = `
  query Challenge($address: EthereumAddress!) {
    challenge(request: { address: $address }) {
      text
    }
  }
`

export const authenticate = `
  mutation Authenticate(
    $address: EthereumAddress!
    $signature: Signature!
  ) {
    authenticate(request: {
      address: $address,
      signature: $signature
    }) {
      accessToken
      refreshToken
    }
  }
`