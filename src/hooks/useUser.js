import { useContext, useCallback, useState } from "react";

import Context from "context/user.context";

import { loginService } from "service/loginService";

export default function useUser() {
  const { jwt, setJWT } = useContext(Context);
  const [state, setState] = useState({ loading: false, error: false });

  const handleLogin = useCallback(
    ({ username, password }) => {
      setState({ loading: true, error: false });

      loginService({ username, password })
        .then((jwt) => {
          window.sessionStorage.setItem("jwt", jwt);
          setState({ loading: false, error: false });
          setJWT(jwt);
        })
        .catch((error) => {
          window.sessionStorage.removeItem("jwt", jwt);
          setState({ loading: false, error: true });
          console.error(error);
        });
    },
    [setJWT, jwt]
  );

  const logout = useCallback(() => {
    window.sessionStorage.removeItem("jwt", jwt);
    setJWT(null);
  }, [setJWT, jwt]);

  return { isLogged: Boolean(jwt), login: handleLogin, logout, loginLoading: state.loading, loginError: state.error };
}
