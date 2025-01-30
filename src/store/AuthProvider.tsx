
import {
    FC,
    useState,
    createContext,
    useContext,
    Dispatch,
    SetStateAction,
    ReactNode
} from 'react'
import { User } from '../domain/user'
import * as authHelper from '../utils/auth-utils'

type WithChildren = {
    children?: ReactNode
}

type AuthContextProps = {
    auth: Partial<User> | undefined
    saveAuth: (auth: Partial<User> | undefined) => void
    currentUser: User | undefined
    setCurrentUser: Dispatch<SetStateAction<User | undefined>>
    logout: () => void
}

const initAuthContextPropsState = {
    auth: authHelper.getAuth(),
    saveAuth: () => { },
    currentUser: undefined,
    setCurrentUser: () => { },
    logout: () => { },
}

const AuthContext = createContext<AuthContextProps>(initAuthContextPropsState)

const useAuth = () => {
    return useContext(AuthContext)
}

const AuthProvider: FC<WithChildren> = ({ children }) => {
    const [auth, setAuth] = useState<Partial<User> | undefined>(authHelper.getAuth())
    const [currentUser, setCurrentUser] = useState<User | undefined>()

    const saveAuth = (auth: Partial<User> | undefined) => {
        setAuth(auth)
        if (auth) {
            authHelper.setAuth(auth)
        } else {
            authHelper.removeAuth()
        }
    }

    const logout = () => {
        try {
            saveAuth(undefined)
        } catch (error) {
            
        }
        try {
            setCurrentUser(undefined)
        } catch (error) {
            
        }
    }

    return (
        <AuthContext.Provider value={{ auth, saveAuth, currentUser, setCurrentUser, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export { AuthProvider, useAuth }
