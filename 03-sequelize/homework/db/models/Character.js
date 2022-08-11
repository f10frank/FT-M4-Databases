const { calculateExtensionPriority } = require('@11ty/eleventy/src/TemplateData');
const { DataTypes } = require('sequelize');

module.exports = sequelize => {
  sequelize.define('Character', {
    code: {
      type: DataTypes.STRING(5),
      primaryKey: true,
      unique: true,
      allowNull: false,
      validate: {
        validateCode(value) {
          if(value.toLowerCase() === "henry") {
            throw new Error('Incorrect code')
          }
        }
      }
    },
    name : {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        notIn: [["Henry", "SoyHenry", "Soy Henry"]]
      }
    },
    age: {
      type: DataTypes.INTEGER,
      get() {
        let value = this.getDataValue('age');
        if(!value) return value;
        return value + ' years old';
      }
    },
    race: {
      type: DataTypes.ENUM('Human', 'Elf', 'Machine', 'Demon', 'Animal', 'Other'),
      defaultValue: 'Other'
    },
    hp: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    mana: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    date_added: {
      type: DataTypes.DATEONLY,
      defaultValue: DataTypes.NOW
    }
  }, {
    timestamps: false,
  });
}
