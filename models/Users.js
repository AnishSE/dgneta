module.exports      = function(sequelize, DataTypes) {
  var Users         = sequelize.define('Users', {
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
    birth_date      : {
      type          : DataTypes.STRING(255),
      allowNull     : false
    },      
    taluka	        : {
      type          : DataTypes.STRING(255),
      allowNull     : false
    }, 
    village	        : {
      type          : DataTypes.STRING(255),
      allowNull     : false
    },
    mobile_number   : {
      type          : DataTypes.STRING(20),
      allowNull     : false
    },
    add_mobile_no   : {
      type          : DataTypes.STRING(20),
      allowNull     : true
    },        
    // device_type : {
    //   type          : DataTypes.ENUM,      
    //   values        : ['0', '1', '2'],
    //   defaultValue  : 0
    // }, 
    // device_token    : {
    //   type          : DataTypes.STRING(255),
    //   allowNull     : true,
    //   allowNull     : true
    // },   
    sub_admin_id  : {
      type          : DataTypes.INTEGER(1),
      allowNull     : false
    },
    status      : {
      type          : DataTypes.INTEGER(11),
      allowNull     : false,
      defaultValue  : 1
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
    tableName       : 'users',
    paranoid        : true,
    deletedAt       : 'deletedAt',
    charset         : 'utf8',
    collate         : 'utf8_general_ci', 
    freezeTableName : true,
    timestamps      : false,

    classMethods: {
      associate: function(models) {
        Users.belongsTo(models.Subadmin, {
            foreignKey : 'sub_admin_id',
            as:'subadmin'
        });        
      }
    }    
  });
  return Users;
};