export interface Favorite {
  id?: number;
  userId: number;
  offerId: string;
  title: string;
  company: string;
  location: string;
  url?: string;
  salary_min?: number;
  salary_max?: number;
  apiSource?: string;
  dateAdded?: string;
}
