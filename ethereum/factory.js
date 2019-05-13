import web3 from "./web3"; //getting the instance created by ./web3.

import CampaignFactory from "./build/CampaignFactory.json";

const instance = new web3.eth.Contract(
  JSON.parse(CampaignFactory.interface),
  "0x513a0CF4f5EA9461490A07E63404A0cc684838b9" //address of the deployed CampaignFactory
);

export default instance;
