import {createContext,useContext, type ReactNode,useState } from "react";
interface User{
    email:string;
}
interface authContextType{
    user:User | null;
    isLoading:boolean;
    isAuthenticated:boolean;
    login:(userData:User)=>void;
    logout:()=>void;
}
interface authProviderProps{
    children:ReactNode
}
export const AuthContext=createContext<authContextType | undefined>(undefined);
export const AuthProvider=({children}:authProviderProps)=>{
    const [user,setUser]=useState<User | null>(null);
    const [isLoading,setIsLoading]=useState<boolean>(true);
    const [isAuthenticated,setIsAuthenticated]=useState<boolean>(false)
    const login=(userData:User)=>{
        setUser(userData);
        setIsAuthenticated(true);
    }
    const logout=()=>{
        setUser(null);
        setIsAuthenticated(false);
    }
    return(
        <AuthContext.Provider value={{user,isLoading,isAuthenticated,login,logout}}>
            {children}
         </AuthContext.Provider>
    )
}
export const useAuth=()=>{
    const user=useContext(AuthContext);
    if(user===null){
        throw new Error("Error while authentication.")
    }
    return user;
}

