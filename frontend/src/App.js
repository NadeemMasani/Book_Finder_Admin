import React, { useEffect } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch
} from 'react-router-dom';

import { useAuth } from './hooks/auth-hook';
import LibHome from './pages/LibHome';
import Auth from './pages/Auth';
import { AuthContext } from './context/auth-context';
import LoadingSpinner from './components/UIElements/LoadingSpinner';
import MainNavigation from './components/Navigation/MainNavigation';
import NewBook from './pages/NewBook';
import UpdateBook from './pages/UpdateBook';

const App = () => {
  const { token, login, logout, userId, libId } = useAuth();
  let routes;

  useEffect(() => {
    console.log("hello");
    console.log(libId);
  }, [libId])

  if (token) {
    routes = (
      <Switch>
        <Route path="/" exact>
          {libId ? <LibHome lid={libId} /> : <LoadingSpinner />}
        </Route>
        <Route path="/new" exact>
          <NewBook />
        </Route>
        <Route path="/book/:bid" exact>
          <UpdateBook />
        </Route>

        <Redirect to="/" />
      </Switch>
    );
  } else {
    routes = (
      <Switch>
        <Route path="/auth" exact>
          <Auth />
        </Route>
        <Redirect to="/auth" />
      </Switch>
    );
  }
  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: !!token,
        token: token,
        userId: userId,
        libId: libId,
        login: login,
        logout: logout
      }}
    >
      <Router>
        <MainNavigation />
        <main>{routes}</main>
      </Router>
    </AuthContext.Provider>


  );
}

export default App;
