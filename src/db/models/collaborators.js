'use strict';
module.exports = (sequelize, DataTypes) => {
  var Collaborators = sequelize.define('Collaborators', {
    wikiId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {});
  Collaborators.associate = function(models) {
    // associations can be defined here
    Collaborators.belongsTo(models.Wiki, {
      foreignKey: "userId",
      onDelete: "CASCADE",
    });
    Collaborators.belongsTo(models.User, {
      foreignKey: "userId",
      onDelete: "CASCADE"
    });
  Collaborators.addScope("allCollaboratorsFor", (wikiId) =>{
    return {
      include: [{
        model: models.User
      }],
      where: { wikiId: wikiId },
      order: [['createdAt', 'ASC']]
    }
 });

 Collaborators.addScope("allCollaborationsFor", (userId) => {
    return {
      include: [{
        model: models.Wiki
      }],
      where: { userId: userId},
      order: [['createdAt', 'ASC']]
    }
  });
 };
  return Collaborators
};