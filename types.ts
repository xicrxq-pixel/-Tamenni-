
export enum AppTab {
  Tamenni = 'tamenni',
  Profile = 'profile'
}

export interface UserProfile {
  name: string;
  age: string;
  height: string;
  weight: string;
}

export interface HealthAdvice {
  symptom: string;
  icon: string;
  tips: string[];
  warning: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}
