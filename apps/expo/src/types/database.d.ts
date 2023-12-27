import type { User, Group, Message, Subgroup, isOwnerOf, isStudentAt, isTeacherAt } from "@soma/db"
import type { Repository } from "expo-sqlite-orm"

export default interface Database {
    user: Repository<User>
    group: Repository<Group>
    subgroup: Repository<Subgroup>
    isTeacherAt: Repository<isTeacherAt>
    isStudentAt: Repository<isStudentAt>
    isOwnerOf: Repository<isOwnerOf>
    message: Repository<Message>
}
