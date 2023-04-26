const dbUtils = require('../utils/utils');

module.exports = {

  /**
   * Get all the transactions for a given user
   * @param { number } user_id 
   */
  getAllCategories(user_id) {

    let q_getCategories =
      `SELECT 
          id, 
          name, 
          active
      FROM category
      WHERE user_id = ${user_id}`;

    return dbUtils.runQuery(q_getCategories)
      .then((result) => {
        return result
      })
      .catch((error) => new Error(error));
  },

  /**
   * Creates a category for the given user
   * @param { string } category_name 
   * @param { number } user_id 
   * @returns { Promise } of 'Success' | Error
   */
  createCategory(category_name, user_id) {

    let q_insertCategory = `INSERT INTO category (name, user_id) VALUES ("` + category_name + `", ` + user_id + `);`;

    return dbUtils.runQuery(q_insertCategory)
      .then(() => 'Success')
      .catch((error) => new Error(error));

  },

  /**
   * Update the given category to the given name
   * @param { number } category_id 
   * @param { string } category_name 
   * @returns { Promise } of 'Success' | Error
   */
  updateCategory(category_id, category_name, active) {

    let q_updateCategory = `UPDATE category SET name = "` + category_name + `", active = ` + active + ` WHERE id = ` + category_id + `;`;

    return dbUtils.runQuery(q_updateCategory)
      .then(() => 'Success')
      .catch((error) => new Error(error));

  }

}