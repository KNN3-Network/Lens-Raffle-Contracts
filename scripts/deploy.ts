import hre, {ethers} from 'hardhat'

const LensHubProxyMumbai = '0x60Ae865ee4C725cd04353b5AAb364553f56ceF82'

async function main() {
  const deployers = await ethers.getSigners()

  console.log(`deployer is: ${deployers[0].address}`)
  const LuckyLensFactory = await ethers.getContractFactory("contracts/LuckyLens.sol:LuckyLens")
  const LuckyLens = await LuckyLensFactory.deploy(LensHubProxyMumbai)
  await LuckyLens.deployed()
  console.log(`LuckyLens contract deployed at ${LuckyLens.address}`)
  await LuckyLens.deployTransaction.wait(6)
  await hre.run("verify:verify", {
    address: LuckyLens.address,
    constructorArguments: ['0x60Ae865ee4C725cd04353b5AAb364553f56ceF82'],
  });
  


}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
