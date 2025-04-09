import Candidate from "../models/Candidate.js"
import Job from "../models/Job.js"
import Recruiter from "../models/Recruiter.js"

const syncTables = async() => {
    Candidate.sync(/*{ alter: true }*/),
    Job.sync(),
    Recruiter.sync()
}

export default syncTables