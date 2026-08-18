import { useQuery } from '@tanstack/react-query'
import { getStudentOverview } from '@/features/enrollments/api/studentOverview.api'
export const useStudentOverview=(classId?:string)=>useQuery({queryKey:['student','overview',classId],queryFn:()=>getStudentOverview(classId),staleTime:30_000})
