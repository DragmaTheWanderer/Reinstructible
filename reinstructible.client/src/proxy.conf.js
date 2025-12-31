const { env } = require('process');

const target = env.ASPNETCORE_HTTPS_PORT ? `https://localhost:${env.ASPNETCORE_HTTPS_PORT}` :
  env.ASPNETCORE_URLS ? env.ASPNETCORE_URLS.split(';')[0] : 'https://localhost:7131';

const PROXY_CONFIG = [
  {
    context: [
      "/weatherforecast",
      "/api/teststring",
      "/api/color",
      "/api/element",
      "/api/parts",
      "/api/partcategory",
      "/api/set",
      "/api/storage",
    ],
    target,
    secure: false,
    //headers: {
   //   Connection: 'Keep-Alive'
   // }
  }
]

module.exports = PROXY_CONFIG;
