import { useState } from "react";
import axios from "axios";


export default function ChatBot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;
    
    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    try {
      const response = await axios.post(
        "https://api-inference.huggingface.co/models/facebook/blenderbot-400M-distill",
        { inputs: input },
        {
          headers: {
            "Authorization": `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`,
            "Content-Type": "application/json",
          },
        }
      );
      
      const botMessage = { sender: "bot", text: response.data.generated_text || "Desculpe, não entendi." };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Erro ao chamar a IA", error);
    }

    setIsTyping(false);
  };

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      <header className="bg-orange-500 text-white p-4 text-center text-lg font-bold">
        Chat com a IA
      </header>

      <div className="flex-1 w-1/2 max-lg:w-lg max-md:w-md max-sm:w-sm transition-all mx-auto shadow-2xl my-6 p-4 space-y-2">

        <h1 className="`max-w-xs p-3 rounded-lg bg-white ">a</h1>
        {/* Exibindo as mensagens */}
        {messages.map((msg, index) => (
            
          <div key={index} className={`max-w-xs p-3 rounded-lg overflow-auto ${msg.sender === "user" ? "bg-orange-400 text-white ml-auto" : "bg-white text-black"}`}>
            {msg.text}
          </div>
          
          
        ))}
        {isTyping && <div className="text-gray-500 text-sm">A IA está digitando...</div>}
      </div>

      <div className="w-1/2 max-lg:w-lg max-md:w-md max-sm:w-sm transition-all p-4 mx-auto rounded-2xl bg-white flex items-center shadow-2xl">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Digite sua mensagem..."
          className="flex-1 p-2 border rounded-lg overflow-auto text-wrap"
        />
        <button onClick={sendMessage} className="ml-2 bg-orange-500 text-white px-4 py-2 rounded-lg">
          Enviar
        </button>
      </div>
    </div>
  );
}
