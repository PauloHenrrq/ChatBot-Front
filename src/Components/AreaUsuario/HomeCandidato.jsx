import HeaderCandidato from "../../Layout/HeaderCandidato";
import { useState, useEffect } from "react";
import { api } from "../../Routes/api";
import BarraPesquisa from "./BarraPesquisa";

export default function HomeCandidato() {
  const [vagas, setVagas] = useState([]);
  const [vagaSelecionada, setVagaSelecionada] = useState(null);

  useEffect(() => {
    const carregarVagas = async () => {
      try {
        const response = await api.get("/vagas");
        setVagas(response.data);
      } catch (error) {
        console.error("Erro ao carregar vagas:", error);
      }
    };
    carregarVagas();
  }, []);

  return (
    <>
      <HeaderCandidato />
      <div className="my-5">
        <BarraPesquisa onSearch={setVagas} />
      </div>

      <div className="flex flex-col md:flex-row min-h-screen bg-gray-100 p-4">
        {/* Lista de Vagas */}
        <div className="md:w-1/3 bg-white shadow-md rounded-lg p-4 overflow-auto max-h-screen">
          <h2 className="text-xl font-bold mb-4">Vagas Disponíveis</h2>
          {vagas.map((vaga) => (
            <div
              key={vaga.id}
              className="p-4 mb-2 border rounded-lg cursor-pointer hover:bg-gray-200"
              onClick={() => setVagaSelecionada(vaga)}
            >
              <h3 className="text-lg font-semibold">{vaga.titulo}</h3>
              <p className="text-gray-600">
                {vaga.empresa} - {vaga.localizacao}
              </p>
              <p className="text-sm text-gray-500 mt-2">{vaga.descricao}</p>
            </div>
          ))}
        </div>

        {/* Detalhes da Vaga */}
        <div className="md:w-2/3 bg-white shadow-md rounded-lg p-6 ml-4 overflow-auto max-h-screen">
          {vagaSelecionada ? (
            <>
              <h2 className="text-2xl font-bold">{vagaSelecionada.titulo}</h2>
              <p className="text-gray-700 mt-2">
                {vagaSelecionada.empresa} <span className="text-gray-300">|</span> {vagaSelecionada.localizacao}
              </p>
              <button className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500">
                Candidatar-se
              </button>

              <div className="mt-6 border-t pt-4">
                <h3 className="text-lg font-semibold">📍 Localização</h3>
                <p className="text-gray-600">{vagaSelecionada.localizacao}</p>
              </div>

              <div className="mt-6 border-t pt-4">
                <h3 className="text-lg font-semibold">🎁 Benefícios</h3>
                <ul className="list-disc pl-5 text-gray-600">
                  {vagaSelecionada.beneficios?.length > 0 ? (
                    vagaSelecionada.beneficios.map((beneficio, index) => (
                      <li key={index}>{beneficio}</li>
                    ))
                  ) : (
                    <p className="text-gray-500">Nenhum benefício informado.</p>
                  )}
                </ul>
              </div>

              <div className="mt-6 border-t pt-4">
                <h3 className="text-lg font-semibold">📝 Descrição completa da vaga</h3>
                {Array.isArray(vagaSelecionada.descricaodetalhada) ? (
                  vagaSelecionada.descricaodetalhada.map((section, index) => (
                    <div key={index} className="mt-4">
                      {section.requisitos && (
                        <>
                          <h4 className="font-semibold">Requisitos</h4>
                          <ul className="list-disc pl-5 text-gray-600">
                            {section.requisitos.map((req, idx) => (
                              <li key={idx}>{req}</li>
                            ))}
                          </ul>
                        </>
                      )}

                      {section.Responsabilidades && (
                        <>
                          <h4 className="font-semibold">Responsabilidades</h4>
                          <ul className="list-disc pl-5 text-gray-600">
                            {section.Responsabilidades.map((resp, idx) => (
                              <li key={idx}>{resp}</li>
                            ))}
                          </ul>
                        </>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">Nenhuma descrição detalhada disponível.</p>
                )}
              </div>
              <div className="mt-6 border-t pt-4">
                <h3 className="text-lg font-semibold">💰 Salário</h3>
                <p className="text-green-600 text-lg font-semibold">
                  {vagaSelecionada.salario || "A combinar"}
                </p>
              </div>
            </>
          ) : (
            <p className="text-gray-500 text-center">Selecione uma vaga para ver os detalhes.</p>
          )}
        </div>
      </div>
    </>
  );
}
