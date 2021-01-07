const express = require("express");
const cors = require("cors");

const { v4: uuid, validate: isUuid, v4 } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;
  const newRepository = {id: v4(), title, url, techs, likes: 0};
  repositories.push(newRepository);
  return response.status(201).json(newRepository);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const index = repositories.findIndex(r => r.id === id);

  if(index === -1) {
    return response.status(400).json({error: 'Repository not found.'})
  }

  repositories[index].title = title;
  repositories[index].url = url;
  repositories[index].techs = techs;

  return response.json(repositories[index]);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const index = repositories.findIndex(r => r.id === id);

  if(index === -1) {
    return response.status(400).json({error: 'Repository not found.'})
  } else {
    repositories.splice(index, 1);
    return response.status(204).send();
  }
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;
  const index = repositories.findIndex(r => r.id === id);

  if(index === -1) {
    return response.status(400).json({error: 'Repository not found.'})
  } else {
    repositories[index].likes = ++repositories[index].likes;
    return response.json(repositories[index]);
  }
});

module.exports = app;
