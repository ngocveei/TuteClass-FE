import { apiClient } from '@/services/api/apiClient'
import type { StudentOverview } from '@/features/enrollments/types/studentOverview.types'
export async function getStudentOverview(classId?:string){return(await apiClient.get<StudentOverview>('/api/classes/student-overview',{params:classId?{classId}:undefined})).data}
