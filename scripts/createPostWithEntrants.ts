import { ethers } from "hardhat";
import LENS_HUB_ABI from '../abi/LensHubABI.json';
import { DataTypes } from "../LensTypes/LensHub";
import { client, challenge, authenticate } from '../lensApi/api'
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import {getToken} from './helpers/authenticate'
import { v4 as uuidv4 } from 'uuid';
import { uploadIpfs } from "./helpers/ipfs";
import { Metadata, PublicationMainFocus } from "./helpers/interfaces/publication";
import { CreatePostTypedDataDocument, CreatePublicPostRequest } from "./helpers/graphql/generated";
import { Signer, TypedDataDomain } from "ethers";
import { omit } from "./helpers/helpers";

const LENS_HUB_MUMBAI_PROXY = "0x60Ae865ee4C725cd04353b5AAb364553f56ceF82"

export const createPostTypedData = async (request: CreatePublicPostRequest) => {
  const result = await client.mutation(CreatePostTypedDataDocument, {request}).toPromise()

  return result.data!.createPostTypedData;
};

export const signedTypeData = (
  domain: TypedDataDomain,
  types: Record<string, any>,
  value: Record<string, any>,
  signer: SignerWithAddress
) => {
  // const signer = getSigner();
  // remove the __typedname from the signature!
  return signer._signTypedData(
    omit(domain, '__typename'),
    omit(types, '__typename'),
    omit(value, '__typename')
  );
};


export const signCreatePostTypedData = async (request: CreatePublicPostRequest, signer: SignerWithAddress) => {
  const result = await createPostTypedData(request);
  console.log('create post: createPostTypedData', result);

  const typedData = result.typedData;
  console.log('create post: typedData', typedData);

  const signature = await signedTypeData(typedData.domain, typedData.types, typedData.value, signer);
  console.log('create post: signature', signature);

  return { result, signature };
};


//the purpose of this script is to create a post and have the other signers comment. 
async function main() {
  const deployers:SignerWithAddress[] = await ethers.getSigners()
  // array of 5 signers
  const contracts = await Promise.all(deployers.map(async dep => await ethers.getContractAt(LENS_HUB_ABI, LENS_HUB_MUMBAI_PROXY, dep)))
  console.log(contracts.length)


// dep0 makes a post, dep1, dep2, dep3 comment. 
const poster = deployers[0]
  
const token = await getToken(poster)

const ipfsResult = await uploadIpfs<Metadata>({
  version: '2.0.0',
  mainContentFocus: PublicationMainFocus.TEXT_ONLY,
  metadata_id: uuidv4(),
  description: 'Description',
  locale: 'en-US',
  content: 'Content',
  external_url: null,
  image: null,
  imageMimeType: null,
  name: 'Name',
  attributes: [],
  tags: ['using_api_examples'],
  appId: 'api_examples_github',
});
console.log('create post: ipfs result', ipfsResult);

const profileId = (await contracts[0].defaultProfile(poster.address)).toHexString() // getting it from on-chain
console.log(profileId)

// hard coded to make the code example clear
const createPostRequest = {
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
};

const signedResult = await signCreatePostTypedData(createPostRequest, poster);
console.log('create post: signedResult', signedResult);




// for(let i = 0; i<createProfileContracts.length; i++) {
//   let CCreateProfile = createProfileContracts[i]
//   let deployer = deployers[i]
//   let address = await deployer.getAddress()
//   console.log('creating profile ', i)


//   let tx = await CCreateProfile.proxyCreateProfile([`${address}`, `luckylens${i}`, "" , '0x0000000000000000000000000000000000000000', '0x', ''], {gasLimit: 450000})
//   console.log(`profile being created at tx_hash: ${tx.hash}`)
//   let tx_r = await tx.wait(1)
//   if(tx_r.status !== 1) throw new Error("tx resp status was not 1")
//   console.log(`profile successfully created for address ${i}`)
// }


}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
