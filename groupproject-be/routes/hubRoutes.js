const express = require('express');
const {
    getHubs
} = require('../controller/hubController');

const router = express.Router();
router.route('/').get(getHubs);

module.exports = router;