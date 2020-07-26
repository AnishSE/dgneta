module.exports      = function(sequelize, DataTypes) {
  var Admin         = sequelize.define('Admin', {
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
    first_name       : {
      type          : DataTypes.STRING(255),
      allowNull     : false
    },
    last_name        : {
      type          : DataTypes.STRING(255),
      allowNull     : false
    },           
    password	        : {
      type          : DataTypes.STRING(255),
      allowNull     : false
    }, 
    profile_image	        : {
      type          : DataTypes.STRING(255),
      allowNull     : true
    },
    email           : {
      type          : DataTypes.STRING(20),
      allowNull     : false
    },
    status   : {
      type          : DataTypes.INTEGER(11),
      allowNull     : false,
      defaultValue  : 0
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
    tableName       : 'admin',
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
  return Admin;
};