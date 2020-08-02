module.exports      = function(sequelize, DataTypes) {
  var Tasks         = sequelize.define('Tasks', {
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

    sub_admin_id    : {
      type          : DataTypes.INTEGER(11),
      allowNull     : false
    },
    title            : {
      type          : DataTypes.STRING(255),
      allowNull     : false
    },
    description        : {
      type          : DataTypes.STRING(255),
      allowNull     : true
    },      
    type        : {
      type          : DataTypes.STRING(255),
      allowNull     : true
    },  
    category        : {
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
    tableName       : 'tasks',
    paranoid        : true,
    deletedAt       : 'deletedAt',
    charset         : 'utf8',
    collate         : 'utf8_general_ci', 
    freezeTableName : true,
    timestamps      : false,

    classMethods: {
      associate: function(models) {
        Tasks.hasMany(models.Tasksmedia, {
            foreignKey : 'task_id',
            
            as:'Media'
        });         
      }
    }    
  });
  return Tasks;
};