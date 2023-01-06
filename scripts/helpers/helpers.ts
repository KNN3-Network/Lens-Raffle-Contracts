import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { TypedDataDomain } from 'ethers/lib/ethers';
// @ts-ignore
import omitDeep from 'omit-deep';

export const prettyJSON = (message: string, obj: string) => {
  console.log(message, JSON.stringify(obj, null, 2));
};

export const sleep = (milliseconds: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
};

export const omit = (object: any, name: string) => {
  return omitDeep(object, name);
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


