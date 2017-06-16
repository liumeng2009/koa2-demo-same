/**
 * Created by liumeng on 2017/6/5.
 */
const db=require('../db');
module.exports = db.defineModel('votes', {
    id:{
        type:db.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    title:{
        type:db.STRING(100)
    },
    createtime:{
        type:db.INTEGER
    },
    group:{
        type:db.STRING(100)
    },
    sort: {
        type: db.STRING(100)
    },
    status:{
        type:db.INTEGER
    }
});