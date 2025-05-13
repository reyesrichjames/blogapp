import { createContext } from 'react';

const UserContext = createContext({
  user: {
    id: null,
    isAdmin: null,
    email: null,
    username: null
  },
  setUser: () => {}
});

export const UserProvider = UserContext.Provider;
export default UserContext;
