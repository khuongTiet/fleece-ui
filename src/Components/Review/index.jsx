import React, { Component } from "react";
import moment from "moment";
import { getContent } from "../../utils/api";
import "./Review.css";

export default class Review extends Component {
  constructor(props) {
    super(props);

    this.state = {
      content: "",
      expiresAt: 0,
      isLoaded: false,
      notFound: false,
      url: this.props.match.params.content_id
    };
  }

  componentDidMount = async () => {
    const { url } = this.state;
    const { data, status } = await getContent(url);

    if (status === 200) {
      this.setState({
        content: data.content,
        expiresAt: data.expires_at,
        isLoaded: true
      });
    } else {
      this.setState({
        isLoaded: true,
        notFound: true
      });
    }
  };

  copyToClipboard = () => {
    const { content } = this.state;
    const el = document.createElement("textarea");
    el.value = JSON.stringify(content);
    document.body.appendChild(el);
    el.select();
    document.execCommand("copy");
    document.body.removeChild(el);
  };

  render() {
    const { content, expiresAt, isLoaded, notFound, url } = this.state;

    return isLoaded ? (
      <div className="review-container">
        {notFound ? (
          <div className="review-missing">
            <div className="review-status">404</div>
            <div className="review-missing-text">
              It seems like this content no longer exists or never existed in
              the first place
            </div>
          </div>
        ) : (
          <div className="review-information">
            <div className="review-header">
              <div className="review-expiration">
                This content will expire on:
                <span className="review-expire-date">
                  {moment.unix(expiresAt).format("hh:mm:ssA MM/DD/YYYY")}
                </span>
              </div>
              <div className="review-api-link">{`${
                process.env.REACT_APP_API_URL
              }/data/api/${url}`}</div>
            </div>

            <div className="review-content">
              <div className="review-content-text">
                <pre>{JSON.stringify(content, null, 4)}</pre>
              </div>
              <div className="review-content-buttons">
                <div
                  className="review-content-button primary"
                  onClick={this.copyToClipboard}
                >
                  <i className="far fa-clipboard" />
                </div>
                <div className="review-content-button delete">
                  <i className="far fa-trash-alt" />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    ) : (
      <div className="loading-container">Loading Content</div>
    );
  }
}
