// RMIT University Vietnam
// Course: COSC2430 Web Programming
// Semester: 2023B
// Assessment: Assignment 2
// Authors: Tran Mai Nhung - s3879954
//          Tran Nguyen Ha Khanh - s3877707
//          Nguyen Vinh Gia Bao - s3986287
//          Ton That Huu Luan - s3958304
//          Ho Van Khoa - s3997024
// Acknowledgement: 

const Hub = require('../db/models/shopping/Hub');

const getHubs = async (req) => {
    try {
        const hub = await Hub.find();
        return hub;
    } catch (err) {
        throw err
    }
}


module.exports = { getHubs }