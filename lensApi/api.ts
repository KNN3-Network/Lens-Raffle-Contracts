
import { createClient } from 'urql'

const API_URL = 'https://api-mumbai.lens.dev'



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