// Mock específico para llamadas a Adobe durante tests
const axios = require('axios');
const MockAdapter = require('axios-mock-adapter');

// Instalamos un mock adapter de axios en el entorno de test.
module.exports = function mockAdobeCalls() {
  const mock = new MockAdapter(axios);

  // Token endpoint
  mock.onPost('https://ims-na1.adobelogin.com/ims/token/v3').reply(200, {
    access_token: 'test-adobe-token',
    expires_in: 3600,
    token_type: 'Bearer',
  });

  // Generación de imagen (ejemplo)
  mock.onPost(/https:\/\/firefly\.adobe\.com\/.*/).reply(200, {
    id: 'image-test-id',
    url: 'https://cdn.example.com/test-image.png',
  });

  // Análisis de diseño: devolver una estructura mínima con scores
  mock.onPost(/.*\/analyze.*/).reply(200, {
    usability: 0.8,
    aesthetics: 0.75,
    accessibility: 0.9,
  });

  // Respuesta por defecto para otras llamadas axios: 200 con body vacío
  mock.onAny().reply((_config) => {
    return [200, { ok: true, info: 'mocked by test-setup' }];
  });
};
