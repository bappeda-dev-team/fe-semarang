'use client'

import { ButtonSky } from "@/components/global/Button";
import Select from 'react-select';
import { useState, useEffect } from "react";

interface id {
    id: string;
}
interface pokir {
    id : string;
    jenis : string;
    usulan : string;
    alamat : string;
    permasalahan : string;
}

const Pokir: React.FC<id> = (id) => {

    const [pokir, setPokir] = useState<pokir[]>([]);
    const [loading, setLoading] = useState<boolean | null>(null);
    const [dataNull, setDataNull] = useState<boolean | null>(null);

    useEffect(() => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        const fetchMusrebang = async() => {
            setLoading(true);
            try{
                const response = await fetch(`${API_URL}/rencana_kinerja/id_rencana_kinerja/pegawai/${id}/input_rincian_kak`);
                const result = await response.json();
                const data = result.usulan_terpilih_pokir;
                if(data){
                    if(data == null){
                        setDataNull(true);
                        setPokir([]);
                    } else {
                        setDataNull(false);
                        setPokir(data);
                    }
                } else {
                    setDataNull(true);
                    setPokir([]);
                }
            } catch(err) {
                console.log(err)
            } finally {
                setLoading(false);
            }
        };
        fetchMusrebang();
    },[id]);

    return(
        <>
            {/* usulan pokok pikiran DPRD */}
            <div className="mt-3 rounded-t-xl border px-5 py-3">
                <h1>Usulan Pokok Pikiran DPRD</h1>
            </div>
            <div className="rounded-b-xl shadow-lg border-x border-b px-5 py-3">
                <div className="my-2">
                    <Select 
                        styles={{
                            control: (baseStyles) => ({
                                ...baseStyles,
                                borderRadius: '8px',
                                })
                            }}
                            placeholder={"Pilih pokok pikiran DPRD"}
                        />
                </div>
                <ButtonSky className="w-full mt-2">Simpan</ButtonSky>
                {loading ? (
                    <div className="text-blue-500">LOADING...</div>
                ) : (
                    <div className="overflow-auto mt-3 rounded-t-xl border">
                        <table className="w-full">
                            <thead>
                                <tr>
                                    <td className="border-r border-b px-6 py-3 min-w-[50px]">No</td>
                                    <td className="border-r border-b px-6 py-3 min-w-[200px]">Usulan</td>
                                    <td className="border-r border-b px-6 py-3 min-w-[200px]">Alamat</td>
                                    <td className="border-r border-b px-6 py-3 min-w-[400px]">Permasalahan</td>
                                    <td className="border-r border-b px-6 py-3 min-w-[200px]">Aksi</td>
                                </tr>
                            </thead>
                            <tbody>
                                {dataNull ? 
                                    <tr>
                                        <td className="px-6 py-3" colSpan={5}>
                                            Data Kosong / Belum Ditambahkan
                                        </td>
                                    </tr>
                                :
                                    pokir.map((data, index) => (
                                        <tr key={data.id}>
                                            <td className="border-r border-b px-6 py-3 min-w-[50px]">{index + 1}</td>
                                            <td className="border-r border-b px-6 py-3 min-w-[200px]">{data.usulan}</td>
                                            <td className="border-r border-b px-6 py-3 min-w-[200px]">{data.alamat}</td>
                                            <td className="border-r border-b px-6 py-3 min-w-[400px]">{data.permasalahan}</td>
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

export default Pokir;