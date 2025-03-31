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
            <div className="">
                <button
                    className="bg-orange-500/40 hover:bg-orange-500 transition-all cursor-pointer px-3 py-1 text-white font-semibold rounded-lg"
                    onClick={() => setMostrarCadastroModal(true)}
                >
                    Cadastrar Vaga
                </button>

                {mostrarCadastroModal && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black/50 p-4">
                        <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                            <h3 className="text-lg font-bold">Cadastrar Nova Vaga</h3>
                            <form className="mt-4" onSubmit={handleSubmit}>
                                <input type="text" name="titulo" placeholder="Título da Vaga" className="w-full p-2 border rounded mb-2" required onChange={handleChange} />
                                <input type="text" name="empresa" placeholder="Empresa" className="w-full p-2 border rounded mb-2" required onChange={handleChange} />
                                <input type="text" name="localizacao" placeholder="Localização" className="w-full p-2 border rounded mb-2" required onChange={handleChange} />
                                <textarea name="descricao" placeholder="Descrição" className="w-full p-2 border rounded mb-2" required onChange={handleChange}></textarea>
                                <textarea name="descricaodetalhada" placeholder="Descrição vetalhada da vaga" className="w-full p-2 border rounded mb-2" required onChange={handleChange}></textarea>
                                <input type="text" name="salario" placeholder="Salário" className="w-full p-2 border rounded mb-2" onChange={handleChange} />
                                <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded w-full">
                                    Cadastrar Vaga
                                </button>
                            </form>
                            <button className="mt-4 bg-red-500 text-white px-4 py-2 rounded w-full" onClick={() => setMostrarCadastroModal(false)}>
                                Fechar
                            </button>
                        </div>
                    </div>
                )}
            </div>

        </>
    )
}