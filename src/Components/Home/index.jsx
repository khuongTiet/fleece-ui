import React, { Component } from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import { uploadContent } from "../../utils/api";
import "./Home.css";

export default class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      content: ``,
      expiresAt: 0,
      isCopied: false,
      isCreated: false,
      recentContent: [],
      url: ""
    };
  }

  componentDidMount = () => {
    if (sessionStorage.getItem("fleece-recent")) {
      this.setState({
        recentContent: JSON.parse(sessionStorage.getItem("fleece-recent"))
      });
    }
  };

  copyToClipboard = () => {
    const { url } = this.state;
    const el = document.createElement("textarea");
    el.value = `${process.env.REACT_APP_API_URL}/data/api/${url}`;
    document.body.appendChild(el);
    el.select();
    document.execCommand("copy");
    document.body.removeChild(el);
    this.setState(
      {
        isCopied: true
      },
      () =>
        setTimeout(() => {
          this.setState({
            isCopied: false
          });
        }, 2000)
    );
  };

  formatData = content => {
    return JSON.parse(content);
  };

  handleContentChange = e => {
    this.setState({
      content: e.target.value
    });
  };

  handleUploadContent = async () => {
    const { content, recentContent } = this.state;

    if (content !== "") {
      const { data, status } = await uploadContent(this.formatData(content));

      if (status === 201) {
        sessionStorage.setItem(
          "fleece-recent",
          JSON.stringify([
            ...recentContent,
            { id: data.url, expires: data.expires_at }
          ])
        );
        this.setState({
          expiresAt: data.expires_at,
          isCreated: true,
          recentContent: JSON.parse(sessionStorage.getItem("fleece-recent")),
          url: data.url
        });
      }
    }
  };

  resetHome = () => {
    this.setState({
      content: "",
      isCreated: false
    });
  };

  render() {
    const {
      content,
      isCopied,
      isCreated,
      expiresAt,
      recentContent,
      url
    } = this.state;

    console.log(recentContent);

    return (
      <div className="home-container">
        <div className="home-information-container">
          <div className="home-title" onClick={this.resetHome}>
            Fleece
          </div>
          <div className="home-description">Quick and easy mock endpoints</div>
        </div>
        {isCreated ? (
          <div className="home-upload-result-container">
            <div className="home-upload-result-expires">
              Expires:
              <span className="home-upload-result-expiration-date">
                {moment.unix(expiresAt).format("hh:mm:ssA MM/DD/YYYY")}
              </span>
            </div>
            <div className="home-upload-result-url">
              <div className="home-api-link">
                <div className="home-api-link-label">
                  Use this endpoint to get your data:
                </div>
                {isCopied && (
                  <div className={`home-api-copy-modal`}>Copied!</div>
                )}
                <pre className="home-api-link-content">{`${
                  process.env.REACT_APP_API_URL
                }/data/api/${url}`}</pre>
                <div className="home-api-copy" onClick={this.copyToClipboard}>
                  <i className="far fa-clipboard" />
                </div>
              </div>
            </div>
            <div className="home-upload-result-buttons">
              <Link
                to={{
                  pathname: `/${url}`
                }}
                className="home-upload-result-button primary-button"
              >
                Review
              </Link>
              <div className="home-upload-result-button delete-button">
                Delete
              </div>
            </div>
          </div>
        ) : (
          <div className="home-content-container">
            <div className="home-options-container" />
            <div className="home-textinput-container">
              <div className="home-textinput-description">
                Paste your JSON below to get a working endpoint that returns it!
              </div>
              <div className="home-textinput">
                <textarea
                  className="home-textinput-box"
                  value={content}
                  onChange={e => this.handleContentChange(e)}
                />
              </div>
              <div
                className={`home-textinput-button ${
                  content === "" ? "inactive" : ""
                }`}
                onClick={this.handleUploadContent}
              >
                Create Endpoint
              </div>
            </div>
            <div className="home-upload-recent-container">
              <div className="home-upload-recent-title">Recently stored</div>
              <div className="home-upload-recent-content">
                {recentContent &&
                  recentContent.map(item => {
                    return (
                      <div className="recent-content-item">
                        <div className="recent-content-link">
                          {
                            <Link
                              to={{
                                pathname: `/${item.id}`
                              }}
                            >
                              {item.id}
                            </Link>
                          }
                        </div>
                        <div className="recent-content-expire">
                          {moment.unix(item.expires).fromNow()}
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}
