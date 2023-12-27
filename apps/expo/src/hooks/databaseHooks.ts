import { useEffect, useState, useContext } from "react";

import { useAppContext } from "../utils/AppContext";
import type { Group } from "@soma/db";

export const useGetAllGroups = () => {
    const {database} = useAppContext()
    const [groups, setGroups] = useState<Group[]>(null)
    const [isFetching, setIsFetching] = useState(true)

    useEffect(() => {
        async function loadGroups() {
            if(groups) setIsFetching(false)
            try {
                console.log("------------Querying groups...------------");
                
                setGroups((await database.group.databaseLayer.executeSql('SELECT * FROM "Group"')).rows)
            } catch (error) {
                console.error("ERROR at querying local database for all groups", error)
            }
        }

        if(isFetching){
            loadGroups()
        }
    }, [isFetching])

    console.log({groups});    

    return {
        data: groups,
        refetch: () => {
            setIsFetching(true)
        }
    }
}