import hre, {ethers} from 'hardhat'
import coordinatorABI from '../abi/VRFv2Coordinator.json'

const LensHubProxyMumbai = '0x60Ae865ee4C725cd04353b5AAb364553f56ceF82'
const subId = 2832
const constructorArgs = [subId, LensHubProxyMumbai]

async function main() {
  const deployers = await ethers.getSigners()

  console.log(`deployer is: ${deployers[0].address}`)
  const LuckyLensFactory = await ethers.getContractFactory("contracts/LuckyLens.sol:LuckyLens")
  const LuckyLens = await LuckyLensFactory.deploy(...constructorArgs)
  await LuckyLens.deployed()
  console.log(`LuckyLens contract deployed at ${LuckyLens.address}`)
  await LuckyLens.deployTransaction.wait(6)
  await hre.run("verify:verify", {
    address: LuckyLens.address,
    constructorArguments: constructorArgs,
  });
  
  const Coordinator = await ethers.getContractAt(coordinatorABI, '0x7a1BaC17Ccc5b313516C5E16fb24f7659aA5ebed')
  let tx = await Coordinator.addConsumer(subId, LuckyLens.address)
  tx.wait(1)
  console.log(`consumer added at ${tx.hash}`)


}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
