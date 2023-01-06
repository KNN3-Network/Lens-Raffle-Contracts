import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { mumbaiClient } from "../../lensApi/api";
import { signedTypeData } from "./helpers";
import { CreateCommentTypedDataDocument, CreatePostTypedDataDocument, CreatePublicCommentRequest, CreatePublicPostRequest } from "./graphql/generated";
import type {AddResult} from 'ipfs-core-types/src/root'

// POST
export const getCreatePostRequest = (profileId:string, ipfsResult:AddResult) => ({
  profileId,
  contentURI: `ipfs://${ipfsResult.path}`,
  collectModule: {
    // feeCollectModule: {
    //   amount: {
    //     currency: currencies.enabledModuleCurrencies.map(
    //       (c: any) => c.address
    //     )[0],
    //     value: '0.000001',
    //   },
    //   recipient: address,
    //   referralFee: 10.5,
    // },
    // revertCollectModule: true,
    freeCollectModule: { followerOnly: true },
    // limitedFeeCollectModule: {
    //   amount: {
    //     currency: '0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889',
    //     value: '2',
    //   },
    //   collectLimit: '20000',
    //   recipient: '0x3A5bd1E37b099aE3386D13947b6a90d97675e5e3',
    //   referralFee: 0,
    // },
  },
  referenceModule: {
    followerOnlyReferenceModule: false,
  },
})

export const createPostTypedData = async (request: CreatePublicPostRequest, signer: SignerWithAddress) => {
  const client = await mumbaiClient(signer)
  const result = await client.mutation(CreatePostTypedDataDocument, {request}).toPromise()
  console.log(result)
  return result.data!.createPostTypedData;
};

export const signCreatePostTypedData = async (request: CreatePublicPostRequest, signer: SignerWithAddress) => {
  const result = await createPostTypedData(request, signer);
  console.log('create post: createPostTypedData', result);

  const typedData = result.typedData;
  console.log('create post: typedData', typedData);

  const signature = await signedTypeData(typedData.domain, typedData.types, typedData.value, signer);
  console.log('create post: signature', signature);

  return { result, signature };
};


// COMMENT
export const getCreateCommentRequest = (profileId:string, posterProfileId:string, pubId:string, ipfsResult:AddResult ) => ({
  profileId,
  // remember it has to be indexed and follow metadata standards to be traceable!
  publicationId: `${posterProfileId}-${pubId}`, //
  contentURI: `ipfs://${ipfsResult.path}`,
  collectModule: {
    // timedFeeCollectModule: {
    //   amount: {
    //     currency: currencies.enabledModuleCurrencies.map((c: any) => c.address)[0],
    //     value: '0.01',
    //   },
    //   recipient: address,
    //   referralFee: 10.5,
    // },
    revertCollectModule: true,
  },
  referenceModule: {
    followerOnlyReferenceModule: false,
  },
})


export const createCommentTypedData = async (request: CreatePublicCommentRequest, signer: SignerWithAddress) => {
  const client = await mumbaiClient(signer)
  const result = await client.mutation(CreateCommentTypedDataDocument, {request}).toPromise()
  console.log(result)
  return result.data!.createCommentTypedData;
};

export const signCreateCommentTypedData = async (request: CreatePublicCommentRequest, signer: SignerWithAddress) => {
  const result = await createCommentTypedData(request, signer);
  console.log('create comment: createCommentTypedData', result);

  const typedData = result.typedData;
  console.log('create comment: typedData', typedData);

  const signature = await signedTypeData(typedData.domain, typedData.types, typedData.value, signer);
  console.log('create comment: signature', signature);

  return { result, signature };
};