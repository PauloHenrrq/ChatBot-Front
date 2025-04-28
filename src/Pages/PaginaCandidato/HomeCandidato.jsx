import HeaderCandidato from "../../Layout/HeaderCandidato";
import { useState, useEffect } from "react";
import { api } from "../../Routes/server/api";
import BarraPesquisa from "../../Components/AreaUsuario/BarraPesquisa";

const vagaMap = {
  part1: [
    { type: "text", name: "nome", placeholder: "Nome Completo" },
    { type: "email", name: "email", placeholder: "E-mail" },
    { type: "date", name: "dataNascimento", placeholder: "Data de Nascimento" },
    { type: "text", name: "telefone", placeholder: "Telefone" }
  ],
  part2: [
    { type: "text", name: "endereco.rua", placeholder: "Rua" },
    { type: "number", name: "endereco.numero", placeholder: "Número" },
    { type: "text", name: "endereco.bairro", placeholder: "Bairro" },
    { type: "text", name: "endereco.cidade", placeholder: "Cidade" },
    { type: "text", name: "endereco.estado", placeholder: "Estado" },
    { type: "text", name: "endereco.cep", placeholder: "CEP" }
  ]
  
};

export default function HomeCandidato() {
  const [vagas, setVagas] = useState([]);
  const [vagaSelecionada, setVagaSelecionada] = useState(null);
  const [modalAberto, setModalAberto] = useState(false);
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    dataNascimento: "",
    telefone: "",
    endereco: {
      rua: "",
      numero: "",
      bairro: "",
      cidade: "",
      estado: "",
      cep: "",
    },
    mensagem: "",
    curriculo: null,
  });

  
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


  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith("endereco.")) {
      const field = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        endereco: { ...prev.endereco, [field]: value }
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async () => {
    if (!vagaSelecionada) {
      alert("Por favor, selecione uma vaga antes de se candidatar.");
      return;
    }
  
    if (!formData.nome || !formData.email || !formData.telefone) {
      alert("Preencha todos os campos obrigatórios.");
      return;
    }
  
    const candidatura = {
      vagaId: vagaSelecionada.id,
      vagaTitulo: vagaSelecionada.titulo, // Agora salvamos o nome da vaga
      nome: formData.nome,
      email: formData.email,
      dataNascimento: formData.dataNascimento,
      telefone: formData.telefone,
      endereco: formData.endereco,
      mensagem: formData.mensagem,
      curriculo: formData.curriculo ? formData.curriculo.name : null
    };
  
    try {
      await api.post("/candidaturas", candidatura); // Enviando como JSON
  
      alert("Candidatura enviada com sucesso!");
      setModalAberto(false);
    } catch (error) {
      console.error("Erro ao enviar candidatura:", error);
      alert("Erro ao enviar candidatura. Tente novamente.");
    }
  };

  
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
              <button
                className="mt-6 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-500 cursor-pointer"
                onClick={() => setModalAberto(true)}
              >
                Candidatar-se
              </button>

              <div className="mt-6 border-t pt-4">
                <h3 className="text-lg font-semibold">📍 Localização</h3>
                <p className="text-gray-600">{vagaSelecionada.localizacao}</p>
              </div>

              <div className="mt-6 border-t pt-4">
                <h3 className="text-lg font-semibold">📝 Requisitos</h3>
                <ul className="list-disc pl-5 text-gray-600">
                  {vagaSelecionada.requisitos?.length > 0 ? (
                    vagaSelecionada.requisitos.map((req, index) => (
                      <li key={index}>{req}</li>
                    ))
                  ) : (
                    <p className="text-gray-500">Nenhum requisito informado.</p>
                  )}
                </ul>
              </div>

              <div className="mt-6 border-t pt-4">
                <h3 className="text-lg font-semibold">🔹 Responsabilidades</h3>
                <ul className="list-disc pl-5 text-gray-600">
                  {vagaSelecionada.responsabilidades?.length > 0 ? (
                    vagaSelecionada.responsabilidades.map((resp, index) => (
                      <li key={index}>{resp}</li>
                    ))
                  ) : (
                    <p className="text-gray-500">Nenhuma responsabilidade informada.</p>
                  )}
                </ul>
              </div>

              <div className="mt-6 border-t pt-4">
                <h3 className="text-lg font-semibold">🎁 Benefícios</h3>
                <ul className="list-disc pl-5 text-gray-600">
                  {Array.isArray(vagaSelecionada.beneficios) && vagaSelecionada.beneficios.length > 0 ? (
                    vagaSelecionada.beneficios.map((beneficio, index) => (
                      <li key={index}>{beneficio}</li>
                    ))
                  ) : (
                    <p className="text-gray-500">Nenhum benefício informado.</p>
                  )}
                </ul>
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

      {/* Modal de Candidatura */}
      {modalAberto && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold">Candidatar-se à vaga</h2>
            <p className="text-gray-700 mt-2">{vagaSelecionada?.titulo}</p>
            {vagaMap.part1.map((input, index) => (
              <input 
              key={index}
              type={input.type}
              name={input.name}
              placeholder={input.placeholder}
              value={formData[input.name]}
              onChange={handleChange}
              className="w-full mt-4 p-2 border rounded lg"
              />
            ))}

            <h3 className="text-lg font-semibold mt-4">Endereço</h3>
            {vagaMap.part2.map((input, index) => (
              <input  
              key={index}
              type={input.type}
              name={input.name}
              placeholder={input.placeholder}
              value={formData.endereco[input.name]}
              onChange={handleChange}
              className="w-full mt-2 p-2 border rounded-lg"
              />
            ))}

            {/* Input para Upload do Currículo */}
            <h3 className="text-lg font-semibold mt-4">📄 Anexar Currículo (PDF)</h3>
            <input
              type="file"
              accept="application/pdf"
              onChange={(e) => {
                if (e.target.files.length > 0) {
                  setFormData((prev) => ({
                    ...prev,
                    curriculo: e.target.files[0], // Pegando o primeiro arquivo
                  }));
                }
              }}
              className="w-full mt-2 p-2 border rounded-lg"
            />

            <div className="flex justify-end mt-4">
              <button className="px-4 py-2 bg-gray-400 hover:bg-gray-500 text-white rounded-lg mr-2 cursor-pointer" onClick={() => setModalAberto(false)}>Cancelar</button>
              <button className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg cursor-pointer" onClick={handleSubmit}>Enviar</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}