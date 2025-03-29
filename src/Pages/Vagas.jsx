import { useState } from "react";

import Header from "../Layout/Header"

export default function Vagas() {

    const [vagas, setVagas] = useState([
        { titulo: "Desenvolvedor Web", descricao: "Desenvolvimento de aplicações web responsivas." },
        { titulo: "Analista de Dados", descricao: "Análise de dados e geração de insights." },
    ]);

    function criarVaga(event) {
        event.preventDefault();
        const titulo = event.target.tituloVaga.value;
        const descricao = event.target.descricaoVaga.value;
        setVagas([...vagas, { titulo, descricao }]);
        event.target.reset();
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <Header />
                <div className="w-[80%] mx-auto mt-6">
                    <h2 className="text-2xl font-semibold mb-4">Vagas</h2>
                    <form className="mb-3" onSubmit={criarVaga}>
                        <input type="text" className="w-full p-2 border rounded mb-2" name="tituloVaga" placeholder="Título da Vaga" required />
                        <textarea className="w-full p-2 border rounded mb-2" name="descricaoVaga" placeholder="Descrição" required></textarea>
                        <button type="submit" className="bg-orange-500 hover:bg-orange-400 cursor-pointer transition-all text-white px-4 py-2 rounded w-full">Criar Vaga</button>
                    </form>
                    <ul className="bg-white p-4 rounded shadow">
                        {vagas.map((vaga, index) => (
                            <li key={index} className="border-b p-3">
                                <h3 className="font-semibold">{vaga.titulo}</h3>
                                <p>{vaga.descricao}</p>
                            </li>
                        ))}
                    </ul>
                </div>
        </div>
    );
}