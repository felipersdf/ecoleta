import express from 'express';

const app = express();

app.get('/users', (request, response) => {
  console.log('Listagem de usuários');

  response.json(['Felipe', 'Pedro', 'Fabrício', 'Tales']);
});

app.listen(3333);
