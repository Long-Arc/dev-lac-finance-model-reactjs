import React, { Component, Fragment } from "react";
import "../../components/common/Common.css";
import {
  withStyles,
  useMediaQuery,
} from "@material-ui/core";
import { withRouter } from "react-router-dom";
import { useStyles } from "../../components/common/useStyles";
import { PowerBIEmbed } from 'powerbi-client-react';
import { models } from 'powerbi-client';
import reportData from '../../components/configs/PowerBIReport.json'
import { create } from "../../api-services/Service";

const withMediaQuery =
  (...args) =>
    (Component) =>
      (props) => {
        const mediaQuery = useMediaQuery(...args);
        return <Component mediaQuery={mediaQuery} {...props} />;
      };

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      embedToken: null
    }
  }

  componentDidMount() {
    let loggedInUser = sessionStorage.getItem("loggedInUser");
    if (loggedInUser) {
      this.generateAccessToken();
    } else {
      const { history } = this.props;
      if (history) history.push("/Home");
    }
  }

  generateEmbedToken = (accessToken) => {
    let data = {
      accessLevel: 'View',
      allowSaveAs: true,
      groupId: reportData.CashFlowDetails.groupId,
      reportId: reportData.CashFlowDetails.reportId,
      accessToken: accessToken
    }
    create('/powerBIReport/generateEmbedToken', data)
      .then((response) => {
        if (response && response.token) {
          this.setState({
            embedToken: response.token
          });
        }
      })
  }

  generateAccessToken = () => {
    create('/powerBIReport/generateAccessToken')
      .then((response) => {
        if (response && response.access_token) {
          this.generateEmbedToken(response.access_token);
        }
      })
  }

  render() {
    return (
      <Fragment>
        <PowerBIEmbed
          embedConfig={{
            type: reportData.CashFlowDetails.type,
            id: reportData.CashFlowDetails.reportId,
            embedUrl: reportData.CashFlowDetails.embedUrl,
            accessToken: this.state.embedToken,
            tokenType: models.TokenType.Embed,
            settings: {
              panes: {
                filters: {
                  expanded: false,
                  visible: false
                }
              },
              background: models.BackgroundType.Transparent,
            }
          }}

          eventHandlers={
            new Map([
              ['loaded', function () { console.log('Report loaded'); }],
              ['rendered', function () { console.log('Report rendered'); }],
              ['error', function (event) { console.log(event.detail); }]
            ])
          }

          cssClassName={"embed-container"}
          getEmbeddedComponent={(embeddedReport) => {
            window.report = embeddedReport;
          }}
        />
      </Fragment>
    );
  }
}

export default withRouter(
  withStyles(useStyles)(withMediaQuery("(min-width:600px)")(Dashboard))
);
