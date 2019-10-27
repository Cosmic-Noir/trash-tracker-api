const xss = require("xss");

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

sterilizedComment = comment => {
  const { user } = comment;
  return {
    id: comment.id,
    content: xss(comment.content),
    site_id: comment.site_id,
    user_ref: user.user_name,
    date_posted: new Date(comment.date_posted)
  };
};

module.exports = CommentsService;
