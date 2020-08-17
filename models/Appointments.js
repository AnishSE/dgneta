module.exports      = function(sequelize, DataTypes) {
  var Appointments         = sequelize.define('Appointments', {
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
    date            : {
      type          : DataTypes.DATEONLY,
      allowNull     : false
    },
    time            : {
      type          : DataTypes.STRING(255),
      allowNull     : false
    },
    subject         : {
      type          : DataTypes.STRING(255),
      allowNull     : false
    },
    description     : {
      type          : DataTypes.STRING(255),
      allowNull     : false
    },
    user_id         : {
      type          : DataTypes.INTEGER(11),
      allowNull     : false,
    },
    sub_admin_id    : {
      type          : DataTypes.INTEGER(11),
      allowNull     : false,
    }, 
    is_rescheduled  : {
      type          : DataTypes.INTEGER(2),
      allowNull     : false,
      defaultValue  : 0
    },
    status         : {
      type          : DataTypes.INTEGER(11),
      allowNull     : false,
      defaultValue  : 1
    },  
    read_status         : {
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
    tableName       : 'appointments',
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
  return Appointments;
};