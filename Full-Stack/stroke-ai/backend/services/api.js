import axios from "axios";

export const predict = async (data) => {
  const response = await axios.post("http://localhost:3000/predict", data);
  return response.data;
};