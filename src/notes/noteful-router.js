const express = require("express");
const { isWebUri } = require("valid-url");
const xss = require("xss");
const logger = require("../logger");
const NotefulService = require("./noteful-service");

const notefulRouter = express.Router();
const bodyParser = express.json();

const serializeFolder = folder => ({
  title: xss(folder.title)
});

notefulRouter
  .route("/folders")
  .get((req, res, next) => {
    NotefulService.getAllFolders(req.app.get("db"))
      .then(folders => {
        res.json(folders.map(serializeFolder));
      })
      .catch(next);
  })
  .post(bodyParser, (req, res, next) => {
    for (const field of ["title"]) {
      if (!req.body[field]) {
        logger.error(`${field} is required`);
        return res.status(400).send(`'${field}' is required`);
      }
    }

    const { title } = req.body;

    const newFolder = { title };

    NotefulService.insertFolder(req.app.get("db"), newFolder)
      .then(folder => {
        logger.info(`Card with id ${folder.folderId} created.`);
        res
          .status(201)
          .location(`/folders/${folders.folderId}`)
          .json(serializeFolder(folder));
      })
      .catch(next);
  });

notefulRouter
  .route("/notes/:noteId")
  .all((req, res, next) => {
    const { noteId } = req.params;
    NotefulService.getOneNote(req.app.get("db"), noteId)
      .then(note => {
        if (!note) {
          logger.error(`Note with id ${noteId} not found.`);
          return res.status(404).json({
            error: { message: `Note Not Found` }
          });
        }
        res.note = note;
        next();
      })
      .catch(next);
  })
  .get((req, res) => {
    res.json(serializeNote(res.note));
  })
  .delete((req, res, next) => {
    // TODO: update to use db
    const { noteId } = req.params;
    NotefulService.deleteNote(req.app.get("db"), noteId)
      .then(numRowsAffected => {
        logger.info(`Card with id ${noteId} deleted.`);
        res.status(204).end();
      })
      .catch(next);
  });

module.exports = notefulRouter;
