'use client'

import { ButtonSky } from "@/components/global/Button";
import Select from 'react-select';
import { useState, useEffect } from "react";

interface id {
    id: string;
}
interface subkegiatan {
    id : string;
    nama_sub_kegiatan : string;
    indikator : string;
    pagu_ranwal : string;
    pagu_rankir : string;
    pagu_penetapan : string;
}

const SubKegiatan: React.FC<id> = (id) => {

    const [subKegiatan, setSubKegiatan] = useState<subkegiatan[]>([]);
    const [loading, setLoading] = useState<boolean | null>(null);
    const [dataNull, setDataNull] = useState<boolean | null>(null);
    const API_URL = process.env.NEXT_PUBLIC_API_URL;

    useEffect(() => {
        const fetchMandatori = async() => {
            setLoading(true);
            try{
                const response = await fetch(`${API_URL}/rencana_kinerja/id_rencana_kinerja/pegawai/${id}/input_rincian_kak`);
                const result = await response.json();
                const data = result.usulan_terpilih_pokir;
                if(data){
                    if(data == null){
                        setDataNull(true);
                        setSubKegiatan([]);
                    } else {
                        setDataNull(false);
                        setSubKegiatan(data);
                    }
                } else {
                    setDataNull(true);
                    setSubKegiatan([]);
                }
            } catch(err) {
                console.log(err)
            } finally {
                setLoading(false);
            }
        };
        fetchMandatori();
    },[id]);

    return(
        <>
            {/* usulan subkegiatan */}
            <div className="mt-3 rounded-t-xl border px-5 py-3">
                <h1>Usulan Sub Kegiatan</h1>
            </div>
            <div className="rounded-b-xl shadow-lg border-x border-b px-5 py-3">
                <div className="my-2">
                    <label>Sub Kegiatan Terpilih :</label>
                    <Select 
                        styles={{
                            control: (baseStyles) => ({
                                ...baseStyles,
                                borderRadius: '8px',
                                marginTop: '4px'
                                })
                            }}
                            placeholder={"Pilih sub kegiatan"}
                        />
                </div>
                <ButtonSky className="w-full mt-2">Simpan</ButtonSky>
                {loading ? (
                    <div className="text-blue-500">LOADING...</div>
                ):(
                    <div className="overflow-auto mt-3 rounded-t-xl border">
                        <table className="w-full">
                            <thead>
                                <tr>
                                    <td className="border-r border-b px-6 py-3 min-w-[200px]">Sub Kegiatan</td>
                                    <td className="border-r border-b px-6 py-3 min-w-[200px]">Indikator</td>
                                    <td className="border-r border-b px-6 py-3 min-w-[200px]">Pagu Ranwal 2024</td>
                                    <td className="border-r border-b px-6 py-3 min-w-[200px]">Pagu Rankir 2024</td>
                                    <td className="border-r border-b px-6 py-3 min-w-[200px]">Pagu Penetapan 2024</td>
                                    <td className="border-r border-b px-6 py-3 min-w-[200px]">Aksi</td>
                                </tr>
                            </thead>
                            <tbody>
                                {dataNull ? 
                                    <tr>
                                        <td className="px-6 py-3" colSpan={6}>
                                            Data Kosong / Belum Ditambahkan
                                        </td>
                                    </tr>
                                :
                                    subKegiatan.map((data: any) => (
                                        <tr key={data.id}>
                                            <td className="border-r border-b px-6 py-3 min-w-[200px]">{data.nama_sub_kegiatan}</td>
                                            <td className="border-r border-b px-6 py-3 min-w-[200px]">{data.indikator}</td>
                                            <td className="border-r border-b px-6 py-3 min-w-[200px]">{data.pagu_ranwal}</td>
                                            <td className="border-r border-b px-6 py-3 min-w-[200px]">{data.pagu_rankir}</td>
                                            <td className="border-r border-b px-6 py-3 min-w-[200px]">{data.pagu_penetapan}</td>
                                            <td className="border-r border-b px-6 py-3 min-w-[200px]">Aksi</td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </>
    )
}

export default SubKegiatan;