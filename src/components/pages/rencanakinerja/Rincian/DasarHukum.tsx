'use client'

import { ButtonSky, ButtonSkyBorder, ButtonRedBorder } from "@/components/global/Button";
import { ModalDasarHukum } from "../ModalDasarHukum";
import { useState, useEffect } from "react";

interface id {
    id: string;
}
interface dasar_hukum {
    id : string;
    peraturan_terkait : string;
    uraian : string;
}

const DasarHukum: React.FC<id> = (id) => {

    const [isOpenNewDasarHukum, setIsOpenNewDasarHukum] = useState<boolean>(false);
    const [dasarHukum, setDasarHukum] = useState<dasar_hukum[]>([]);
    const [loading, setLoading] = useState<boolean | null>(null);
    const [dataNull, setDataNull] = useState<boolean | null>(null);

    useEffect(() => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        const fetchDasarHukum = async() => {
            setLoading(true);
            try{
                const response = await fetch(`${API_URL}/rencana_kinerja/id_rencana_kinerja/pegawai/${id}/input_rincian_kak`);
                const result = await response.json();
                const data = result.usulan_terpilih_pokir;
                if(data){
                    if(data == null){
                        setDataNull(true);
                        setDasarHukum([]);
                    } else {
                        setDataNull(false);
                        setDasarHukum(data);
                    }
                } else {
                    setDataNull(true);
                    setDasarHukum([]);
                }
            } catch(err) {
                console.log(err)
            } finally {
                setLoading(false);
            }
        };
        fetchDasarHukum();
    },[id]);

    const handleModalNewDasarHukum = () => {
        if(isOpenNewDasarHukum){
            setIsOpenNewDasarHukum(false);
        } else {
            setIsOpenNewDasarHukum(true);
        }
    }

    return(
        <>
            {/* Dasar Hukum */}
            <div className="flex flex-wrap justify-between items-center mt-3 rounded-t-xl border px-5 py-3">
                <h1>Dasar Hukum</h1>
                <ButtonSky onClick={handleModalNewDasarHukum}>Tambah Dasar Hukum</ButtonSky>
                <ModalDasarHukum onClose={handleModalNewDasarHukum} isOpen={isOpenNewDasarHukum}/>
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
                                    <td className="border-r border-b px-6 py-3 min-w-[200px]">Peraturan Terkait</td>
                                    <td className="border-r border-b px-6 py-3 min-w-[200px]">Uraian</td>
                                    <td className="border-r border-b px-6 py-3 min-w-[200px]">Aksi</td>
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
                                    dasarHukum.map((data, index) => (
                                        <tr key={data.id}>
                                            <td className="border px-6 py-3">{index + 1}</td>
                                            <td className="border px-6 py-3">{data.peraturan_terkait}</td>
                                            <td className="border px-6 py-3">{data.uraian}</td>
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

export default DasarHukum;