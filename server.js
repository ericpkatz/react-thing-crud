const express = require('express');
const app = express();
const path = require('path');


app.use(require('body-parser').json());

app.use('/dist', express.static(path.join(__dirname, 'dist')));

const port = process.env.PORT || 3000;

app.listen(port, ()=> console.log(`listening on port ${port}`));

app.get('/', (req, res)=> res.sendFile(path.join(__dirname, 'index.html')));

app.get('/api/things', (req, res, next)=> {
  Thing.findAll()
    .then( things => res.send(things))
    .catch(next);
});

app.post('/api/things', (req, res, next)=> {
  Thing.create(req.body)
    .then( thing => res.send(thing))
    .catch(next);
});

const Sequelize = require('sequelize');
const conn = new Sequelize(process.env.DATABASE_URL);

const Thing = conn.define('thing', {
  name: {
    type: Sequelize.STRING,
    unique: true
  }
});

const syncAndSeed = async()=> {
  await conn.sync({ force: true });
  await Promise.all([
    Thing.create({ name: 'foo' }),
    Thing.create({ name: 'bar' }),
    Thing.create({ name: 'bazz' }),
  ]);
}

syncAndSeed();
