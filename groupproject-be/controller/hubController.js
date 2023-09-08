const Hub = require('../db/models/shopping/Hub');
const {sendResponse} = require('../routes/middleware');

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