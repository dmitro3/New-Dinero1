import config from "@src/configs/app.config";

export const basicAuthentication = (req, res, next) => {

    const authHeader = req.headers['authorization']

    if (!authHeader || !authHeader.startsWith('Basic ')) {
        res.setHeader('WWW-Authenticate', 'Basic')
        return next(InvalidCredentialsErrorType)
    }

    const base64Credentials = authHeader.split(' ')[1]
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii')
    const [username, password] = credentials.split(':')

    if (username === config.get('basic.username') && password === config.get('basic.password')) {
        return next()
    } else {
        res.setHeader('WWW-Authenticate', 'Basic')
        return next(InvalidCredentialsErrorType)
    }
}