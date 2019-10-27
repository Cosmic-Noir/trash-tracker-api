const SitesService = {
  getAllSites(knex) {
    return knex.select("*").from("tt_sites");
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
  getById(knex, id) {
    return knex
      .from("tt_sites")
      .select("*")
      .where("id", id)
      .first();
  },
  getCommentsForSite(knex, site_id) {
    return knex
      .from("tt_comments")
      .select("*")
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
