import { useState } from "react";
import axios from "axios";
import UserLogout from "../Logout/UserLogout";
import { useNavigate } from "react-router-dom";
import { VagaCandidado } from "../Logout/UserLogout";

export default function ChatBot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const navigate = useNavigate()



  const predefinedResponses = {
    "oi": "Olá! Como posso te ajudar?",
    "como você está?": "Estou bem, obrigado por perguntar! E você?",
    "onde vejo as vagas?": <VagaCandidado />,
    "qual seu nome?": "Sou um chatbot em desenvolvimento! 😊",
    "tchau": "Até mais! Se precisar, estou por aqui.",
    "quem criou você?": "Fui criado por um desenvolvedor talentoso! 😃",
    "quando você foi criado?": "Fui criado em 2022!",
    "como posso me cadastrar?": "Para cadastrar-se como um candidato, basta preencher o formulário de cadastro.",
    "como faço uma entrevista?": "Para fazer uma entrevista, basta responder às perguntas do candidato.",
    "como faço uma vaga?": "Para cadastrar uma vaga, basta preencher o formulário de cadastro.",
    "como faço um currículo?": "Para cadastrar um currículo, basta preencher o formulário de cadastro.",
    "como faço um contato?": "Para entrar em contato comigo, utilize o formulário de contato.",
    "como posso me desconectar?": <UserLogout />,
    "como posso me conectar?": "Para conectar-se comigo, utilize o formulário de contato.",
    "qual é sua função?": "Minha função é te ajudar a encontrar informações e responder perguntas!",
    "como funciona um chatbot?": "Um chatbot usa inteligência artificial para interpretar mensagens e responder de forma apropriada.",
    "qual a capital do Brasil?": "A capital do Brasil é Brasília.",
    "qual o maior planeta do sistema solar?": "O maior planeta do sistema solar é Júpiter.",
    "quem foi Albert Einstein?": "Albert Einstein foi um físico teórico que desenvolveu a teoria da relatividade.",
    "qual é a velocidade da luz?": "A velocidade da luz no vácuo é de aproximadamente 299.792.458 metros por segundo.",
    "me conta uma piada": "Claro! Por que o livro de matemática estava triste? Porque tinha muitos problemas! 😂",
    "qual é o significado da vida?": "Essa é uma pergunta profunda! Muitos dizem que o significado da vida é encontrar felicidade e propósito.",
    "você gosta de música?": "Eu não posso ouvir música, mas sei que a música é algo maravilhoso para os humanos!",
    "qual o seu filme favorito?": "Eu não assisto filmes, mas ouvi dizer que 'O Poderoso Chefão' é um clássico!",
    "me recomenda um livro": "Claro! '1984' de George Orwell é uma ótima leitura!",
    "o que é inteligência artificial?": "Inteligência artificial é a simulação da inteligência humana por máquinas, como eu!",
    "me fale sobre programação": "Programação é a arte de escrever código para criar software e aplicativos!",
    "quais são as linguagens de programação mais populares?": "Algumas das mais populares são JavaScript, Python, Java e C++.",
    "como aprender a programar?": "Você pode começar com cursos online gratuitos, como os oferecidos pelo FreeCodeCamp ou Codecademy!",
    "qual é o sentido do universo?": "Essa é uma pergunta filosófica! Alguns dizem que é 42. 😉",
    "qual é o seu esporte favorito?": "Eu não pratico esportes, mas futebol é muito popular no Brasil!",
    "quem é o melhor jogador de futebol do mundo?": "Isso é um debate acirrado! Muitos dizem que é Messi, outros dizem que é Cristiano Ronaldo!",
    "qual é a comida mais gostosa?": "Isso depende do gosto de cada um! Mas pizza e hambúrguer são bem populares!",
    "você pode me ajudar a estudar?": "Claro! Posso te dar explicações sobre diversos assuntos!",
    "me conte um fato curioso": "Sabia que os polvos têm três corações? Isso mesmo! 🐙",
    "qual é a altura do Monte Everest?": "O Monte Everest tem 8.848 metros de altura.",
    "como posso melhorar minha produtividade?": "Tente fazer listas de tarefas, evitar distrações e usar a técnica Pomodoro!",
    "me ensine algo novo": "Você sabia que o mel nunca estraga? Foram encontrados potes de mel em tumbas egípcias com milhares de anos e ainda bons para consumo! 🍯",
    "o que você acha da tecnologia?": "A tecnologia tem revolucionado o mundo! Facilita nossas vidas, mas também deve ser usada com responsabilidade.",
    "quem foi Nikola Tesla?": "Nikola Tesla foi um grande inventor e engenheiro elétrico que contribuiu para o desenvolvimento da corrente alternada.",
    "qual é a melhor maneira de aprender inglês?": "Praticar todos os dias, assistir filmes em inglês e conversar com nativos são boas estratégias!",
    "qual o animal mais rápido do mundo?": "O falcão-peregrino é o animal mais rápido do mundo, podendo atingir mais de 320 km/h em mergulho! 🦅",
    "como posso melhorar minha memória?": "Dormir bem, praticar exercícios físicos e fazer desafios mentais podem ajudar!",
    "qual é o maior oceano do mundo?": "O maior oceano do mundo é o Oceano Pacífico.",
    "como funciona a internet?": "A internet funciona por meio de uma rede global de computadores conectados que trocam informações entre si.",
    "qual foi a primeira linguagem de programação?": "A primeira linguagem de programação foi o Assembly, mas a primeira linguagem de alto nível foi o Fortran.",
    "você acredita em vida fora da Terra?": "Ainda não há provas concretas, mas o universo é imenso! Pode ser que sim! 👽",
    "qual é a melhor maneira de economizar dinheiro?": "Fazer um orçamento mensal, evitar gastos desnecessários e investir sabiamente são boas estratégias!",
    "qual é o significado da lei da igualdade?": "Essa é uma lei fundamental que afirma que todos devem ter a mesma oportunidade de vida, escolha e trabalho.",
    "qual é a melhor maneira de se viver em um país pobre?": "Apoiar as pessoas vulneráveis, promover educação e saúde, e trabalhar com a comunidade para encontrar soluções.",
    "qual é o significado da lei do progresso?": "Essa é uma lei fundamental que afirma que todos devem ter a oportunidade de se tornar melhores e mais ricos.",
    "qual é o significado da lei do respeito ao meio ambiente?": "Essa é uma lei fundamental que afirma que todos devem ter a oportunidade de preservar o meio ambiente.",
    "qual é a melhor maneira de se viver em um país feliz?": "Fazer amizades, apoiar as pessoas vulneráveis, promover educação e saúde, e trabalhar com a comunidade para encontrar soluções.",

  };

  const predefinedMessages = Object.keys(predefinedResponses);

  const sendMessage = (message) => {
    if (!message.trim()) return;

    const userMessage = { sender: "user", text: message };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const botResponse = predefinedResponses[message.toLowerCase()] || "Desculpe, não entendi.";
      const botMessage = { sender: "bot", text: botResponse };
      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000);
  };

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      <header className="bg-orange-500 fixed w-full top-0 text-white p-4 text-center text-lg font-bold">
        Chat com a IA
        <div className="fixed right-3 top-3">
          <UserLogout />
        </div>
      </header>




      <div className="flex max-md:flex-col h-full">
        <div className="w-full h-1/2 mb-27">
          <div className="flex-1 w-1/2 h-full m-auto max-lg:w-lg max-md:w-md max-sm:w-sm transition-all mx-auto shadow-2xl my-6 mt-30 p-4 space-y-2 overflow-auto">
            {messages.map((msg, index) => (
              <div key={index} className={`max-w-xs break-words whitespace-normal p-3 rounded-lg overflow-auto ${msg.sender === "user" ? "bg-orange-400 text-white ml-auto" : "bg-white text-black"}`}>
                {msg.text}
              </div>
            ))}
            {isTyping && <div className="text-gray-500 text-sm">A IA está digitando...</div>}
          </div>


          <div>
            <div className="w-1/2 max-lg:w-lg max-md:w-md max-sm:w-sm transition-all p-4 mx-auto rounded-2xl bg-white flex items-center shadow-2xl">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault(); // Evita quebra de linha no input
                    sendMessage(input);
                  }
                }}
                placeholder="Digite sua mensagem..."
                className="flex-1 p-2 border rounded-lg overflow-auto text-wrap"
              />
              <button onClick={() => sendMessage(input)} className="ml-2 bg-orange-500 hover:bg-orange-400 text-white px-4 py-2 rounded-lg cursor-pointer">
                Enviar
              </button>
            </div>
          </div>
        </div>


        {/* Botões de mensagens pré-programadas */}
        <div className="w-full overflow-auto h-[60%] max-md:h-[20%] mt-30 mx-auto max-sm:w-sm transition-all p-4 space-y-2 grid grid-cols-4 max-lg:grid-cols-3 max-md:grid-cols-2 max-sm:grid-cols-1 gap-2">
          {predefinedMessages.map((message, index) => (
            <button
              key={index}
              onClick={() => sendMessage(message)}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg text-center"
            >
              {message}
            </button>
          ))}
        </div>


      </div>







    </div>
  );

}
