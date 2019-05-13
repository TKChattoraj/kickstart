import Web3 from "web3";

//const web3 = new Web3(window.web3.currentProvider);
//'window' is a variable on the browser side
//and so the assumption is that this code is exectued in the browser.
//This will contrast with the use of next.js.  Next.js will execute the
//code on the next.js server first and then send the html to the remote
//browser (with the react app following up and being executed later).

let web3;

if (typeof window !== "undefined" && typeof window.web3 !== "undefined") {
  //We are in the browser and metamask is running
  web3 = new Web3(window.web3.currentProvider);
} else {
  const provider = new Web3.providers.HttpProvider(
    "https://rinkeby.infura.io/v3/621f412220fc4f6dbc00e6f5e5619391"
  );
  web3 = new Web3(provider);
}

export default web3;
