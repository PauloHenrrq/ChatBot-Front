import answers from '../responses.js'
import Candidate from '../models/Candidate.js'

import bcrypt, { hashSync } from 'bcrypt'

async function getCandidate (req, res) {
  try {
    const getCandidate = await Candidate.findAll()

    if (getCandidate.length === 0) {
      return answers.notFound(res, 'Nenhum Candidato encontrado')
    }

    return answers.success(
      res,
      'Candidatos encontrado com sucesso',
      getCandidate
    )
  } catch (error) {
    return answers.internalServerError(
      res,
      'Houve um erro ao encontrar os Candidatos',
      error
    )
  }
}

async function registerCandidate (req, res) {
  try {
    const { name, email, password } = req.body

    if (!name || !email || !password) {
      return answers.badRequest(res, 'Os campos não podem ficar vazios')
    }

    const emailCheck = await Candidate.findOne({
      where: {
        email: email
      }
    })

    if (emailCheck) {
      return answers.badRequest(res, 'Esse e-mail já foi utilizado!')
    }

    const encryptedPassword = bcrypt.hashSync(password, 10)
    const candidateCreated = await Candidate.create({
      name,
      email,
      password: encryptedPassword,
      admin: false
    })

    return answers.created(
      res,
      'Candidato cadastrado com sucesso!',
      candidateCreated
    )
  } catch (error) {
    return answers.internalServerError(res, 'Erro ao cadastrar', error)
  }
}

async function putCandidate (req, res) {
  try {
    const { name, email, password } = req.body

    const checkEmail = await Enterprise.findOne({
      where: {
        email: email
      }
    })
    if (checkEmail) {
      return answers.badRequest(res, 'Esse e-mail já existe!')
    }

    const hashPassword = bcrypt.hashSync(password, 10)
    const updatedData = {
      name: name != null ? name : Candidate.name,
      email: email != null ? email : Candidate.email,
      password: hashPassword != null ? hashPassword : Candidate.password,
      admin: false
    }

    const candidateUpdate = await Candidate.update(updatedData, {
        where: {
            email: email
        }
    })

    return answers.success(res, "Informações atualizadas!", candidateUpdate)
  } catch (error) {
    return answers.internalServerError(res, "Erro ao atualizar as informações", error)
  }
}

export default {
  getCandidate,
  registerCandidate,
  putCandidate
}