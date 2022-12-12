import { Metadata, PublicationMainFocus } from "./interfaces/publication";
import { v4 as uuidv4 } from 'uuid';
import { uploadIpfs } from "./ipfs";
import type {AddResult} from 'ipfs-core-types/src/root'

export const useIpfs:(content: string)=>Promise<AddResult> = async (content) => await uploadIpfs<Metadata>({
  version: '2.0.0',
  mainContentFocus: PublicationMainFocus.TEXT_ONLY,
  metadata_id: uuidv4(),
  description: 'Description',
  locale: 'en-US',
  content: `${content}`,
  external_url: null,
  image: null,
  imageMimeType: null,
  name: 'Name',
  attributes: [],
  tags: ['using_api_examples'],
  appId: 'api_examples_github',
});
// console.log('create post: ipfs result', ipfsResult);
