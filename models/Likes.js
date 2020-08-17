module.exports      = function(sequelize, DataTypes) {
  var Likes         = sequelize.define('Likes', {
    id              : {
      type          : DataTypes.INTEGER(11),
      allowNull     : false,
      primaryKey    : true,
      autoIncrement : true,
      // references    : {
      //   model       : 'media',
      //   key         : 'uploaded_by' 
      // }      
     
    },
    post_id            : {
      type          : DataTypes.INTEGER(11),
      allowNull     : false
    },
    sub_admin_id    : {
      type          : DataTypes.INTEGER(11),
      allowNull     : false
    },
    user_id    : {
      type          : DataTypes.INTEGER(11),
      allowNull     : false
    },
    status    : {
      type          : DataTypes.INTEGER(11),
      allowNull     : false
    },    

                                           
    createdAt: {
      type          : DataTypes.DATE,
      allowNull     : true,
      defaultValue  : sequelize.literal('CURRENT_TIMESTAMP')
    },
    updatedAt        : {
      type          : DataTypes.TIME,
      allowNull     : true,
      defaultValue  : sequelize.literal('CURRENT_TIMESTAMP')
    }
  },  
   {
    tableName       : 'likes',
    paranoid        : true,
    deletedAt       : 'deletedAt',
    charset         : 'utf8',
    collate         : 'utf8_general_ci', 
    freezeTableName : true,
    timestamps      : false,

    classMethods: {
      associate: function(models) {
        // Gallery.hasMany(models.Gallerymedia, {
        //     foreignKey : 'likes',            
        //     as:'Media'
        // });         
      }
    }    
  });
  return Likes;
};