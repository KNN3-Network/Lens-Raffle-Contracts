import { ethers } from "hardhat";
import LENS_HUB_ABI from '../abi/LensHubABI.json';
import MOCK_PROFILE_CREATION_PROXY_ABI from '../abi/CreateProfileAbi.json'
const LENS_HUB_MUMBAI_PROXY = "0x60Ae865ee4C725cd04353b5AAb364553f56ceF82"


//the purpose of this script is to create a post and have the other signers comment. 
async function main() {
  const deployers = await ethers.getSigners()
  // array of 5 signers
  const contracts = await Promise.all(deployers.map(async dep => await ethers.getContractAt(LENS_HUB_ABI, LENS_HUB_MUMBAI_PROXY, dep)))
  console.log(contracts.length)


// dep0 makes a post, dep1, dep2, dep3 comment. 
  




   



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
