import React, { Component } from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import { uploadContent } from "../../utils/api";
import "./Home.css";
import fleeceWhite from "../../fleece-white.png";
import InputForm from "./InputForm";
import Results from "./Results";

const Loader = props => {
  return (
    <div className="home-loading-container">
      <i className="fas fa-spinner home-loader-icon rotating" />
      <div className="home-loader-text loading">{props.text}</div>
    </div>
  );
};

export default class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      content: ``,
      expiresAt: 0,
      hasError: false,
      isCopied: false,
      isCreated: false,
      isUploading: false,
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
    try {
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed)) {
        return { data: parsed };
      } else {
        return typeof parsed === "object" ? parsed : "";
      }
    } catch (err) {
      return "";
    }
  };

  handleContentChange = e => {
    const formatted = this.formatData(e.target.value);
    this.setState({
      content: e.target.value,
      hasError: formatted === "" && e.target.value !== ""
    });
  };

  handleDeleteContent = async () => {
    this.setState({
      isCreated: false
    });
  };

  handleUploadContent = async () => {
    const { content, recentContent } = this.state;

    if (content !== "") {
      this.setState({
        isUploading: true
      });
      const formatted = this.formatData(content);
      if (formatted === "") {
        this.setState({
          isUploading: false,
          hasError: true
        });
        return;
      }
      const { data, status } = await uploadContent(formatted);

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
          hasError: false,
          isCreated: true,
          isUploading: false,
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
      hasError,
      isCopied,
      isCreated,
      isUploading,
      expiresAt,
      recentContent,
      url
    } = this.state;

    return (
      <div className="home-container">
        <div className="home-information-container">
          <div className="home-title" onClick={this.resetHome}>
            Fleece
            <img
              src={fleeceWhite}
              alt="Fleece Icon"
              className="home-fleece-icon"
            />
          </div>
          <div className="home-description">Quick and easy mock endpoints</div>
        </div>
        {isUploading ? (
          <Loader text={"Uploading data"} />
        ) : isCreated ? (
          <Results
            copyToClipboard={this.copyToClipboard}
            deleteContent={this.handleDeleteContent}
            expiresAt={expiresAt}
            isCopied={isCopied}
            url={url}
          />
        ) : (
          <div className="home-content-container">
            <div className="home-options-container" />
            <InputForm
              hasError={hasError}
              content={content}
              handleContentChange={this.handleContentChange}
              handleUploadContent={this.handleUploadContent}
            />
            <div className="home-upload-recent-container">
              <div className="home-upload-recent-title">
                {recentContent && recentContent.length > 0 && `Recently stored`}
              </div>
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
                              className="recent-content-link-text"
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
        <div className="home-footer">Made by Khuong Tiet</div>
      </div>
    );
  }
}
