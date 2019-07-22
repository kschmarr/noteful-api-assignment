const notefulService = {
  updateNote(knex, noteid, newNoteFields) {
    return knex("noteful_notes")
      .where({ noteid })
      .update(newNoteFields);
  },
  deleteNote(knex, noteid) {
    return knex("noteful_notes")
      .where({ noteid })
      .delete();
  },
  insertNote(knex, newNote) {
    return knex
      .insert(newNote)
      .into("noteful_notes")
      .returning("*")
      .then(rows => {
        return rows;
      });
  },
  getOneNote(knex, id) {
    return knex
      .from("noteful_notes")
      .select("*")
      .where("noteid", id)
      .first();
  },
  getAllFolders(knex) {
    return knex.select("*").from("noteful_folders");
  },
  insertFolder(knex, newFolder) {
    return knex
      .insert(newFolder)
      .into("noteful_folders")
      .returning("*")
      .then(rows => {
        return rows;
      });
  },
  updateFolder(knex, id, newFolderFields) {
    return knex("noteful_folders")
      .where({ id })
      .update(newFolderFields);
  },
  deleteNote(knex, noteid) {
    return knex("noteful_notes")
      .where({ noteid })
      .delete();
  },
  getAllNotes(knex) {
    return knex.select("*").from("noteful_notes");
  }
};

module.exports = notefulService;
