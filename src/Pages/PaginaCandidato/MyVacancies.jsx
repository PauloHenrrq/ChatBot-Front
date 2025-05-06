import { useState, useEffect } from "react"
import HeaderCandidato from "../../Layout/HeaderCandidato"
import { api } from "../../Routes/server/api"

export default function MyVacancies() {
    const [vagas, setVagas] = useState([])
    const [candidato, setCandidato] = useState([])

    useEffect(() => {
        const carregarCandidato = async () => {
            try {
                const response = await api.get(`/candidaturas`)
                setCandidato(response.data)
                console.log(response.data) // Aqui você verá todas as vagas
            } catch (error) {
                console.error('Erro ao carregar candidatos:', error)
            }
        }
        
        
        carregarCandidato()
        
    }, [])

    useEffect(() => {
        const carregarVagas = async (candidato) => {
            try {
                const response = await api.get(`/vagas/${candidato.vagaId}`)
                setVagas(response.data)
                console.log(response.data)
            } catch (error) {
                console.error('Erro ao carregar vagas:', error)
            }
        }
        carregarVagas()
    }, [])


    return (
        <>
            <HeaderCandidato />

            <section className="max-w-6xl mx-auto mt-10">
                <div>
                   {candidato.map((cand) => {
                    <h1></h1>
                   })}
                </div>
            </section>
        </>
    )
}
