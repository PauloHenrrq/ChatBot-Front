import answers from "../responses.js";
import Candidate from "../models/Candidate.js";

import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

const SECRET_KEY = process.env.SECRET_KEY

async function login(req, res) {
    try {
        const { email, password } = req.body

        if(!email || !password) {
            return answers.badRequest(res, "Preencha os campos")
        }

        const findCandidate = await Candidate.findOne({
            where: {
                email: email
            }
        })
        if (!findCandidate) {
            answers.badRequest(res, "Email ou Senha incorretos!")
        }
        
        const verifyPassword = bcrypt.compare(password, findCandidate.password)
        if(!verifyPassword) {
            answers.badRequest(res, "Email ou Senha incorretos!")
        } else {
            const jwtToken = jwt.sign(
                {
                    data: { id: findCandidate.id, email: findCandidate.email }
                },
                SECRET_KEY,
                { expiresIn: '1h'}
            )
        }

        return answers.success(res, "Login efetuado com sucesso")
    } catch (error) {
        return answers.internalServerError(res, "Erro ao efetuar o login")
    }
}

export default login