var db = require('../config/connection')
var collection = require('../config/collection')
const bcrypt = require('bcrypt')
const { use } = require('../routes/admin')
const { response } = require('express')
var ObjectId = require('mongodb').ObjectId

module.exports={
    doAdminSignup: (adminData) => {
        return new Promise(async (resolve, reject) => {
            let respone = {}
            adminPass = adminData.adminPass.toString()
            adminData.adminPass = await bcrypt.hash(adminPass, 10)
            db.get().collection(collection.ADMIN_COLLECTION).insertOne(adminData).then(() => {
                // console.log(userData);
                respone.admin = adminData
                respone.status = true
                resolve(respone)
            })
        })
    },

    doAdminLogin: (adminData) => {
        return new Promise(async (resolve, reject) => {
            let respone = {}
            let admin = await db.get().collection(collection.ADMIN_COLLECTION).findOne({ adminEmail: adminData.adminEmail})
            if (admin) {
                bcrypt.compare(adminData.adminPass, admin.adminPass).then((status) => {
                    if (status) {
                        console.log('Admin login success......');
                        respone.admin = admin
                        respone.status = true
                        resolve(respone)
                    } else {
                        console.log('password incorrect.....');
                        resolve({ passwordStatus: true })
                    }
                })
            } else {
                console.log('admin email dosent match');
                resolve({ emailStatus: true })
            }
        })
    }
}