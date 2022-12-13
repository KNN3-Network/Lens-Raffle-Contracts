import hre, {ethers} from 'hardhat'


async function main() {
  const deployers = await ethers.getSigners()

  console.log(`deployer is: ${deployers[0].address}`)
  const ConsumerFactory = await ethers.getContractFactory("contracts/VRFv2Consumer.sol:VRFv2Consumer")
  const Consumer = await ConsumerFactory.deploy(2832)
  await Consumer.deployed()
  console.log(`LuckyLens contract deployed at ${Consumer.address}`)
  await Consumer.deployTransaction.wait(6)
  await hre.run("verify:verify", {
    address: Consumer.address,
    constructorArguments: [2832],
  });
  


}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
