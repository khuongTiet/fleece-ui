import React from "react";
import moment from "moment";
import { Link } from "react-router-dom";

const Results = ({
  copyToClipboard,
  deleteContent,
  expiresAt,
  isCopied,
  url
}) => (
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
        {isCopied && <div className={`home-api-copy-modal`}>Copied!</div>}
        <pre className="home-api-link-content">{`${
          process.env.REACT_APP_API_URL
        }/data/api/${url}`}</pre>
        <div className="home-api-copy" onClick={copyToClipboard}>
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
      <div
        className="home-upload-result-button delete-button"
        onClick={deleteContent}
      >
        Delete
      </div>
    </div>
  </div>
);

export default Results;
