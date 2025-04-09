import answers from '../responses.js'
import Job from '../models/Job.js'

async function getJob (req, res) {
  try {
    const getJobs = await Job.findAll()

    if (getJobs.length === 0) {
      return answers.notFound(res, 'Nenhuma Vaga foi criada')
    }

    return answers.created(res, 'Vagas encontradas', getJobs)
  } catch (error) {
    return answers.internalServerError(
      res,
      'Houve um erro ao retornar as vagas',
      error
    )
  }
}

async function postJob (req, res) {
  try {
    const {
      title,
      enterprise,
      location,
      description,
      detailedDescription,
      salary
    } = req.body

    if (
      !title ||
      !enterprise ||
      !location ||
      !description ||
      !detailedDescription ||
      !salary
    ) {
      return answers.badRequest(
        res,
        'Todos os campos precisam estar preenchidos'
      )
    }

    const checkingJob = await Job.findOne({
      where: {
        title: title,
        enterprise: enterprise,
        location: location,
        description: description,
        detailedDescription: detailedDescription,
        salary: salary
      }
    })

    if (checkingJob) {
      return answers.badRequest(res, 'Uma vaga com essas informações já existe')
    }

    const jobCreated = await Job.create({
      title,
      enterprise,
      location,
      description,
      detailedDescription,
      salary
    })

    return answers.created(res, 'Vaga criada com sucesso', jobCreated)
  } catch (error) {
    return answers.internalServerError(
      res,
      'Houve um erro ao criar uma vaga',
      error
    )
  }
}

async function putJob (req, res) {
  try {
    const { id } = req.params
    const {
      title,
      enterprise,
      location,
      description,
      detailedDescription,
      salary
    } = req.body

    if (
      !title ||
      !enterprise ||
      !location ||
      !descriptio ||
      !detailedDescription ||
      !salary
    ) {
      return answers.badRequest(res, 'Os campos precisam estar preenchidos')
    }

    const findJob = await Job.findOne({
      where: {
        id: id
      }
    })
    if (!findJob) {
      return answers.badRequest(res, 'A vaga não existe')
    }

    const updatedJob = {
      title: title ?? findJob.title,
      enterprise: enterprise ?? findJob.enterprise,
      location: location ?? findJob.location,
      description: description ?? findJob.description,
      detailedDescription: detailedDescription ?? findJob.detailedDescription,
      salary: salary ?? findJob.salary
    }

    await Job.update(updatedJob, {
      where: {
        id: id
      }
    })

    const showingJob = await Job.findOne({
      where: {
        id: id
      }
    })

    return answers.success(res, `Vaga atualizada com sucesso`, showingJob)
  } catch (error) {
    return answers.internalServerError(
      res,
      'Houve um erro ao atualizar a vaga',
      error
    )
  }
}

async function deleteJob (req, res) {
  try {
    const { id } = req.params

    const jobDestroyed = await Job.findOne({
      where: {
        id: id
      }
    })

    if(!jobDestroyed) {
        return answers.badRequest(res, "Essa vaga não existe")
    }

    Job.destroy({
      where: {
        id: id
      }
    })

    return answers.success(res, 'Vaga deletada com sucesso', jobDestroyed)
  } catch (error) {
    return answers.internalServerError(
      res,
      'Houve um erro ao deletar a vaga',
      error
    )
  }
}

export default {
    getJob,
    postJob,
    putJob,
    deleteJob
}