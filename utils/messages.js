const moment = require('moment')

exports.formatMessage = (username, text) => {
    return {
        username,
        text,
        time: moment().format('H:mm')
    }
}
