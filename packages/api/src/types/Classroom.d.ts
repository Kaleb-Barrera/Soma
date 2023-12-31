import type { classroom_v1 } from 'googleapis/build/src/apis/classroom/v1.d.ts';

export interface Course extends classroom_v1.Schema$Course {
    id: string;
}

export interface Teacher extends classroom_v1.Schema$Teacher {
    userId: string;
}

export interface CourseList {
    courses: Course[];
    nextPageToken: string | null;
}

export interface TeacherList {
    teachers: Teacher[];
    nextPageToken: string | null;
}

export interface CourseInfo {
    course: Course;
    teachers: Teacher[];
}

export const isCourse = (x: unknown): x is classroom_v1.Schema$Course =>
    typeof x.id === 'string';
