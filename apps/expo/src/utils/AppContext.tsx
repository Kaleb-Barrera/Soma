import { createContext, useContext } from "react";

import type { User } from '@soma/db';
import type Database from '../types/database';

interface AppContext {
    database: Database,
    user: User,
    setUser: React.Dispatch<React.SetStateAction<User>>
}

export const AppContext = createContext<AppContext>({
    database: null,
    user: null,
    setUser: null
})

export const useAppContext = () => useContext(AppContext)