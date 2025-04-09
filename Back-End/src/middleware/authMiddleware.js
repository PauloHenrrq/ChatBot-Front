import jwt from 'jsonwebtoken'
import answers from '../responses'

const SECRET_KEY = process.env.SECRET_KEY

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.header('Authorization')
    if (!authHeader) {
      return answers.unauthorized(res, 'Unauthorized')
    }

    const token = authHeader.replace('Bearer ', '')

    const verifiedToken = jwt.verify(token, SECRET_KEY)
    req.user = verifiedToken
    next()
  } catch (error) {
    return answers.internalServerError(
      res,
      error.message === 'jwt expired' ? 'Sessão expirou' : 'Unauthorized'
    )
  }
}

export default authMiddleware
