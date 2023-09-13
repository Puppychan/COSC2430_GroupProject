import { config } from "./config";
import { getToken } from "./localstorage";

const getRequest = async (path) => {
  try {
    const params = {
      method: "GET",
      headers: {
        Authorization: "Bearer " + getToken(),
      },
    };
    const res = await fetch(config.baseURL + path, params);
    const data = await res.text();
    return { statusCode: res.status, data };
  } catch (e) {
    console.error(`error in GET Request (${path}) :- `, e);
    return { statusCode: 400, data: [] };
  }
};

const postRequest = async (path, body) => {
  try {
    const params = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + getToken(),
      },
      body: JSON.stringify(body),
    };

    const res = await fetch(config.baseURL + path, params);
    const data = await res.text();
    return { statusCode: res.status, data };
  } catch (e) {
    console.log(`error in POST Request (${path}) :- `, e);
  }
};

const deleteRequest = async (path) => {
  try {
    const params = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + getToken(),
      },
    };

    const res = await fetch(config.baseURL + path, params);
    const data = await res.text();
    return { statusCode: res.status, data };
  } catch (e) {
    console.log(`error in DELETE Request (${path}) :- `, e);
  }
};

const putRequest = async (path, body) => {
  try {
    const params = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + getToken(),
      },
      body: JSON.stringify(body),
    };

    const res = await fetch(config.baseURL + path, params);

    const data = await res.text();
    return { statusCode: res.status, data };
  } catch (e) {
    console.log(`error in PUT Request (${path}) :- `, e);
  }
};

export const Api = {
  getRequest,
  postRequest,
  deleteRequest,
  putRequest,
};
