import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'
import { Signer } from 'ethers/lib/ethers'
import { client, challenge, authenticate } from '../../lensApi/api'

let tokens:{[address: string]: string} = {}


export const getToken = async (deployer: SignerWithAddress) => {
  if(tokens[deployer.address]) return tokens[deployer.address]

  try {
    const address = deployer.address
    /* first request the challenge from the API server */
    const challengeInfo = await client.query(challenge, { address } ).toPromise()
    // const provider = new ethers.providers.Web3Provider(window.ethereum);
    // const signer = provider.getSigner()
    const signer = deployer
    console.log(challengeInfo)
    /* ask the user to sign a message with the challenge info returned from the server */
    const signature = await signer.signMessage(challengeInfo.data.challenge.text)
    /* authenticate the user */
    const authData = await client.mutation(authenticate, {address, signature}).toPromise()
    /* if user authentication is successful, you will receive an accessToken and refreshToken */
    console.log(authData)
    const { data: { authenticate: { accessToken }}} = authData
    console.log({ accessToken })
    tokens[signer.address] = accessToken
    return accessToken
  } catch (err) {
    console.log('Error signing in: ', err)
  }

  

}