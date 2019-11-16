const SitesService = {
  getAllSites(knex) {
    return knex.select("*").from("tt_sites");
  },
  getTrashSites(knex) {
    return knex
      .select("*")
      .from("tt_sites")
      .where("clean", false);
  },
  insertSite(knex, newSite) {
    return knex
      .insert(newSite)
      .into("tt_sites")
      .returning("*")
      .then(rows => {
        return rows[0];
      });
  },
  getCleanSites(knex) {
    return knex
      .select("*")
      .from("tt_sites")
      .where("clean", true);
  },
  getById(knex, id) {
    return knex
      .select("*")
      .from("tt_sites")
      .where("tt_sites.id", id)
      .first();
  },
  getCommentsForSite(knex, site_id) {
    return knex
      .select([
        "tt_comments.content",
        "tt_comments.id",
        "tt_comments.date_posted",
        "tt_users.username"
      ])
      .from("tt_comments")
      .innerJoin("tt_users", "tt_comments.user_ref", "=", "tt_users.id")
      .where("site_id", site_id);
  },
  deleteSite(knex, id) {
    return knex("tt_sites")
      .where({ id })
      .delete();
  },
  updateSite(knex, id, newSite) {
    return knex("tt_sites")
      .where({ id })
      .update(newSite);
  }
};

module.exports = SitesService;
