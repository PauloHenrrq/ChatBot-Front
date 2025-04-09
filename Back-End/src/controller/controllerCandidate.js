import candidate from "../services/serviceCandidate.js";

const { getCandidate, registerCandidate, putCandidate } = candidate

const controllerGetCandidate = (req, res) => {
    getCandidate(req, res)
}

const controllerPostCandidate = (req, res) => {
    registerCandidate(req, res)
}

const controllerPutCandidate = (req, res) => {
    putCandidate(req, res)
}

export default {
    controllerGetCandidate,
    controllerPostCandidate,
    controllerPutCandidate
}