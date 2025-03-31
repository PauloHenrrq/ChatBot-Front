import { useEffect, useState } from "react";
import { api } from '../../Routes/api'

export default function VagasCard() {
    const [modalAberto, setModalAberto] = useState(null);

    const [vagas, setVagas] = useState([]);

    console.log(vagas)

    useEffect(() => {
        api.get('/vagas')
            .then(response => {
                setVagas(response.data)
            }).catch(err => {
                console.error(err)
            })
    }, [])


    return (
        <>
            <div className="h-full grid grid-cols-3 max-lg:grid-cols-3 max-md:grid-cols-2 max-sm:grid-cols-1 justify-center gap-5">


                {vagas.map((vaga) => {
                    return (
                        <>
                            <div className="bg-linear-to-b from-orange-200 to-white shadow-md rounded-lg p-4 w-full max-w-md flex flex-col justify-between" key={vagas.id}>
                                <div className="flex flex-col items-start h-fit">
                                    <h3 className="text-xl font-semibold">{vaga.titulo}</h3>
                                    <h1 className="text-gray-600">{vaga.empresa}</h1>
                                </div>
                                <p className="text-gray-500 mt-2">{vaga.descricao}</p>

                                <div className="flex items-center justify-center h-fit mt-8">
                                    <p className="text-gray-600  w-1/2">{vaga.salario}</p>
                                    <button
                                        className="w-1/2 py-1 bg-orange-500 text-white rounded"
                                        onClick={() => setModalAberto(vaga.id)}
                                    >
                                        Editar
                                    </button>
                                </div>




                                {/* --> Modal de Vagas */}


                                {modalAberto === vaga.id && (
                                    <div className="fixed inset-0 flex items-center justify-center bg-black/50 p-4">
                                        <div className="bg-zinc-100 p-6 rounded shadow-lg max-w-5xl w-full">
                                            <div className="flex w-full items-center gap-8 bg-white rounded-2xl shadow-lg">
                                                <div className="flex flex-col w-1/2 gap-4 m-6">
                                                    <h3 className="text-2xl font-bold">{vaga.titulo}</h3>
                                                    <h1 className=""><span className="font-bold">Empresa Card: </span>{vaga.empresa}</h1>
                                                    <p className="text-gray-600"><span className="font-bold">Local Card: </span>{vaga.localizacao}</p>
                                                    <p className="text-gray-600"><span className="font-bold">Descrição Card: </span>{vaga.descricao}</p>
                                                    <p className="text-gray-600"><span className="font-bold">Descrição Modal: </span>{vaga.descricaodetalhada}</p>
                                                    <p className="mt-2 font-semibold">Salário: {vaga.salario || "A combinar"}</p>

                                                </div>

                                                <form className="w-1/2 m-6">
                                                    <div className="flex gap-2">
                                                        <input type="text" name="titulo" placeholder="Cargo novo" className="w-full p-2 border rounded mb-2" required />
                                                        <input type="text" name="empresa" placeholder="Nome empresarial" className="w-full p-2 border rounded mb-2" required />
                                                    </div>
                                                    <input type="text" name="localizacao" placeholder="Localização" className="w-full p-2 border rounded mb-2" required />
                                                    <textarea name="descricao" placeholder="Descrição simplificada" className="w-full p-2 border rounded mb-2" id=""></textarea>
                                                    <textarea name="descricaodetalhada" placeholder="Descrição detalhada" className="w-full p-2 border rounded mb-2" id=""></textarea>
                                                    <input type="number" name="salario" placeholder="Valor do salario" className="w-full p-2 border rounded mb-2"/>
                                                    <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded w-full">
                                                        Editar Vaga
                                                    </button>
                                                </form>
                                            </div>
                                            
                                            

                                            <button
                                                className="mt-4 bg-red-500 text-white px-4 py-2 rounded w-full"
                                                onClick={() => setModalAberto(null)} // Fecha o modal
                                            >
                                                Fechar
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>



                        </>
                    )
                })}
            </div>
        </>
    )
}