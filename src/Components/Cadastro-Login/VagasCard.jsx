import { useEffect, useState } from "react";
import { api } from '../../Routes/api';
import { Form, Formik, Field } from "formik";
import * as Yup from 'yup';
import { Textarea } from "@headlessui/react";

export default function VagasCard() {
    const [modalAberto, setModalAberto] = useState(null);
    const [etapa, setEtapa] = useState(1);
    const [vagas, setVagas] = useState([]);

    useEffect(() => {
        api.get('/vagas')
            .then(response => setVagas(response.data))
            .catch(err => console.error("Erro ao buscar vagas:", err));
    }, []);

    async function delVagas(id) {
        try {
            await api.delete(`/vagas/${id}`);
            alert('Vaga excluída com sucesso!');
            setVagas(prevVagas => prevVagas.filter(vaga => vaga.id !== id));
        } catch (error) {
            console.error('Erro ao excluir vaga', error);
        }
    }

    async function salvarDados(values) {
        if (!modalAberto || isNaN(Number(modalAberto))) {
            alert("Erro: ID da vaga não encontrado.");
            return;
        }

        const idVaga = String(modalAberto); // Garante que o ID é string para compatibilidade com JSON Server

        try {
            const vagaExistente = vagas.find(vaga => String(vaga.id) === idVaga);
            const dadosFormatados = {
                ...vagaExistente, // Mantém os dados antigos
                ...values, // Atualiza os novos valores
                requisitos: values.requisitos ? values.requisitos.split('\n').filter(Boolean) : [],
                responsabilidades: values.responsabilidades ? values.responsabilidades.split('\n').filter(Boolean) : [],
                beneficios: values.beneficios ? values.beneficios.split('\n').filter(Boolean) : [],
            };

            console.log(`Enviando atualização para a vaga ID ${idVaga}:`, dadosFormatados);

            await api.put(`/vagas/${idVaga}`, dadosFormatados);

            alert("Vaga Atualizada com Sucesso.");

            setVagas(prevVagas =>
                prevVagas.map(vaga =>
                    String(vaga.id) === idVaga ? { ...vaga, ...dadosFormatados } : vaga
                )
            );

            setTimeout(() => setModalAberto(null), 100);
            setEtapa(1);
        } catch (error) {
            console.error("Erro ao salvar dados", error);
            alert("Erro ao salvar dados. Tente novamente.");
        }
    }


    const validationSchema = Yup.object().shape({
        titulo: Yup.string().required('Campo Obrigatório'),
        empresa: Yup.string().required('Campo Obrigatório'),
        localizacao: Yup.string().required('Campo Obrigatório'),
        descricao: Yup.string().required('Campo Obrigatório'),
        salario: Yup.string().required('Campo Obrigatório'),
        informacoes_adicionais: Yup.string().required('Campo Obrigatório'),
        requisitos: Yup.string().required('Campo Obrigatório'),
        responsabilidades: Yup.string().required('Campo Obrigatório'),
        beneficios: Yup.string().required('Campo Obrigatório')
    });

    return (
        <div className="h-full grid grid-cols-3 max-lg:grid-cols-2 max-sm:grid-cols-1 mx-auto gap-5">
            {vagas.map((vaga) => (
                <div className="bg-gradient-to-b from-orange-200 to-white shadow-md rounded-lg p-4 w-full max-w-md flex flex-col justify-between mx-auto" key={vaga.id}>
                    <div className="flex flex-col items-start h-fit">
                        <h3 className="text-xl font-semibold">{vaga.titulo}</h3>
                        <h1 className="text-gray-600">{vaga.empresa}</h1>
                    </div>
                    <p className="text-gray-500 mt-2">{vaga.descricao}</p>

                    <div className="flex items-center justify-center h-fit mt-8">
                        <p className="text-gray-600 w-1/2">{vaga.salario}</p>
                        <button
                            className="w-1/2 py-1 bg-orange-500 hover:bg-orange-400 text-white rounded cursor-pointer"
                            onClick={() => setModalAberto(vaga.id)}
                        >
                            Editar
                        </button>
                    </div>

                    {modalAberto === vaga.id && (
                        <div className="fixed inset-0 flex items-center justify-center bg-black/40 p-4 overflow-auto">
                            <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-5xl w-full flex flex-col justify-center relative">
                                <button className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded" onClick={() => setModalAberto(null)}>X</button>
                                <Formik
                                    enableReinitialize
                                    initialValues={{
                                        titulo: vaga.titulo,
                                        empresa: vaga.empresa,
                                        localizacao: vaga.localizacao,
                                        descricao: vaga.descricao,
                                        salario: vaga.salario,
                                        informacoes_adicionais: vaga.informacoes_adicionais,
                                        requisitos: Array.isArray(vaga.requisitos) ? vaga.requisitos.join('\n') : '',
                                        responsabilidades: Array.isArray(vaga.responsabilidades) ? vaga.responsabilidades.join('\n') : '',
                                        beneficios: Array.isArray(vaga.beneficios) ? vaga.beneficios.join('\n') : ''
                                    }}
                                    validationSchema={validationSchema}
                                    onSubmit={salvarDados}
                                >

                                    <Form className="space-y-6">
                                        {etapa === 1 ? (
                                            <>
                                                <label htmlFor="titulo">Cargo</label>
                                                <Field type="text" name="titulo" className="w-full p-3 border border-gray-300 rounded-md shadow-sm" />
                                                <label htmlFor="empresa">Nome Empresarial</label>
                                                <Field type="text" name="empresa" className="w-full p-3 border border-gray-300 rounded-md shadow-sm" />
                                                <label htmlFor="localizacao">Localização</label>
                                                <Field type="text" name="localizacao" className="w-full p-3 border border-gray-300 rounded-md shadow-sm" />
                                                <label htmlFor="descricao">Descrição</label>
                                                <Field as="textarea" name="descricao" className="w-full h-40 resize-none p-3 border border-gray-300 rounded-md shadow-sm" />
                                                <button type="button" onClick={() => setEtapa(2)} className="bg-gray-600 hover:bg-gray-500 text-white px-6 py-2 rounded-md w-full cursor-pointer">Próximo</button>
                                            </>
                                        ) : (
                                            <>
                                                <label htmlFor="requisitos">Requisitos</label>
                                                <Field as="textarea" name="requisitos" className="w-full h-40 resize-none p-3 border border-gray-300 rounded-md shadow-sm" />
                                                <label htmlFor="responsabilidades">Responsabilidades</label>
                                                <Field as="textarea" name="responsabilidades" className="w-full h-40 resize-none p-3 border border-gray-300 rounded-md shadow-sm" />
                                                <label htmlFor="beneficios">Benefícios</label>
                                                <Field as="textarea" name="beneficios" className="w-full h-40 resize-none p-3 border border-gray-300 rounded-md shadow-sm" />
                                                <div className="flex gap-3">
                                                    <button type="button" onClick={() => setEtapa(1)} className="bg-gray-600 hover:bg-gray-500 text-white px-6 py-2 rounded-md w-1/2 cursor-pointer">Voltar</button>
                                                    <button type="submit" className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-md w-1/2 cursor-pointer">Salvar</button>
                                                </div>
                                            </>
                                        )}
                                    </Form>

                                </Formik>
                                <button className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-md w-full mt-4 cursor-pointer" onClick={() => delVagas(vaga.id)}>Deletar</button>
                            </div>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}
