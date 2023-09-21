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

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3000';
// Route constants
const HOME_ROUTE = '/';

// authentication
const USER_ROUTE = '/api/user';
const LOGIN_ROUTE = `${USER_ROUTE}/login`;
const REGISTER_ROUTE = `${USER_ROUTE}/register`;
const MY_ACCOUNT_ROUTE = `${USER_ROUTE}/my-account`;
const GET_USER_ROUTE = `${USER_ROUTE}/`;
const CHANGE_PASSWORD_ROUTE = `${USER_ROUTE}/change-password`;


// Environment constants
const PORT = process.env.PORT || 3001;

module.exports = {
    BACKEND_URL,
    HOME_ROUTE,
    USER_ROUTE,
    LOGIN_ROUTE,
    REGISTER_ROUTE,
    MY_ACCOUNT_ROUTE,
    GET_USER_ROUTE,
    CHANGE_PASSWORD_ROUTE,
    PORT
}