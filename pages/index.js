import React, { Component } from "react";
import { Card, Button } from "semantic-ui-react";
import factory from "../ethereum/factory";
import Layout from "../components/Layout";

// export default () => {
//   return <h1>This is the campaign list page!!!</h1>;
// };

class CampaignIndex extends Component {
  // async componentDidMount() {
  //   const campaigns = await factory.methods.getDeployedCampaigns().call();
  //
  //   console.log(campaigns);
  // }
  //Using 'componentDidMount' is standard react--and is vaid, but next.js will
  //render the component on the server first and this method 'componentDidMount' is not
  //executed on the next.js server execution.  So we need to accomplish the fetching of data in a
  //different method.

  //'static' denotes a class function
  static async getInitialProps() {
    const campaigns = await factory.methods.getDeployedCampaigns().call();

    return { campaigns: campaigns }; //return the object to the Component's props
  }

  renderCampaigns() {
    const items = this.props.campaigns.map(address => {
      return {
        header: address,
        description: <a>View Campaigns</a>,
        fluid: true
      };
    });
    return <Card.Group items={items} />;
  }

  //putting the link tag into the render() is a temporary thing
  render() {
    return (
      <Layout>
        <div>
          <h3>Open Campaigns</h3>

          <Button
            floated="right"
            content="Create Campaign"
            icon="add"
            primary
          />
          {this.renderCampaigns()}
        </div>
      </Layout>
    );
  }
}

export default CampaignIndex;
