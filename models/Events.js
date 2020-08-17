module.exports      = function(sequelize, DataTypes) {
  var Events         = sequelize.define('Events', {
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
    sub_admin_id       : {
      type          : DataTypes.INTEGER(11),
      allowNull     : false
    },

    media_url       : {
      type          : DataTypes.STRING(255),
      allowNull     : false
    },      
    description       : {
      type          : DataTypes.STRING(255),
      allowNull     : false
    },
    location       : {
      type          : DataTypes.STRING(255),
      allowNull     : false
    },    
    date            : {
      type          : DataTypes.DATEONLY,
      allowNull     : true
    },
    time            : {
      type          : DataTypes.STRING(255),
      allowNull     : false
    },                                                    
    createdAt      : {
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
    tableName       : 'events',
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
  return Events;
};