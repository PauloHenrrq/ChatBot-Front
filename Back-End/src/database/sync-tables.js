import Candidate from "../models/candidate.js"

const syncTables = async() => {
    await Candidate.sync({ force: false })
}

export default syncTables