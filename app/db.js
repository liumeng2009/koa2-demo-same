const Sequelize = require('sequelize');

const uuid = require('node-uuid');

const config = require('../config/mysql_config');

console.log('init sequelize...');

function generateId() {
    return uuid.v4();
}

var sequelize = new Sequelize(config.database, config.username, config.password, {
    host: config.host,
    dialect: config.dialect,
    pool: {
        max: 5,
        min: 0,
        idle: 10000
    },
    dialectOptions: {
        charset: "utf8mb4",
        collate: "utf8mb4_unicode_ci"
    }
});

const ID_TYPE = Sequelize.STRING(50);

function defineModel(name, attributes) {
    var attrs = {};
    for (let key in attributes) {
        let value = attributes[key];
        if (typeof value === 'object' && value['type']) {
            value.allowNull = value.allowNull || false;
            attrs[key] = value;
        } else {
            attrs[key] = {
                type: value,
                allowNull: false
            };
        }
    }
    console.log('model defined for table: ' + name + '\n' + JSON.stringify(attrs, function (k, v) {
            if (k === 'type') {
                for (let key in Sequelize) {
                    if (key === 'ABSTRACT' || key === 'NUMBER') {
                        continue;
                    }
                    let dbType = Sequelize[key];
                    if (typeof dbType === 'function') {
                        if (v instanceof dbType) {
                            if (v._length) {
                                return `${dbType.key}(${v._length})`;
                            }
                            return dbType.key;
                        }
                        if (v === dbType) {
                            return dbType.key;
                        }
                    }
                }
            }
            return v;
        }, '  '));
    return sequelize.define(name, attrs, {
        tableName: name,
        timestamps: false,
        hooks: {

        }
    });
}

const TYPES = ['STRING', 'INTEGER', 'BIGINT', 'TEXT', 'DOUBLE', 'DATEONLY', 'BOOLEAN'];

var exp = {
    defineModel: defineModel,
    sync: () => {
        // only allow create ddl in non-production environment:
        if (process.env.NODE_ENV !== 'production') {
            console.log('123');
            return sequelize.sync({ force: true });
        } else {
            //console.log('456');
            //throw new Error('Cannot sync() when NODE_ENV is set to \'production\'.');
            return sequelize.sync({ force: true });
        }
    }
};

for (let type of TYPES) {
    exp[type] = Sequelize[type];
}

exp.ID = ID_TYPE;
exp.generateId = generateId;

module.exports = exp;