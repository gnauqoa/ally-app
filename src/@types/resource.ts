export enum ResourceType {
  ARTICLE = 'ARTICLE',
  VIDEO = 'VIDEO',
  EXERCISE = 'EXERCISE',
  COPING_STRATEGY = 'COPING_STRATEGY'
}

export interface Resource {
  id: number;
  psychologistId?: number;
  title: string;
  description?: string;
  type: ResourceType;
  content?: string;
  url?: string;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
  psychologist?: {
    user: {
      id: number;
      name?: string;
    };
  };
}

export interface SharedResource {
  id: number;
  resourceId: number;
  patientId: number;
  psychologistId: number;
  sharedAt: string;
  viewed: boolean;
  viewedAt?: string;
  resource: Resource;
  psychologist?: {
    user: {
      id: number;
      name?: string;
    };
  };
}

