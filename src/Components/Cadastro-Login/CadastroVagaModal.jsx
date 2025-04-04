import { useState } from "react";
import { api } from '../../Routes/api';

export default function CadastroVagaModal() {
    const [mostrarCadastroModal, setMostrarCadastroModal] = useState(false);
    const [novaVaga, setNovaVaga] = useState({
        titulo: "",
        empresa: "",
        localizacao: "",
        descricao: "",
        descricaodetalhada: "",
        salario: "",
        requisitos: "",
        responsabilidades: "",
        beneficios: ""
    });

    const handleChange = (e) => {
        setNovaVaga({ ...novaVaga, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const vagaFormatada = {
            ...novaVaga,
            requisitos: novaVaga.requisitos.split(",").map(req => req.trim()), 
            responsabilidades: novaVaga.responsabilidades.split(",").map(resp => resp.trim()),
            beneficios: novaVaga.beneficios.split(",").map(ben => ben.trim())
        };

        try {
            await api.post("/vagas", vagaFormatada);
            alert("Vaga cadastrada com sucesso!");
            setMostrarCadastroModal(false);
        } catch (error) {
            console.error("Erro ao cadastrar vaga", error);
            alert("Erro ao cadastrar vaga.");
        }
    };

    return (
        <>
            <button
                className="bg-orange-500 hover:bg-orange-600 transition-all px-5 py-2 text-white font-semibold rounded-lg shadow-md hover:shadow-lg cursor-pointer"
                onClick={() => setMostrarCadastroModal(true)}
            >
                Cadastrar Vaga
            </button>

            {mostrarCadastroModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full transition-all">
                        <h3 className="text-xl font-bold text-center text-orange-600 mb-6">Cadastrar Nova Vaga</h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <input type="text" name="titulo" placeholder="Título da Vaga" className="bg-zinc-100 p-2 rounded-lg col-span-2 grid grid-cols-subgrid" required onChange={handleChange} />
                                <input type="text" name="empresa" placeholder="Empresa" className="bg-zinc-100 p-2 rounded-lg" required onChange={handleChange} />
                                <input type="text" name="localizacao" placeholder="Localização" className="bg-zinc-100 p-2 rounded-lg" required onChange={handleChange} />
                            </div>
                            
                            <div className="grid grid-cols-1 gap-4">
                                <textarea name="descricao" placeholder="Descrição Resumida" className="bg-zinc-100 p-2 rounded-lg overflow-auto" required onChange={handleChange}></textarea>
                                <textarea name="descricaodetalhada" placeholder="Descrição Detalhada" className="bg-zinc-100 p-2 rounded-lg overflow-auto" required onChange={handleChange}></textarea>
                                <textarea name="requisitos" placeholder="Requisitos (separados por vírgula)" className="bg-zinc-100 p-2 rounded-lg overflow-auto" onChange={handleChange}></textarea>
                                <textarea name="responsabilidades" placeholder="Responsabilidades (separadas por vírgula)" className="bg-zinc-100 p-2 rounded-lg overflow-auto" onChange={handleChange}></textarea>
                                <textarea name="beneficios" placeholder="Benefícios (separados por vírgula)" className="bg-zinc-100 p-2 rounded-lg overflow-auto" onChange={handleChange}></textarea>
                            </div>
                            
                            <div>   

                            </div>
                            
                            
                            <input type="text" name="salario" placeholder="Salário" className="bg-zinc-100 p-2 rounded-lg" onChange={handleChange} />

                            

                            <button type="submit" className="bg-orange-600 hover:bg-orange-500 text-white px-4 py-2 rounded-lg w-full cursor-pointer transition-all">
                                Cadastrar Vaga
                            </button>
                        </form>

                        <button className="mt-4 bg-gray-500 hover:bg-gray-400 text-white px-4 py-2 rounded-lg w-full cursor-pointer transition-all" onClick={() => setMostrarCadastroModal(false)}>
                            Fechar
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}
