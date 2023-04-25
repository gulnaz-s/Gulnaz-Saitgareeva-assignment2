import { useReducer } from "react";
import { BrowserRouter } from "react-router-dom";
import { getInitialAuthState, reduceAuthState } from "./control/authState";
// import UserFeedPage from "./UserFeedPage";
// import GlobalFeedPage from "./GlobalFeedPage";
import { AuthContext, AuthDispatchContext } from "./control/context";
import { Route, Routes } from "react-router";
import GlobalFeedPage from "./GlobalFeedPage";
import Navbar from "./navbar/Navbar";

import "./App.module.css";
import {
  URL_GLOBAL_FEED,
  URL_SIGNUP,
  URL_USERS,
  URL_USER_FEED,
} from "./control/url";
import UserFeedPage from "./UserFeedPage";
import UsersPage from "./UsersPage";
import SignUpPage from "./SignUpPage";

function App() {
  const [authState, dispatchAuthState] = useReducer(
    reduceAuthState,
    null,
    getInitialAuthState
  );

  return (
    <AuthContext.Provider value={authState}>
      <AuthDispatchContext.Provider value={dispatchAuthState}>
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route path={URL_GLOBAL_FEED} element={<GlobalFeedPage />} />
            <Route path={URL_USER_FEED} element={<UserFeedPage />} />
            <Route path={URL_USERS} element={<UsersPage />} />
            <Route path={URL_SIGNUP} element={<SignUpPage />} />
          </Routes>
        </BrowserRouter>
      </AuthDispatchContext.Provider>
    </AuthContext.Provider>
  );
}

export default App;
