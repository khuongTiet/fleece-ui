import axios from "axios";

export const uploadContent = async content => {
  const response = await axios.post(
    `${process.env.REACT_APP_API_URL}/data`,
    content
  );

  if (response.status === 201) {
    return response;
  }

  throw new Error("Unable to upload content to server");
};

export const getContent = async id => {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_API_URL}/data/display/${id}`
    );

    if (response.status === 200) {
      return response;
    }
  } catch (error) {
    return {
      data: {},
      status: 404
    };
  }
};
