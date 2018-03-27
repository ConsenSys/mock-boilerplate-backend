var config = {};

config.api_secret = process.env.API_SECRET || 'nososecretsecret'

config.port = process.env.MOCK_DB_PORT || 6454
config.apiServerAddress = 'http://localhost'+':'+config.port

module.exports = config
