import { ethers } from "hardhat";
import LENS_HUB_ABI from '../abi/LensHubABI.json';
import { DataTypes } from "../LensTypes/LensHub";
import { mumbaiClient, challenge, authenticate, client } from '../lensApi/api'
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import {getToken} from './helpers/authenticate'
import { v4 as uuidv4 } from 'uuid';
import { uploadIpfs } from "./helpers/ipfs";
import { Metadata, PublicationMainFocus } from "./helpers/interfaces/publication";
import { CreatePostTypedDataDocument, CreatePublicPostRequest, BroadcastDocument, BroadcastRequest} from "./helpers/graphql/generated";
import { BigNumber, Signer, TypedDataDomain } from "ethers";
import { omit } from "./helpers/helpers";
import { useIpfs } from "./helpers/useIpfs";
import { getCreateCommentRequest, getCreatePostRequest, signCreateCommentTypedData, signCreatePostTypedData } from "./helpers/pub";
import { pollUntilIndexed } from "./helpers/indexer/has-transaction-been-indexed";

const LENS_HUB_MUMBAI_PROXY = "0x60Ae865ee4C725cd04353b5AAb364553f56ceF82"



//the purpose of this script is to create a post and have the other signers comment. 
async function main() {
  const deployers:SignerWithAddress[] = await ethers.getSigners()
  // array of 5 signers
  const contracts = await Promise.all(deployers.map(async dep => await ethers.getContractAt(LENS_HUB_ABI, LENS_HUB_MUMBAI_PROXY, dep)))
  console.log(contracts.length)


// dep0 makes a post, dep1, dep2, dep3 comment. 
const poster = deployers[0]
const posterProfileId:string = (await contracts[0].defaultProfile(poster.address)).toHexString() // getting it from on-chain LENSTER DOES NOT DO THIS
const profileIdNum = (await contracts[0].defaultProfile(poster.address)).toString() // dec for the end
// console.log(profileIdNum)


const ipfsResult = await useIpfs(`lucky lens 0 giveaway :)`)


const createPostRequest = getCreatePostRequest(posterProfileId, ipfsResult)

const signedResult = await signCreatePostTypedData(createPostRequest, poster);
console.log('create post: signedResult', signedResult);

const nonce = signedResult.result.typedData.value.nonce + 1
console.log(`nonce is ${nonce}`)
const bigNum = BigNumber.from(nonce)
const pubId = bigNum.toHexString()
const pubIdNum = bigNum.toString() // dec for the end
const {result: {id}, signature} = signedResult

const signerClient = await mumbaiClient(poster)
const broadcastResult = await signerClient.mutation(BroadcastDocument, {request: {id, signature}}).toPromise()
console.log('broadcast post:', broadcastResult);
if (broadcastResult.data?.broadcast.__typename !== 'RelayerResult') {
  console.error('follow with broadcast: failed', broadcastResult);
  throw new Error('follow with broadcast: failed');
}

console.log('create post: poll until indexed');
const indexedResult = await pollUntilIndexed({txHash: broadcastResult.data.broadcast.txHash}, poster)

console.log('create post: post has been indexed');

// this is so fucking stupid the way they did this


// // copy above logic but do it for post
for(let i = 1; i<deployers.length ; i++) {
  const commenter = deployers[i]
  const profileId = (await contracts[0].defaultProfile(commenter.address)).toHexString()
  // {profileId}-{publicationId}
  const ipfsResult = await useIpfs(`I am entry number ${i}. pick me! pick me!`)
  const createCommentRequest = getCreateCommentRequest(profileId, posterProfileId, pubId, ipfsResult)
  console.log(createCommentRequest)
  const signedResult = await signCreateCommentTypedData(createCommentRequest, commenter)
  console.log('create comment: signedResult', signedResult)
  const {result: {id}, signature} = signedResult

  const signerClient = await mumbaiClient(commenter)
  const broadcastResult = await signerClient.mutation(BroadcastDocument, {request: {id, signature}}).toPromise()
  console.log('broadcast comment:', broadcastResult);
  if (broadcastResult.data?.broadcast.__typename !== 'RelayerResult') {
  console.error('comment with broadcast: failed', broadcastResult);
  throw new Error('comment with broadcast: failed');
}
console.log('create comment: poll until indexed');
const indexedResult = await pollUntilIndexed({txHash: broadcastResult.data.broadcast.txHash}, commenter)

console.log('create comment: comment has been indexed');
}


console.log(`POSTS AND COMMENTS SUCCESSFUL @ProfileId: ${profileIdNum} and pubId: ${pubIdNum}`)



}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
