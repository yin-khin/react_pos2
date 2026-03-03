import { createContext } from "react"


export const AppContext = createContext();

const ContextProvider = (props) => {
    const baseURL = "http://localhost:3000/";

    return (
        <AppContext.Provider value={{ baseURL }}>
            {props.children}
        </AppContext.Provider>
    );
}

export default ContextProvider;