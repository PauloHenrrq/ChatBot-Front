import answers from '../responses.js'

const adminMiddleware = (req, res, next) => {
  if (!req.user.admin) {
    return answers.unauthorized(
      res,
      'Acesso negado. Você não possui acesso de administrador'
    )
  }

  next()
}

export default adminMiddleware