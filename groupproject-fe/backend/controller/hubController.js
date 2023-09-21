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
const { sendResponse } = require('../routes/middleware');

const getHubs = async (req, res) => {
    try {
        const hub = await Hub.find();
        sendResponse(res, 200, `ok`, hub);
    } catch (err) {
        console.log(err)
        sendResponse(res, 500, `Error ${err}`);
    }
}


module.exports = { getHubs }