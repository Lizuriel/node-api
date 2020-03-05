'use strict';

module.exports = (sequelize, DataTypes) => {
    // Roles
    let ROLES = {
        NM: 'normalUser',
        ADMIN: 'admin',
    };

    // Definition
    let user = sequelize.define('user', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        password: DataTypes.STRING,
        email: {
            type: DataTypes.STRING,
            unique: true,
            validate: {
                isEmail: true
            },
            allowNull: false,
        },
        lastname: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        firstname: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        role: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: ROLES.NM
        },
        active: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        },
        access_token: {
            type:DataTypes.TEXT,
            allowNull: true
        },
        access_token_expire_date: {
            type:DataTypes.DATE,
            allowNull: true
        },
    }, {
        underscored: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        scopes: {
            'normalUser': {
                where: {
                    role: ROLES.NM
                }
            },
            'admin': {
                where: {
                    role: ROLES.ADMIN
                }
            },
            'both': {
                where: {
                    role: {
                        $in: [ROLES.ADMIN, ROLES.NM]
                    }
                }
            },
        },
        // getterMethods: {
        //     avatarPath: function() {
        //         let avatarPath = null;
        //         if (this.avatar_file_name) {
        //             avatarPath = __dirname + '/../../' + Directory.upload_medias + '/users/' + this.id + '/' + this.avatar_file_name
        //         }
        //         return avatarPath;
        //     },
        //     avatarUrl: function() {
        //         let avatarUrl = null;
        //         if (this.avatar_file_name) {
        //             avatarUrl = Medias.avatarUrl.replace(':user_id', this.id);
        //         }
        //         return avatarUrl;
        //     },
        // }
    });

    // Relations
    user.associate = function(models) {
        // associations can be defined here
        // user.hasMany(models.oauth_token, {
        //     as: 'AccessTokens',
        //     onDelete: 'cascade',
        //     hooks: true
        // });
    };

    // Methods
    user.prototype.hasRole = function(role) {
        return this.role === role;
    };
    user.prototype.getFieldsAllowedToUpdate = function() {
        let fields = [];
        let excludes = ['id', 'updated_at', 'created_at'];
        Object.keys(this.rawAttributes).forEach(function(k) {
            if (!excludes.includes(k)) {
                fields.push(k);
            }
        });
        return fields;
    };

    return user;
};
