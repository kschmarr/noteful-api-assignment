const express = require("express");
const xss = require("xss");
const logger = require("../logger");
const notefulService = require("./noteful-service");

const notefulRouter = express.Router();
const bodyParser = express.json();

const serializeFolder = folder => ({
  title: xss(folder.title),
  folderid: xss(folder.folderid)
});

const serializeNote = note => ({
  title: xss(note.title),
  content: xss(note.content),
  folderid: xss(note.folderid),
  date_published: xss(note.date_published),
  noteid: xss(note.noteid)
});

notefulRouter
  .route("/folders")
  .get((req, res, next) => {
    notefulService
      .getAllFolders(req.app.get("db"))
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

    notefulService
      .insertFolder(req.app.get("db"), newFolder)
      .then(folder => {
        res
          .status(201)
          .location(`/folders/${folder.folderid}`)
          .json(folder[0]);
      })
      .catch(next);
  });

notefulRouter
  .route("/notes")
  .get((req, res, next) => {
    notefulService
      .getAllNotes(req.app.get("db"))
      .then(notes => {
        res.json(notes.map(serializeNote));
      })
      .catch(next);
  })
  .post(bodyParser, (req, res, next) => {
    for (const field of ["title", "content", "folderid"]) {
      if (!req.body[field]) {
        logger.error(`${field} is required`);
        return res.status(400).send(`'${field}' is required`);
      }
    }

    const { title, content, folderid } = req.body;

    const newNote = { title, content, folderid };
    notefulService
      .insertNote(req.app.get("db"), newNote)
      .then(note => {
        logger.info(`Note with id ${note.noteid} created.`);
        res
          .status(201)
          .location(`/notes/${note.noteid}`)
          .json(note);
      })
      .catch(next);
  });

notefulRouter
  .route("/notes/:noteid")
  .all((req, res, next) => {
    const { noteid } = req.params;
    notefulService
      .getOneNote(req.app.get("db"), noteid)
      .then(note => {
        if (!note) {
          logger.error(`Note with id ${noteid} not found.`);
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
    const { noteid } = req.params;

    notefulService
      .deleteNote(req.app.get("db"), noteid)
      .then(() => {
        logger.info(`Card with id ${noteid} deleted.`);
        res.status(200).json({ noteid: noteid });
      })
      .catch(next);
  });

module.exports = notefulRouter;
