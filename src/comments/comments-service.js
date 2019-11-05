const xss = require("xss");

const CommentsService = {
  getById(knex, id) {
    return knex
      .select("*")

      .from("tt_comments")
      .innerJoin("tt_comments", "tt_users.id", "=", "tt_comments.user_ref")
      .select("username, score")
      .where("tt_comments.id", id);
  },
  insertComment(knex, newComment) {
    return knex
      .insert(newComment)
      .into("tt_comments")
      .returning("*")
      .then(([comment]) => comment)
      .then(comment => CommentsService.getById(knex, comment.id));
  },
  sterilizedComment(comment) {
    return {
      id: comment.id,
      content: xss(comment.content),
      site_id: comment.site_id,
      user_ref: comment.user_ref,
      date_posted: new Date(comment.date_posted)
    };
  }
};

module.exports = CommentsService;
