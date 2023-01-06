import { ethers } from "hardhat";
import LENS_HUB_ABI from '../abi/LensHubABI.json';
import MOCK_PROFILE_CREATION_PROXY_ABI from '../abi/CreateProfileAbi.json'
import { getToken } from "./helpers/authenticate";
import { mumbaiClient } from "../lensApi/api";
import { BroadcastDocument, CreateFollowTypedDataDocument } from "./helpers/graphql/generated";
import { signedTypeData } from "./helpers/helpers";
import { pollUntilIndexed } from "./helpers/indexer/has-transaction-been-indexed";
const LENS_HUB_MUMBAI_PROXY = "0x60Ae865ee4C725cd04353b5AAb364553f56ceF82"


async function main() {
  const deployers = await ethers.getSigners()
  // array of 5 signers
  const contracts = await Promise.all(deployers.map(async dep => await ethers.getContractAt(LENS_HUB_ABI, LENS_HUB_MUMBAI_PROXY, dep)))
  console.log(contracts.length)



// for every deployer 1 - 3, we want to connect to the API, authenticate, and submit a follow request
for(let i = 1; i < 4; i++) {
  const user = deployers[i]
  const client = await mumbaiClient(user)
  const request = {follow: [
    {
      profile: "0x6105"
    }
  ]}

  const result = await client.mutation(CreateFollowTypedDataDocument, {request}).toPromise()
  
  const id:string = result.data!.createFollowTypedData.id
  

  const typedData = result.data?.createFollowTypedData.typedData!;
  console.log('follow: typedData', typedData);

  const signature = await signedTypeData(typedData.domain, typedData.types, typedData.value, user);
  console.log('follow: signature', signature);

  const broadcastResult = await client.mutation(BroadcastDocument, {request: {id, signature}}).toPromise()
  console.log('broadcast follow:', broadcastResult);
  if (broadcastResult.data?.broadcast.__typename !== 'RelayerResult') {
  console.error('follow with broadcast: failed', broadcastResult);
  throw new Error('follow with broadcast: failed');
}
console.log('create follow: poll until indexed');
const indexedResult = await pollUntilIndexed({txHash: broadcastResult.data.broadcast.txHash}, user)

console.log('create follow: follow has been indexed');

}



}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
