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
const PORT = process.env.FRONT_PORT || 3001;

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