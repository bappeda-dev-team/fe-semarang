'use client'

import { ButtonSky, ButtonSkyBorder, ButtonRedBorder } from "@/components/global/Button";
import { ModalGambaranUmum } from "../ModalGambaranUmum";
import { useState, useEffect } from "react";

interface id {
    id: string;
}
interface gambaran_umum {
    id : string;
    gambaran_umum : string;
}

const GambaranUmum: React.FC<id> = (id) => {

    const [isOpenNewGambaranUmum, setIsOpenNewGambaranUmum] = useState<boolean>(false);
    const [gambaran, setGambaran] = useState<gambaran_umum[]>([]);
    const [loading, setLoading] = useState<boolean | null>(null);
    const [dataNull, setDataNull] = useState<boolean | null>(null);
    const API_URL = process.env.NEXT_PUBLIC_API_URL;

    useEffect(() => {
        const fetchGambaranUmum = async() => {
            setLoading(true);
            try{
                const response = await fetch(`${API_URL}/rencana_kinerja/id_rencana_kinerja/pegawai/${id}/input_rincian_kak`);
                const result = await response.json();
                const data = result.usulan_terpilih_pokir;
                if(data){
                    if(data == null){
                        setDataNull(true);
                        setGambaran([]);
                    } else {
                        setDataNull(false);
                        setGambaran(data);
                    }
                } else {
                    setDataNull(true);
                    setGambaran([]);
                }
            } catch(err) {
                console.log(err)
            } finally {
                setLoading(false);
            }
        };
        fetchGambaranUmum();
    },[id]);

    const handleModalNewGambaranUmum = () => {
        if(isOpenNewGambaranUmum){
            setIsOpenNewGambaranUmum(false);
        } else {
            setIsOpenNewGambaranUmum(true);
        }
    }

    return(
        <>
            {/* gambaran umum */}
            <div className="flex flex-wrap justify-between items-center mt-3 rounded-t-xl border px-5 py-3">
                <h1>Gambaran Umum</h1>
                <ButtonSky onClick={handleModalNewGambaranUmum}>Tambah Gambaran Umum</ButtonSky>
                <ModalGambaranUmum onClose={handleModalNewGambaranUmum} isOpen={isOpenNewGambaranUmum} />
            </div>
            {loading ? (
                <div className="text-blue-500">LOADING...</div>
            ):(
                <div className="rounded-b-xl shadow-lg border-x border-b px-5 py-3">
                    <div className="overflow-auto m-2 rounded-t-xl border">
                        <table className="w-full">
                            <thead>
                                <tr>
                                    <td className="border-r border-b px-6 py-3 min-w-[50px]">No</td>
                                    <td className="border-r border-b px-6 py-3 min-w-[200px]">Gambaran Umum</td>
                                    <td className="border-r border-b px-6 py-3 min-w-[200px]">Aksi</td>
                                </tr>
                            </thead>
                            <tbody className='border'>
                                {dataNull ? 
                                    <tr>
                                        <td className="px-6 py-3" colSpan={3}>
                                            Data Kosong / Belum Ditambahkan
                                        </td>
                                    </tr>
                                :
                                    gambaran.map((data, index) => (
                                        <tr key={data.id}>
                                            <td className="border px-6 py-3">{index + 1}</td>
                                            <td className="border px-6 py-3">{data.gambaran_umum}</td>
                                            <td className="border px-6 py-3">
                                                <div className="flex flex-col justify-center items-center gap-2">
                                                    <ButtonSkyBorder className="w-full">Edit</ButtonSkyBorder>
                                                    <ButtonRedBorder className="w-full">Hapus</ButtonRedBorder>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </>
    )
}

export default GambaranUmum;