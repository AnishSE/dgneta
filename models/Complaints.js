module.exports      = function(sequelize, DataTypes) {
  var Complaints         = sequelize.define('Complaints', {
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
    user_id       : {
      type          : DataTypes.INTEGER(11),
      allowNull     : false
    },
    sub_admin_id       : {
      type          : DataTypes.INTEGER(11),
      allowNull     : false
    },
    media_url       : {
      type          : DataTypes.STRING(255),
      allowNull     : false
    },       
    message        : {
      type          : DataTypes.STRING(255),
      allowNull     : false
    },      

    title          : {
      type          : DataTypes.STRING(255),
      allowNull     : false,
    },
    status         : {
      type          : DataTypes.INTEGER(11),
      allowNull     : false,
      defaultValue  : 1
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
    tableName       : 'complaints',
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
  return Complaints;
};