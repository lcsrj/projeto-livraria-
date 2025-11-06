// jest.config.js
module.exports = {
  testEnvironment: 'node',
  // Aumenta o timeout global, útil para testes de API que iniciam um servidor
  testTimeout: 10000, 
  // Ignora a pasta node_modules
  testPathIgnorePatterns: ['/node_modules/'],
  // Força o Jest a sair após os testes, o que é útil para `detectOpenHandles`
  forceExit: true, 
};
