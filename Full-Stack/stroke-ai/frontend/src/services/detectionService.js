import api from "./api";

export const detectStroke = async (formData) => {

  const response = await api.post(
    "/detections",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};
export default detectStroke;