import { createContext, useContext, useState } from "react";
import { useDatabase } from "../hooks/useDatabase";

import type { User } from '@soma/db';
import type Database from '../types/database';

interface AppContext {
    database: Database,
    user: User,
    setUser: any
}

export const AppContext = createContext<AppContext>({
    database: null,
    user: null,
    setUser: null
})

export const useAppContext = () => useContext(AppContext)