import { apiClient } from '@/services/api/apiClient'
import { getTokens } from '@/services/auth/tokenStorage'
import type { ProfileUpdate, UserProfile } from '@/features/profile/types/profile.types'
export const getMyProfile=async()=> (await apiClient.get<UserProfile>('/api/users/me')).data
export const updateMyProfile=async(payload:ProfileUpdate)=> (await apiClient.put<UserProfile>('/api/users/me',{...payload,dateOfBirth:payload.dateOfBirth?new Date(payload.dateOfBirth).toISOString():null})).data
export const updateTeacherBank=async(payload:{bankAccountNumber:string;bankName:string;bankAccountHolderName:string})=>(await apiClient.put<UserProfile>('/api/users/me/bank',payload)).data
export const updateTeachingWindow=async(payload:{start:string;end:string})=>(await apiClient.put<UserProfile>('/api/users/me/teaching-window',payload)).data
export const changePassword=async(payload:{currentPassword:string;newPassword:string})=>{await apiClient.post('/api/users/me/change-password',{...payload,currentRefreshToken:getTokens()?.refreshToken??''})}
