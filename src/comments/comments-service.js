const CommentsService = {
  getById(knex, id) {
    return (
      knex
        .from("tt_comments")
        .select("*")
        .where("userRef", id)
        //Unclear if needed below:
        .first()
    );
  },
  insertComment(knex, newComment) {
    return knex
      .insert(newComment)
      .into("tt_comments")
      .returning("*")
      .then(([comment]) => comment)
      .then(comment => CommentsService.getById(db, comment.id));
  }
};

module.exports = CommentsService;
