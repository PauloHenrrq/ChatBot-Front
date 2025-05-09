import { useNavigate } from "react-router-dom";
import HeaderCandidato from "../../Layout/HeaderCandidato";
import Gif from "../../assets/transferir.gif"

export default function NotFound() {

    const navigate = useNavigate()

    return (
        <>
            <HeaderCandidato />
            <div className="space-y-15">
                <div className="text-center mt-20">
                    <h1 className="text-4xl font-bold text-red-600">404</h1>
                    <p className="text-lg mt-2">Página não encontrada!!</p>
                </div>
                <div className="w-full flex items-center justify-center gap-6">
                    <div>
                        <img src={Gif} alt="Volte agora" className="rounded-xl" />
                    </div>
                    <div className="h-full">
                        <div className="mb-32 max-sm:mb-30">
                            <button onClick={() => navigate("/home")} className="bg-orange-600 text-white rounded-lg px-8 cursor-pointer hover:bg-orange-500 py-2">Voltar</button>
                        </div>

                    </div>
                </div>

            </div>

        </>
    )
}