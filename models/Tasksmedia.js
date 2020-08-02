module.exports      = function(sequelize, DataTypes) {
  var Tasksmedia         = sequelize.define('Tasksmedia', {
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
    task_id       : {
      type          : DataTypes.INTEGER(11),
      allowNull     : true
    },
      media_url        : {
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
    tableName       : 'tasks_media',
    paranoid        : true,
    deletedAt       : 'deletedAt',
    charset         : 'utf8',
    collate         : 'utf8_general_ci', 
    freezeTableName : true,
    timestamps      : false,

    classMethods: {
      associate: function(models) {
        Tasksmedia.hasOne(models.Tasks, {
            foreignKey : 'id'
        });                 
      }
    }    
  });
  return Tasksmedia;
};