async function callApi(method, endpoint, body = {}) {
  const url = new URL(`/api/${endpoint}`, window.location.href);
  const headers = new Headers();
  headers.append("Content-Type", "application/json");
  headers.append("Accept", "application/json");
  const options = {
    method,
    headers,
    credentials: "include",
  };
  if (method !== "GET") {
    options.body = JSON.stringify(body);
  }
  let response;
  try {
    response = await fetch(url, options);
  } catch (err) {
    return {
      success: false,
      error: `Network error: ${err.message}`,
    };
  }
  let data;
  try {
    data = await response.json();
  } catch (err) {
    data = { error: `Server error: ${err.message}` };
  }
  if (response.ok) {
    return {
      success: true,
      data,
    };
  }
  return {
    success: false,
    ...data,
  };
}

export async function apiGetUserFeed(username) {
  return await callApi("GET", `users/${username}/feed`);
}

export async function apiGetGlobalFeed() {
  return await callApi("GET", "tweets");
}

export async function apiGetUsers() {
  return await callApi("GET", "users");
}

export async function apiPostTweet(message) {
  return await callApi("POST", "tweets", { message });
}

export async function apiEditTweet(id, message) {
  return await callApi("PUT", `tweets/${id}`, { message });
}

export async function apiDeleteTweet(id) {
  return await callApi("DELETE", `tweets/${id}`);
}

export async function apiRestoreTweet(id) {
  return await callApi("PUT", `tweets/${id}/restore`);
}

export async function apiLogIn(username, password) {
  return await callApi("POST", "login", { username, password });
}

export async function apiLogOut() {
  return await callApi("POST", "logout");
}

export async function apiSignUp(username, password) {
  return await callApi("POST", "signup", { username, password });
}

export async function getLoggedInUser() {
  return await callApi("GET", "me");
}

export async function apiUpdateDescription(description) {
  return await callApi("PUT", "me/description", { description });
}

export async function apiGetCurrentUser() {
  return await callApi("GET", "me");
}
