const notefulService = {
  // getAllBookmarks(knex) {
  //   return knex.select('*').from('bookmarks')
  // },
  // getById(knex, id) {
  //   return knex.from('bookmarks').select('*').where('id', id).first()
  // },
  // insertBookmark(knex, newBookmark) {
  //   return knex
  //     .insert(newBookmark)
  //     .into('bookmarks')
  //     .returning('*')
  //     .then(rows => {
  //       return rows[0]
  //     })
  // },
  // deleteBookmark(knex, id) {
  //   return knex('bookmarks')
  //     .where({ id })
  //     .delete()
  // },
  // updateBookmark(knex, id, newBookmarkFields) {
  //   return knex('bookmarks')
  //     .where({ id })
  //     .update(newBookmarkFields)
  // },
  getAllFolders(knex) {
    return knex.select("*").from("noteful_folders");
  },
  insertFolder(knex, newFolder) {
    return knex
      .insert(xss(newFolder))
      .into("noteful_folders")
      .returning("*")
      .then(rows => {
        return rows[0];
      });
  },
  updateFolder(knex, id, newFolderFields) {
    return knex("noteful_folders")
      .where({ id })
      .update(xss(newFolderFields));
  },
  deleteNote(knex, id) {
    return knex("noteful_folders")
      .where({ id })
      .delete();
  },
  getAllNotes(knex) {
    return knex.select("*").from("noteful_notes");
  },
  insertNote(knex, newNote) {
    return knex
      .insert(xss(newNote))
      .into("noteful_notes")
      .returning("*")
      .then(rows => {
        return rows[0];
      });
  },
  getOneNote(knex, id) {
    return knex
      .from("noteful_notes")
      .select("*")
      .where("id", id)
      .first();
  },
  updateNote(knex, id, newNoteFields) {
    return knex("noteful_notes")
      .where({ id })
      .update(xss(newNoteFields));
  },
  deleteNote(knex, id) {
    return knex("noteful_notes")
      .where({ id })
      .delete();
  }
};

module.exports = notefulService;
