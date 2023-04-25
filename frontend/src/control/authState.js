export const PAGE_GLOBAL_FEED = "GLOBAL_FEED";
export const PAGE_USER_FEED = "USER_FEED";
export const PAGE_USERS = "USERS";


export const ACTION_SET_AUTH_USER = "SET_AUTH_USER";
export const ACTION_LOGOUT = "LOGOUT";

export function getInitialAuthState() {
  return {
    user: null,
  }
}


export function reduceAuthState(state, action) {
  state = reduceSetAuthStatus(state, action);
  state = reduceLogout(state, action);
  return state;
}


function reduceSetAuthStatus(state, action) {
  if (action.type !== ACTION_SET_AUTH_USER) return state;
  const { username } = action;
  return {
    ...state,
    user: username,
  }
}


function reduceLogout(state, action) {
  if (action.type !== ACTION_LOGOUT) return state;
  return {
    ...state,
    user: null,
  }
}
