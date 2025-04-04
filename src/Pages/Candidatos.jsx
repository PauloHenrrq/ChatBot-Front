import { useState, useEffect } from "react";
import { api } from "../Routes/api";
import Header from "../Layout/Header";

export default function Candidatos() {
  const [candidatos, setCandidatos] = useState([]);
  const [modalAberto, setModalAberto] = useState(false);
  const [candidatoSelecionado, setCandidatoSelecionado] = useState(null);

  useEffect(() => {
    const carregarCandidatos = async () => {
      try {
        const response = await api.get("/candidaturas");
        setCandidatos(response.data);
      } catch (error) {
        console.error("Erro ao carregar candidatos:", error);
      }
    };

    carregarCandidatos();
  }, []);

  const atualizarStatus = async (id, novoStatus) => {
    try {
      await api.patch(`/candidaturas/${id}`, { status: novoStatus });
      setCandidatos((prev) =>
        prev.map((cand) => (cand.id === id ? { ...cand, status: novoStatus } : cand))
      );
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
      alert("Erro ao atualizar status.");
    }
  };

  const abrirModal = (candidato) => {
    setCandidatoSelecionado(candidato);
    setModalAberto(true);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="p-6 max-w-6xl mx-auto">
        <h2 className="text-2xl font-semibold mb-4">Candidatos Inscritos</h2>
        <div className="overflow-x-auto">
          <table className="w-full bg-white shadow-md rounded-lg overflow-hidden">
            <thead className="bg-orange-500 text-white">
              <tr>
                <th className="p-3">Nome</th>
                <th className="p-3">Email</th>
                <th className="p-3">Vaga</th>
                <th className="p-3">Status</th>
                <th className="p-3">Ações</th>
              </tr>
            </thead>
            <tbody>
              {candidatos.map((cand) => (
                <tr key={cand.id} className="border-b">
                  <td className="p-3 whitespace-nowrap">{cand.nome}</td>
                  <td className="p-3 whitespace-nowrap">{cand.email}</td>
                  <td className="p-3 whitespace-nowrap">{cand.vagaTitulo}</td>
                  <td className="p-3">
                    <select
                      className="border p-1 rounded w-full cursor-pointer"
                      value={cand.status || "Em análise"}
                      onChange={(e) => atualizarStatus(cand.id, e.target.value)}
                    >
                      <option value="Em análise">Em análise</option>
                      <option value="Aprovado para entrevista">Aprovado para entrevista</option>
                      <option value="Contratado">Contratado</option>
                      <option value="Reprovado">Reprovado</option>
                    </select>
                  </td>
                  <td className="p-3">
                    <button
                      className="bg-orange-500 hover:bg-orange-400 transition-all text-white px-3 py-1 rounded w-full cursor-pointer"
                      onClick={() => abrirModal(cand)}
                    >
                      Visualizar Currículo
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL */}
      {modalAberto && candidatoSelecionado && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold">{candidatoSelecionado.nome}</h2>
            <p className="text-gray-700 mt-2">📧 {candidatoSelecionado.email}</p>
            <p className="text-gray-700">📞 {candidatoSelecionado.telefone}</p>
            <p className="text-gray-700">📅 {candidatoSelecionado.dataNascimento}</p>

            <h3 className="text-lg font-semibold mt-4">📌 Vaga Inscrita</h3>
            <p className="text-gray-700 font-bold">{candidatoSelecionado.vagaTitulo}</p>

            <h3 className="text-lg font-semibold mt-4">📍 Endereço</h3>
            <p className="text-gray-700">
              {candidatoSelecionado.endereco.rua}, {candidatoSelecionado.endereco.numero}, {candidatoSelecionado.endereco.bairro}
            </p>
            <p className="text-gray-700">
              {candidatoSelecionado.endereco.cidade} - {candidatoSelecionado.endereco.estado}, {candidatoSelecionado.endereco.cep}
            </p>

            {/* Link para visualizar o currículo */}
            {candidatoSelecionado.curriculo && (
              <div className="mt-4">
                <h3 className="text-lg font-semibold">📄 Currículo</h3>
                <a
                  href={candidatoSelecionado.curriculo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  Visualizar Currículo
                </a>
              </div>
            )}

            {/* BOTÕES DO MODAL */}
            <div className="flex justify-end mt-4">
              <button
                className="px-4 py-2 bg-gray-400 hover:bg-gray-500 text-white rounded-lg cursor-pointer"
                onClick={() => setModalAberto(false)}
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
