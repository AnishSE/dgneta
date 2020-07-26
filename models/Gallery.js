module.exports      = function(sequelize, DataTypes) {
  var Gallery         = sequelize.define('Gallery', {
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
    title            : {
      type          : DataTypes.STRING(255),
      allowNull     : false
    },
    sub_admin_id    : {
      type          : DataTypes.INTEGER(11),
      allowNull     : false
    },

    description        : {
      type          : DataTypes.STRING(255),
      allowNull     : true
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
    tableName       : 'gallery',
    paranoid        : true,
    deletedAt       : 'deletedAt',
    charset         : 'utf8',
    collate         : 'utf8_general_ci', 
    freezeTableName : true,
    timestamps      : false,

    classMethods: {
      associate: function(models) {}
    }    
  });
  return Gallery;
};