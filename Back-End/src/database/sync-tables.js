import Candidate from "../models/candidate.js"
import Enterprise from "../models/Enterprise.js"
import Recruiter from "../models/Recruiter.js"

const syncTables = async() => {
    Candidate.sync(),
    Enterprise.sync(),
    Recruiter.sync()
}

export default syncTables