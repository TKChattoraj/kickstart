const path = require("path");
const solc = require("solc");
const fs = require("fs-extra"); //fs is node module for filesystem.  extra is additional stuff

const buildPath = path.resolve(__dirname, "build");
fs.removeSync(buildPath); //removing the contents of build folder and the build folder too

const campaignPath = path.resolve(__dirname, "contracts", "Campaign.sol");
const source = fs.readFileSync(campaignPath, "utf8");

const output = solc.compile(source, 1).contracts; //contains output objects from campaignfactory and campaign

fs.ensureDirSync(buildPath); //check if directory exists and if not creates it

for (let contract in output) {
  //iterate over the keys in map of objects?
  let name = contract.replace(":", "");
  fs.outputJsonSync(path.resolve(buildPath, name + ".json"), output[contract]);
}
