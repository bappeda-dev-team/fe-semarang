'use client'

import { ButtonSkyBorder } from "@/components/global/Button";
import { ModalInovasi } from "../ModalInovasi";
import { useState, useEffect } from "react";

interface id {
    id: string;
}
interface type_inovasi {
    id : string;
    judul_inovasi : string;
    jenis_inovasi : string;
    gambaran_nilia_kebaruan : string;
}

const Inovasi: React.FC<id> = (id) => {

    const [isOpenNewInovasi, setIsOpenNewInovasi] = useState<boolean>(false);
    const [inovasi, setInovasi] = useState<type_inovasi[]>([]);
    const [loading, setLoading] = useState<boolean | null>(null);
    const [dataNull, setDataNull] = useState<boolean | null>(null);
    const API_URL = process.env.NEXT_PUBLIC_API_URL;

    useEffect(() => {
        const fetchInovasi = async() => {
            setLoading(true);
            try{
                const response = await fetch(`${API_URL}/rencana_kinerja/id_rencana_kinerja/pegawai/${id}/input_rincian_kak`);
                const result = await response.json();
                const data = result.usulan_terpilih_pokir;
                if(data){
                    if(data == null){
                        setDataNull(true);
                        setInovasi([]);
                    } else {
                        setDataNull(false);
                        setInovasi(data);
                    }
                } else {
                    setDataNull(true);
                    setInovasi([]);
                }
            } catch(err) {
                console.log(err)
            } finally {
                setLoading(false);
            }
        };
        fetchInovasi();
    },[id]);

    const handleModalNewInovasi = () => {
        if(isOpenNewInovasi){
            setIsOpenNewInovasi(false);
        } else {
            setIsOpenNewInovasi(true);
        }
    }

    return(
        <>
            {/* Inovasi Sasaran */}
            <div className="flex flex-wrap justify-between items-center mt-3 rounded-t-xl border px-5 py-3">
                <h1>Inovasi Sasaran</h1>
            </div>
            {loading ? (
                <div className="text-blue-500">LOADING...</div>
            ):(
                <div className="rounded-b-xl shadow-lg border-x border-b px-5 py-3">
                    <div className="overflow-auto m-2 rounded-t-xl border">
                        <table className="w-full">
                            <thead>
                                <tr>
                                    <td className="border-r border-b px-6 py-3 min-w-[200px]">Judul Inovasi</td>
                                    <td className="border-r border-b px-6 py-3 min-w-[200px]">Jenis Inovasi</td>
                                    <td className="border-r border-b px-6 py-3 min-w-[200px]">Gambaran nilai kebaruan</td>
                                    <td className="border-r border-b px-6 py-3 min-w-[100px]">Aksi</td>
                                </tr>
                            </thead>
                            <tbody className='border'>
                                {dataNull ? 
                                    <tr>
                                        <td className="px-6 py-3" colSpan={4}>
                                            Data Kosong / Belum Ditambahkan
                                        </td>
                                    </tr>
                                :
                                    inovasi.map((data: any) => (
                                    <tr key={data.id}>
                                        <td className="border px-6 py-3">{data.judul_inovasi}</td>
                                        <td className="border px-6 py-3">{data.jenis_inovasi}</td>
                                        <td className="border px-6 py-3">{data.gambaran_nilia_kebaruan}</td>
                                        <td className="border px-6 py-3">
                                            <ButtonSkyBorder className="w-full" onClick={handleModalNewInovasi}>Edit</ButtonSkyBorder>
                                            <ModalInovasi onClose={handleModalNewInovasi} isOpen={isOpenNewInovasi}/>
                                        </td>
                                    </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </>
    )
}

export default Inovasi;