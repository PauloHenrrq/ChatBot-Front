import { useState } from "react";

import Header from "../Layout/Header"

export default function Candidatos() {
  const [candidatos, setCandidatos] = useState([
    { nome: "Carlos Silva", email: "carlos@email.com", status: "Em análise" },
    { nome: "Ana Souza", email: "ana@email.com", status: "Aprovado para entrevista" },
  ]);

  const [mostrarModal, setMostrarModal] = useState(false);

  function atualizarStatus(index, novoStatus) {
    const novosCandidatos = [...candidatos];
    novosCandidatos[index].status = novoStatus;
    setCandidatos(novosCandidatos);
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />

      <div className="p-6 max-w-4xl mx-auto">
        
          <div>
            <h2 className="text-2xl font-semibold mb-4">Candidatos</h2>
            <div className="overflow-x-auto">
              <table className="w-full bg-white shadow-md rounded-lg overflow-hidden">
                <thead className="bg-orange-500 text-white">
                  <tr>
                    <th className="p-3">Nome</th>
                    <th className="p-3">Email</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {candidatos.map((cand, index) => (
                    <tr key={index} className="border-b">
                      <td className="p-3 whitespace-nowrap">{cand.nome}</td>
                      <td className="p-3 whitespace-nowrap">{cand.email}</td>
                      <td className="p-3">
                        <select className="border p-1 rounded w-full" value={cand.status} onChange={(e) => atualizarStatus(index, e.target.value)}>
                          <option value="Em análise">Em análise</option>
                          <option value="Aprovado para entrevista">Aprovado para entrevista</option>
                          <option value="Reprovado">Reprovado</option>
                        </select>
                      </td>
                      <td className="p-3">
                        <button className="bg-orange-500 hover:bg-orange-400 transition-all text-white px-3 py-1 rounded w-full" onClick={() => setMostrarModal(true)}>
                          Visualizar Currículo
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        

      </div>

      {mostrarModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full">
            <h3 className="text-lg font-bold">Currículo do Candidato</h3>
            <p className="mt-2">Currículo aqui</p>
            <button className="bg-orange-600 text-white px-4 py-2 rounded mt-4 w-full" onClick={() => setMostrarModal(false)}>
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}