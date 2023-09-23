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
const hubController = require('../controller/hubController');
const { sendResponse } = require('../middleware/middleware');
const HttpStatus = require('../utils/commonHttpStatus');

const getHubs = async (req) => {
    try {
        const hubList = await hubController.getHubs();
        return sendResponse(HttpStatus.OK_STATUS, `Get hubs successfully`, hubList);
    } catch (err) {
        return sendResponse(err.code ?? HttpStatus.INTERNAL_SERVER_ERROR_STATUS, err.message ?? `Get products failed`);
    }
}

module.exports = {
    getHubs
}