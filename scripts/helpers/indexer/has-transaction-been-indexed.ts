import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { mumbaiClient } from '../../../lensApi/api';
import { HasTxHashBeenIndexedDocument, HasTxHashBeenIndexedRequest } from '../graphql/generated';

const hasTxBeenIndexed = async (request: HasTxHashBeenIndexedRequest, signer: SignerWithAddress) => {
  const client = await mumbaiClient(signer)
  const result = await client.query(HasTxHashBeenIndexedDocument, { request }).toPromise()

  return result.data!.hasTxHashBeenIndexed;
};

export const pollUntilIndexed = async (input: { txHash: string } | { txId: string }, signer: SignerWithAddress) => {
  while (true) {
    const response = await hasTxBeenIndexed(input, signer);
    console.log('pool until indexed: result', response);

    if (response.__typename === 'TransactionIndexedResult') {
      console.log('pool until indexed: indexed', response.indexed);
      console.log('pool until metadataStatus: metadataStatus', response.metadataStatus);

      console.log(response.metadataStatus);
      if (response.metadataStatus) {
        if (response.metadataStatus.status === 'SUCCESS') {
          return response;
        }

        if (response.metadataStatus.status === 'METADATA_VALIDATION_FAILED') {
          throw new Error(response.metadataStatus.status);
        }
      } else {
        if (response.indexed) {
          return response;
        }
      }

      console.log('pool until indexed: sleep for 1500 milliseconds then try again');
      // sleep for a second before trying again
      await new Promise((resolve) => setTimeout(resolve, 1500));
    } else {
      // it got reverted and failed!
      throw new Error(response.reason);
    }
  }
};