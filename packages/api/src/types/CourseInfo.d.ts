import type { classroom_v1 } from "googleapis/build/src/apis/classroom/v1.d.ts"

export interface CourseInfo {
    course: classroom_v1.Schema$Course,
    teachers: classroom_v1.Schema$Teacher[]
}
