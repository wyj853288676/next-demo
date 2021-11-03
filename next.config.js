const path = require('path')

module.exports = {
    sassOptions: {
        includePaths: [
            path.join(__dirname, 'styles'),
            path.join(__dirname, 'components')
        ],
    },
    webpack: config => {
        config.resolve.alias['@'] = path.resolve(__dirname);
        return config;
    }
}