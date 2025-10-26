import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  signIn as signInAction,
  signOut as signOutAction,
  loadStoredUser,
} from "../store/authSlice";
import { useEffect } from "react";

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const auth = useAppSelector((state) => state.auth);

  useEffect(() => {
    dispatch(loadStoredUser());
  }, [dispatch]);

  const handleSignIn = async (email: string, password: string) => {
    await dispatch(signInAction({ email, password }));
  };

  const handleSignOut = async () => {
    await dispatch(signOutAction());
  };

  return {
    user: auth.user,
    loading: auth.loading,
    isAuthenticated: auth.isAuthenticated,
    signIn: handleSignIn,
    signOut: handleSignOut,
  };
};
