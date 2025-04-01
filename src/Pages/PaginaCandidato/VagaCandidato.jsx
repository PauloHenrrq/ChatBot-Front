import { useEffect, useState } from "react";
import { api } from '../../Routes/api';
import HeaderCandidato from '../../Layout/HeaderCandidato';

export default function VagaCandidato() {
    const [modalAberto, setModalAberto] = useState(null);
    const [vagas, setVagas] = useState([]);
    const [curriculo, setCurriculo] = useState(null);

    useEffect(() => {
        api.get('/vagas')
            .then(response => setVagas(response.data))
            .catch(err => console.error(err));
    }, []);

    const handleFileChange = (e) => {
        setCurriculo(e.target.files[0]);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!curriculo) {
            alert("Por favor, envie um currículo antes de confirmar a candidatura.");
            return;
        }
        alert("Candidatura enviada com sucesso!");
        setModalAberto(null);
    };

    return (
        <>
            <HeaderCandidato />
            <div className="mt-10">
                <h1 className="text-4xl font-bold text-center">Vagas Disponíveis</h1>
            </div>
            <div className="h-full w-7xl mx-auto shadow-xl p-10 grid grid-cols-3 max-lg:grid-cols-3 max-md:grid-cols-2 max-sm:grid-cols-1 justify-center gap-5">
                {vagas.map((vaga) => (
                    <div className="bg-gradient-to-b from-orange-200 to-white shadow-md rounded-lg p-6 flex flex-col justify-between" key={vaga.id}>
                        <div className="flex flex-col">
                            <h3 className="text-2xl font-semibold">{vaga.titulo}</h3>
                            <h4 className="text-gray-700 font-medium mt-1">{vaga.empresa}</h4>
                            <p className="text-gray-500 mt-2">{vaga.descricao}</p>
                        </div>
                        <div className="flex items-center justify-between mt-6">
                            <span className="text-lg font-bold text-gray-800">R$ {vaga.salario}</span>
                            <button
                                className="py-2 px-4 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition cursor-pointer"
                                onClick={() => setModalAberto(vaga.id)}
                            >
                                Candidatar-se
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            {modalAberto && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/50 p-4 z-50">
                    <div className="bg-white p-6 rounded-lg shadow-xl max-w-lg w-full">
                        <h2 className="text-2xl font-bold text-orange-600">Detalhes da Vaga</h2>
                        <div className="mt-4">
                            <p><span className="font-semibold">Título:</span> {vagas.find(v => v.id === modalAberto)?.titulo}</p>
                            <p><span className="font-semibold">Empresa:</span> {vagas.find(v => v.id === modalAberto)?.empresa}</p>
                            <p><span className="font-semibold">Descrição:</span> {vagas.find(v => v.id === modalAberto)?.descricaodetalhada}</p>
                            <p className="text-lg font-semibold mt-2">Salário: R$ {vagas.find(v => v.id === modalAberto)?.salario}</p>
                        </div>
                        <form onSubmit={handleSubmit} className="mt-4">
                            <label className="block text-gray-700 font-semibold">Envie seu currículo (PDF/DOCX)</label>
                            <input type="file" accept=".pdf,.doc,.docx" onChange={handleFileChange} className="mt-2 p-2 border rounded w-full" required />
                            <div className="flex justify-end gap-4 mt-6">
                                <button
                                    type="button"
                                    className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded-lg transition cursor-pointer"
                                    onClick={() => setModalAberto(null)}
                                >
                                    Fechar
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition cursor-pointer"
                                >
                                    Confirmar Candidatura
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}