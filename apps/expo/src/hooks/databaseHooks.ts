import { useEffect, useState } from "react";

import { useAppContext } from "../utils/AppContext";
import type { Group } from "@soma/db";

export const useGetAllGroups = () => {
    const {database} = useAppContext()
    const [groups, setGroups] = useState<Group[]>(null)
    const [isFetching, setIsFetching] = useState(true)

    useEffect(() => {
        if(isFetching){
            setGroups(null)
        }
    }, [isFetching])

    useEffect(() => {
        function loadGroups() {
            try {
                const groups_query = database.databaseLayer.executeSql('SELECT * FROM "Group"') as Group[]
                setGroups(groups_query)
            } catch (error) {
                console.error("ERROR at querying local database for all groups", error)
            }
        }

        if(groups === null){
            loadGroups()
        } else {
            setIsFetching(false)
        }
    }, [groups, database])

    return {
        data: groups,
        refetch: () => {
            setIsFetching(true)
        }
    }
}