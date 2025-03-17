import React, { createContext, ReactNode, useEffect, useReducer } from "react";

import { JWTContextType, ActionMap, AuthState, AuthUser } from "@/types/auth";

import { isValidToken, setSession } from "@/utils/jwt";
import { ProfileType } from "unions/unions";
import { userApi } from "services/userApi";

// Note: If you're trying to connect JWT to your own backend, don't forget
// to remove the Axios mocks in the `/src/index.tsx` file.

const INITIALIZE = "INITIALIZE";
const SIGN_IN = "SIGN_IN";
const SIGN_OUT = "SIGN_OUT";
const SIGN_UP = "SIGN_UP";

type AuthActionTypes = {
  [INITIALIZE]: {
    isAuthenticated: boolean;
    user: AuthUser;
  };
  [SIGN_IN]: {
    user: AuthUser;
  };
  [SIGN_OUT]: undefined;
  [SIGN_UP]: {
    user: AuthUser;
  };
};

const initialState: AuthState = {
  isAuthenticated: false,
  isInitialized: false,
  user: null,
};

const JWTReducer = (
  state: AuthState,
  action: ActionMap<AuthActionTypes>[keyof ActionMap<AuthActionTypes>]
) => {
  switch (action.type) {
    case INITIALIZE:
      return {
        isAuthenticated: action.payload.isAuthenticated,
        isInitialized: true,
        user: action.payload.user,
      };
    case SIGN_IN:
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
      };
    case SIGN_OUT:
      return {
        ...state,
        isAuthenticated: false,
        user: null,
      };

    case SIGN_UP:
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
      };

    default:
      return state;
  }
};

const AuthContext = createContext<JWTContextType | null>(null);

function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(JWTReducer, initialState);

  useEffect(() => {
    const initialize = async () => {
      try {
        // const isAuthEnabled = import.meta.env.VITE_AUTH_ENABLED === "true";

        // if (!isAuthEnabled) {
        //   console.log(
        //     "authentication is disabled in development mode... auto logging in"
        //   );
        //   dispatch({
        //     type: INITIALIZE,
        //     payload: {
        //       isAuthenticated: true,
        //       user: { id: "dev", name: "developer", role: "admin" },
        //     },
        //   });
        //   return;
        // }

        const accessToken = window.localStorage.getItem("accessToken");

        if (accessToken && isValidToken(accessToken)) {
          setSession(accessToken);

          const response = await userApi.getUserDetails();
          const { user }: { user: any } = response;

          dispatch({
            type: INITIALIZE,
            payload: {
              isAuthenticated: true,
              user,
            },
          });
        } else {
          dispatch({
            type: INITIALIZE,
            payload: {
              isAuthenticated: false,
              user: null,
            },
          });
        }
      } catch (err) {
        console.error(err);
        dispatch({
          type: INITIALIZE,
          payload: {
            isAuthenticated: false,
            user: null,
          },
        });
      }
    };

    initialize();
  }, []);

  const signIn = async (email: string, password: string) => {
    const response = await userApi.signinUser(email, password);
    const { accessToken, user } = response;

    setSession(accessToken);
    dispatch({
      type: SIGN_IN,
      payload: {
        user,
      },
    });
  };

  const signOut = async () => {
    setSession(null);
    dispatch({ type: SIGN_OUT });
  };

  const signUp = async (
    firstName: string,
    lastName: string,
    phone: string,
    email: string,
    username: string,
    password: string,
    profileType: ProfileType
  ) => {
    const response = await userApi.signupUser(
      firstName,
      lastName,
      phone,

      email,
      username,
      password,
      profileType
    );

    console.log("response from signup", response);
    const { accessToken, user } = response;

    setSession(accessToken);
    window.localStorage.setItem("accessToken", accessToken);
    dispatch({
      type: SIGN_UP,
      payload: {
        user,
      },
    });
  };

  const resetPassword = (email: string) => console.log(email);

  return (
    <AuthContext.Provider
      value={{
        ...state,
        method: "jwt",
        signIn,
        signOut,
        signUp,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext, AuthProvider };
