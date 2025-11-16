import axiosInstance from '@/lib/axios';
import { Resource, SharedResource, ResourceType } from '@/@types/resource';

export const resourceApi = {
  createResource: (data: {
    title: string;
    description?: string;
    type: ResourceType;
    content?: string;
    url?: string;
    isPublic?: boolean;
  }) => axiosInstance.post<Resource>('/resources', data),

  getResources: (params?: {
    type?: ResourceType;
    isPublic?: boolean;
    limit?: number;
    offset?: number;
  }) => axiosInstance.get<{ resources: Resource[]; total: number }>('/resources', { params }),

  updateResource: (id: number, data: Partial<Resource>) => 
    axiosInstance.patch<Resource>(`/resources/${id}`, data),

  deleteResource: (id: number) => 
    axiosInstance.delete(`/resources/${id}`),

  shareResource: (id: number, patientId: number) => 
    axiosInstance.post<SharedResource>(`/resources/${id}/share`, { patientId }),

  getSharedResources: () => 
    axiosInstance.get<SharedResource[]>('/resources/shared'),

  markResourceViewed: (sharedResourceId: number) => 
    axiosInstance.post<SharedResource>(`/resources/shared/${sharedResourceId}/viewed`),
};

