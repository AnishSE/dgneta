module.exports      = function(sequelize, DataTypes) {
  var Subadmin         = sequelize.define('Subadmin', {
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
    facebook_url      : {
      type          : DataTypes.STRING(255),
      allowNull     : true
    },      
    phone           : {
      type          : DataTypes.STRING(20),
      allowNull     : true
    },
    email      : {
      type          : DataTypes.STRING(255),
      allowNull     : false
    },
    password      : {
      type          : DataTypes.STRING(255),
      allowNull     : false
    },
    cover_photo_url      : {
      type          : DataTypes.STRING(255),
      allowNull     : true
    },
    dob      : {
      type          : DataTypes.DATEONLY,
      allowNull     : true
    },

    education      : {
      type          : DataTypes.STRING(255),
      allowNull     : true
    },
    blood_group      : {
      type          : DataTypes.STRING(255),
      allowNull     : true
    },

    profile_image    : {
      type          : DataTypes.STRING(255),
      allowNull     : true,
    },

    present_position      : {
      type          : DataTypes.STRING(255),
      allowNull     : true
    },
    past_position      : {
      type          : DataTypes.STRING(255),
      allowNull     : true
    },
    email_id      : {
      type          : DataTypes.STRING(255),
      allowNull     : true
    },
    roles      : {
      type          : DataTypes.INTEGER(11),
      allowNull     : false,
      defaultValue  : 2
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
    tableName       : 'sub_admin',
    paranoid        : true,
    deletedAt       : 'deletedAt',
    charset         : 'utf8',
    collate         : 'utf8_general_ci', 
    freezeTableName : true,
    timestamps      : false,

    classMethods: {
      associate: function(models) {
        Subadmin.belongsTo(models.Users, {
            foreignKey : 'id'
        });
      }
    }    
  });
  return Subadmin;
};