import { ethers } from "hardhat";
import LENS_HUB_ABI from '../abi/LensHubABI.json';
import MOCK_PROFILE_CREATION_PROXY_ABI from '../abi/CreateProfileAbi.json'
const LENS_HUB_MUMBAI_PROXY = "0x60Ae865ee4C725cd04353b5AAb364553f56ceF82"
// const MOCK_PROXY_

async function main() {
  const deployers = await ethers.getSigners()
  for(let deployer of deployers) console.log(deployer.address)
  // array of 5 signers
  const contracts = await Promise.all(deployers.map(async dep => await ethers.getContractAt(LENS_HUB_ABI, LENS_HUB_MUMBAI_PROXY, dep)))



  /**
     * @notice A struct containing the parameters required for the `createProfile()` function.
     *
     * @param to The address receiving the profile.
     * @param handle The handle to set for the profile, must be unique and non-empty.
     * @param imageURI The URI to set for the profile image.
     * @param followModule The follow module to use, can be the zero address.
     * @param followModuleInitData The follow module initialization data, if any.
     * @param followNFTURI The URI to use for the follow NFT.
     */
  /*struct CreateProfileData {
    address to;
    string handle;
    string imageURI;
    address followModule;
    bytes followModuleInitData;
    string followNFTURI;
}*/


const MOCK_PROFILE_CREATION_PROXY = "0x420f0257D43145bb002E69B14FF2Eb9630Fc4736"
const createProfileContracts = await Promise.all(deployers.map(async dep => await ethers.getContractAt(MOCK_PROFILE_CREATION_PROXY_ABI, MOCK_PROFILE_CREATION_PROXY, dep)))

// for(let i = 0; i<createProfileContracts.length; i++) {
//   let CCreateProfile = createProfileContracts[i]
//   let deployer = deployers[i]
//   let address = await deployer.getAddress()
//   console.log('creating profile ', i)


//   let tx = await CCreateProfile.proxyCreateProfile([`${address}`, `lenstester${i}`, "" , '0x0000000000000000000000000000000000000000', '0x', ''], {gasLimit: 450000})
//   console.log(`profile being created at tx_hash: ${tx.hash}`)
//   let tx_r = await tx.wait(1)
//   console.log(tx_r.events)
//   if(tx_r.status !== 1) throw new Error("tx resp status was not 1")
//   console.log(`profile successfully created for address ${i}`)
// }

let profileIds = ['24837', '24838', '24839', '24840', '24841' ] // hardcoded for ease!! 

for(let i = 0; i<contracts.length; i++) {
  let Hub = contracts[i]
  let deployer = deployers[i]
  let address = await deployer.getAddress()

  let tx = await Hub.setDefaultProfile(profileIds[i])
  console.log(`profile being set for ${i} at tx_hash: ${tx.hash}`)
  let tx_r = await tx.wait(1)
  if(tx_r.status !== 1) throw new Error("tx resp status was not 1")
  console.log(`profile successfully set for address ${i}`)
}


}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
