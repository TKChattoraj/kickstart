const assert = require("assert");
const ganache = require("ganache-cli");
const Web3 = require("web3");
const web3 = new Web3(ganache.provider());

const compiledFactory = require("../ethereum/build/CampaignFactory.json");
const compiledCampaign = require("../ethereum/build/Campaign.json");

let accounts;
let factory; //deployed instance of CampaignFactory
let campaignAddress;
let campaign;

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();
  //eth.Contract expects not JSON but a JavaScript object--a JavaScript wrapper of the json
  factory = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
    .deploy({ data: compiledFactory.bytecode })
    .send({ from: accounts[0], gas: "1000000" });

  await factory.methods.createCampaign("100").send({
    from: accounts[0],
    gas: "1000000"
  });

  const deployedContractAddresses = await factory.methods
    .getDeployedCampaigns()
    .call();
  //taking the first element from the returned array and assiging it to 'campaignAddress'
  campaignAddress = deployedContractAddresses[0];

  campaign = await new web3.eth.Contract(
    JSON.parse(compiledCampaign.interface),
    campaignAddress
  );
});

describe("Campaigns", () => {
  it("deploys a factory and a campaign", () => {
    assert.ok(factory.options.address);
    assert.ok(campaign.options.address);
  });

  it("marks caller as the campaign manager", async () => {
    const manager = await campaign.methods.manager().call();
    assert.equal(accounts[0], manager);
    //for assert.equal--what we want it to be is the first parameter and what it actaully is is the second
  });

  it("allows people to contribute money and marks them as approvers", async () => {
    await campaign.methods.contribute().send({
      from: accounts[1],
      value: "101"
    });
    const isContributor = campaign.methods.approvers(accounts[1]);
    //giving the key to the approvers getter
    //will receive 'true' if the key, accounts[1], is a key
    //for the map, meaning the account[1] is a contributor.
    //'False' if not.
    assert(isContributor);
  });

  //use 'try' and 'catch' when you want to test a require statement
  it("requires a minimum contribution", async () => {
    try {
      await campaign.methods.contribute().send({
        from: accounts[0],
        value: "5"
      });
      assert(false);
    } catch (err) {
      assert(err);
    }
  });
  it("allows a manager to create a payment request", async () => {
    await campaign.methods
      .createRequest("Buy Bitcoin", "100", accounts[1])
      .send({
        from: accounts[0],
        gas: "1000000"
      });

    const request = await campaign.methods.requests(0).call();
    assert.equal("Buy Bitcoin", request.description);
    assert.equal("100", request.value);
    assert.equal(accounts[1], request.recipient);
  });

  it("processes requests", async () => {
    await campaign.methods.contribute().send({
      from: accounts[0],
      value: web3.utils.toWei("10", "ether")
    });
    await campaign.methods
      .createRequest("A", web3.utils.toWei("5", "ether"), accounts[1])
      .send({ from: accounts[0], gas: "1000000" });

    let beforeBalance = await web3.eth.getBalance(accounts[1]); //returns a string
    beforeBalance = web3.utils.fromWei(beforeBalance, "ether");
    beforeBalance = parseFloat(beforeBalance);

    await campaign.methods
      .approveRequest(0)
      .send({ from: accounts[0], gas: "1000000" });

    await campaign.methods
      .finalizeRequest(0)
      .send({ from: accounts[0], gas: "1000000" });

    let afterBalance = await web3.eth.getBalance(accounts[1]); //returns a string
    afterBalance = web3.utils.fromWei(afterBalance, "ether");
    afterBalance = parseFloat(afterBalance);
    const difference = afterBalance - beforeBalance;

    assert(difference == 5);
  });
});
