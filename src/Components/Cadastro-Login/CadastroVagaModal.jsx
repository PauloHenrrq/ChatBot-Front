import { useState } from "react";
import { api } from '../../Routes/api'

export default function CadastroVagaModal() {
    const [mostrarCadastroModal, setMostrarCadastroModal] = useState(false);
    const [novaVaga, setNovaVaga] = useState({
        titulo: "",
        empresa: "",
        localizacao: "",
        descricao: "",
        descricaodetalhada: "",
        salario: ""
    });

    const handleChange = (e) => {
        setNovaVaga({ ...novaVaga, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post("/vagas", novaVaga);
            alert("Vaga cadastrada com sucesso!");
            setMostrarCadastroModal(false);
        } catch (error) {
            console.error("Erro ao cadastrar vaga", error);
        }
    };

    return (
        <>

            <button
                className="bg-orange-500/70 hover:bg-orange-500 transition-all cursor-pointer max-md:w-1/3 px-5 py-2 text-white font-semibold rounded-lg shadow-md hover:shadow-lg"
                onClick={() => setMostrarCadastroModal(true)}
            >
                Cadastrar Vaga
            </button>

            {mostrarCadastroModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full transition-all transform scale-95 hover:scale-100">
                        <h3 className="text-lg font-bold text-center text-orange-600 mb-6">Cadastrar Nova Vaga</h3>
                        <form className="mt-4" onSubmit={handleSubmit}>
                            <input
                                type="text"
                                name="titulo"
                                placeholder="Título da Vaga"
                                className="w-full p-3 border rounded-lg mb-4 transition-all focus:ring-2 focus:ring-orange-500 focus:outline-none"
                                required
                                onChange={handleChange}
                            />
                            <input
                                type="text"
                                name="empresa"
                                placeholder="Empresa"
                                className="w-full p-3 border rounded-lg mb-4 transition-all focus:ring-2 focus:ring-orange-500 focus:outline-none"
                                required
                                onChange={handleChange}
                            />
                            <input
                                type="text"
                                name="localizacao"
                                placeholder="Localização"
                                className="w-full p-3 border rounded-lg mb-4 transition-all focus:ring-2 focus:ring-orange-500 focus:outline-none"
                                required
                                onChange={handleChange}
                            />
                            <textarea
                                name="descricao"
                                placeholder="Descrição"
                                className="w-full p-3 border rounded-lg mb-4 transition-all focus:ring-2 focus:ring-orange-500 focus:outline-none"
                                required
                                onChange={handleChange}
                            ></textarea>
                            <textarea
                                name="descricaodetalhada"
                                placeholder="Descrição detalhada da vaga"
                                className="w-full p-3 border rounded-lg mb-4 transition-all focus:ring-2 focus:ring-orange-500 focus:outline-none"
                                required
                                onChange={handleChange}
                            ></textarea>
                            <input
                                type="text"
                                name="salario"
                                placeholder="Salário"
                                className="w-full p-3 border rounded-lg mb-4 transition-all focus:ring-2 focus:ring-orange-500 focus:outline-none"
                                onChange={handleChange}
                            />
                            <button
                                type="submit"
                                className="bg-orange-600 hover:bg-orange-500 text-white px-4 py-2 rounded-lg w-full cursor-pointer transition-all"
                            >
                                Cadastrar Vaga
                            </button>
                        </form>
                        <button
                            className="mt-4 bg-gray-500 hover:bg-gray-400 text-white px-4 py-2 rounded-lg w-full cursor-pointer transition-all"
                            onClick={() => setMostrarCadastroModal(false)}
                        >
                            Fechar
                        </button>
                    </div>
                </div>
            )}
        </>
    )
}
