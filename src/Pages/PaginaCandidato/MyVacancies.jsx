import { useState, useEffect } from "react"
import HeaderCandidato from "../../Layout/HeaderCandidato"
import { api } from "../../Routes/server/api"

export default function MyVacancies() {
    const [vagas, setVagas] = useState([])
    const [candidaturas, setCandidaturas] = useState([])

    useEffect(() => {
        const buscarCandidaturas = async () => {
          try {
            const response = await api.get('/candidaturas')
            const emailLogado = "candidato@gmail.com" // simulação do login
            const filtradas = response.data.filter(
              (c) => c.email === emailLogado
            )
            setCandidaturas(filtradas)
          } catch (error) {
            console.error('Erro ao buscar candidaturas:', error)
          }
        }
    
        buscarCandidaturas()
      }, [])


    return (
        <>
            <HeaderCandidato />

            <div className="max-w-5xl mx-auto mt-10 px-4">
                <h2 className="text-2xl font-bold mb-4">Minhas Candidaturas</h2>
                {candidaturas.length === 0 ? (
                    <p>Nenhuma candidatura encontrada.</p>
                ) : (
                    <div className="grid grid-cols-1 gap-4">
                        {candidaturas.map((candidatura) => (
                            <div
                                key={candidatura.id}
                                className="border p-4 rounded-lg shadow-md"
                            >
                                <h3 className="text-xl font-semibold">{candidatura.vagaTitulo}</h3>
                                <p className="text-gray-600 mb-2">Status: <strong>{candidatura.status}</strong></p>

                                {/* Etapas futuras */}
                                {/* 
              <div className="mt-2">
                <p className="text-sm text-gray-700">Etapas:</p>
                <ul className="list-disc ml-5 text-sm">
                  <li className={candidatura.status !== "Em análise" ? "text-green-600" : ""}>Cadastro realizado</li>
                  <li className={candidatura.status === "Entrevista" || candidatura.status === "Contratado" ? "text-green-600" : ""}>Entrevista</li>
                  <li className={candidatura.status === "Contratado" ? "text-green-600" : ""}>Aprovado</li>
                </ul>
              </div>
              */}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    )
}
