export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  url: string;
  created?: string;
  salary_min?: number;
  salary_max?: number;
  contract_type?: string;
  apiSource?: string; // To track which API the job came from
}

export interface JobSearchParams {
  keyword: string;
  location: string;
  page?: number;
  resultsPerPage?: number;
}
