import { url } from "./configuration";

export const register = async (body) => {
  const response = await fetch(`${url}/register`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-type": "application/json",
    },
    body: JSON.stringify(body),
  });

  return await response.json();
};

export const retrieve = async () => {
  const response = await fetch(`${url}/retrieve`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-type": "application/json",
    },
  });

  return await response.json();
};

export const update = async (body) => {
  const response = await fetch(`${url}/update`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-type": "application/json",
    },
    body: JSON.stringify(body),
  });

  return await response.json();
};

export const destroy = async (body) => {
  const response = await fetch(`${url}/delete`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-type": "application/json",
    },
    body: JSON.stringify(body),
  });

  return await response.json();
};
