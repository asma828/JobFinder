export const environment = {
  production: false,
  jsonServerUrl: 'http://localhost:3000',
  jobApis: {

    adzuna: {
      appId: '1',
      appKey: '1',
      baseUrl: 'https://api.adzuna.com/v1/api/jobs'
    },
    theMuseApi: {
      baseUrl: 'https://www.themuse.com/api/public/jobs',
      apiKey: '' //
    },
    remoteOk: {
      baseUrl: 'https://remoteok.com/api' // CURRENTLY ACTIVE
    },
    jSearch: {
      baseUrl: 'https://jsearch.p.rapidapi.com',
      apiKey: 'YOUR_RAPIDAPI_KEY',
      apiHost: 'jsearch.p.rapidapi.com'
    }
  }
};
