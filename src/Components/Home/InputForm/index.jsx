import React from "react";

const InputForm = ({
  hasError,
  content,
  handleContentChange,
  handleUploadContent
}) => (
  <div className="home-textinput-container">
    <div className="home-textinput-description">
      Paste your JSON below to get a working endpoint that returns it!
    </div>
    <div className="home-textinput">
      <textarea
        className={`home-textinput-box ${hasError ? "red" : ""}`}
        value={content}
        onChange={e => handleContentChange(e)}
      />
      {hasError && <div className="home-textinput-error">Invalid JSON</div>}
    </div>
    <div
      className={`home-textinput-button ${
        content === "" || hasError ? "inactive" : ""
      }`}
      onClick={handleUploadContent}
    >
      Create Endpoint
    </div>
  </div>
);

export default InputForm;
