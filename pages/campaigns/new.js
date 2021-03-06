import React, { Component } from "react";
import { Form, Button, Input } from "semantic-ui-react";
import Layout from "../../components/Layout";

class CampaignNew extends Component {
  state = {
    minimumContribution: ""
  };
  render() {
    return (
      <Layout>
        <h3>Create a Campaign</h3>

        <Form>
          <Form.Field>
            <label>Mimimum Contribution</label>
            <Input
              label="wei"
              labelPosition="right"
              placeholder="Input the Minimum Contribution to be a Contributor"
              value={this.state.minimumContribution}
              onChange={event =>
                this.setState({ minimumContribution: event.target.value })
              }
            />
          </Form.Field>
          <Button primary>Create!</Button>
        </Form>
      </Layout>
    );
  }
}

export default CampaignNew;
