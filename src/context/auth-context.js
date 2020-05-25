import React, { useState } from 'react';

export const AuthContext = React.createContext({
    isAuth:true,
    login: () =>{}
});

const AuthContextProvider = props =>{
    const [isAuthenticated,setIsAuthenticated] = useState(false);

    const loginhandler = () =>{
        setIsAuthenticated(true);
    }
    return(
        <AuthContext.Provider value ={{login : loginhandler, isAuth:isAuthenticated}}>
            {props.children}
        </AuthContext.Provider>
    );
}

export default AuthContextProvider;