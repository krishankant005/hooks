import React,{useContext} from 'react';

import Ingredients from './components/Ingredients/Ingredients';
import Auth from './components/Auth';
import { AuthContext } from './context/auth-context';

const App = props => {
  const authcontext = useContext(AuthContext);
  let context  = <Auth />;
  if(authcontext.isAuth){
    context = <Ingredients />
  }
  return context;
};

export default App;
