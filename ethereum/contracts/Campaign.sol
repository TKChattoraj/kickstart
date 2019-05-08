//pragma solidity >=0.4.22 <0.6.0;
pragma solidity >0.4.17;

contract CampaignFactory {
    address[] public deployedCampaigns;

    function createCampaign(uint minimum) public {
        address newCampaign = new Campaign(minimum, msg.sender);  //deploys a new Campain contract--remember deployment retursn the address of the deployed instance
        deployedCampaigns.push(newCampaign);
    }
    function getDeployedCampaigns() public view returns (address[]) {
        return deployedCampaigns;
    }
}



contract Campaign {

    struct Request {  //remember:  structs are a declaration of a new type--definiting the idea of a Request, which will need to be instantiated
        string description;  //note that the ';' is used instead of a ',' as would be in javascript
        uint value;
        address recipient;
        bool complete;
        uint approvalCount; //count of those voting 'yes' on the Request
        mapping(address => bool) approvals;

    }

    address public manager;
    uint public minimumContribution; //in Wei
    mapping(address => bool) public approvers;

    Request[] public requests; //an array of Requests structs
    uint public approversCount;

    modifier restricted() {
        require(msg.sender == manager);
        _;
    }

    function Campaign(uint minimum, address creator) public {
        manager = creator;
        minimumContribution = minimum;
    }

    function contribute() public payable {
        require(msg.value > minimumContribution);
        approvers[msg.sender] = true;
        approversCount++;
    }

    function createRequest(string description, uint value, address recipient) public restricted {
        Request memory newRequest = Request({
            description: description,
            value: value,
            recipient: recipient,
            complete: false,
            approvalCount: 0
        });

        requests.push(newRequest);
    }

    function approveRequest(uint index) public {
        Request storage request = requests[index];
        require(approvers[msg.sender]);  //approvers mapping will be 'true' if it has the address key is one that previously contributed to the Campaign
        require(!request.approvals[msg.sender]);  //only allow the voting if the address hasn't already voted

        request.approvals[msg.sender] = true;
        request.approvalCount++;

    }

    function finalizeRequest(uint index) public restricted {
        Request storage request = requests[index];
        require(!request.complete);
        require(request.approvalCount > approversCount/2);
        request.recipient.transfer(request.value);
        request.complete = true;

    }


}
