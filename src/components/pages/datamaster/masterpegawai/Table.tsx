'use client'

import { ButtonGreen, ButtonRed } from "@/components/global/Button";
import { useState, useEffect } from "react";
import { LoadingClip } from "@/components/global/Loading";
import { AlertNotification, AlertQuestion } from "@/components/global/Alert";

interface pegawai {
    id : string;
    nama_pegawai : string;
    nip : string;
    kode_opd: string;
    roles : string;
}

const Table = () => {

    const [Pegawai, setPegawai] = useState<pegawai[]>([]);
    const [Error, setError] = useState<boolean | null>(null);
    const [Loading, setLoading] = useState<boolean | null>(null);
    const [DataNull, setDataNull] = useState<boolean | null>(null);
    const API_URL = process.env.NEXT_PUBLIC_API_URL;

    useEffect(() => {
        const fetchPegawai = async() => {
            setLoading(true)
            try{
                const response = await fetch(`${API_URL}/pegawai/findall`);
                const result = await response.json();
                const data = result.data;
                if(data.length == 0){
                    setDataNull(true);
                    setPegawai([]);
                } else {
                    setDataNull(false);
                    setPegawai(data);
                }
                setPegawai(data);
            } catch(err){
                setError(true);
                console.error(err)
            } finally{
                setLoading(false);
            }
        }
        fetchPegawai();
    }, []);

    const hapusPegawai = async(id: any) => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        try{
            const response = await fetch(`${API_URL}/pegawai/delete/${id}`, {
                method: "DELETE",
            })
            if(!response.ok){
                alert("cant fetch data")
            }
            setPegawai(Pegawai.filter((data) => (data.id !== id)))
            AlertNotification("Berhasil", "Data pegawai Berhasil Dihapus", "success", 1000);
        } catch(err){
            AlertNotification("Gagal", "cek koneksi internet atau database server", "error", 2000);
        }
    };

    if(Loading){
        return (    
            <div className="border p-5 rounded-xl shadow-xl">
                <LoadingClip className="mx-5 py-5"/>
            </div>
        );
    } else if(Error){
        return (
            <div className="border p-5 rounded-xl shadow-xl">
                <h1 className="text-red-500 mx-5 py-5">Periksa koneksi internet atau database server</h1>
            </div>
        )
    }

    return(
        <>
            <div className="overflow-auto m-2 rounded-t-xl border">
                <table className="w-full">
                    <thead>
                        <tr className="bg-[#99CEF5] text-white">
                            <th className="border-r border-b px-6 py-3 min-w-[50px]">No</th>
                            <th className="border-r border-b px-6 py-3 min-w-[200px]">Nama</th>
                            <th className="border-r border-b px-6 py-3 min-w-[200px]">NIP</th>
                            <th className="border-r border-b px-6 py-3 min-w-[200px]">Perangkata Daerah</th>
                            <th className="border-r border-b px-6 py-3 min-w-[200px]">Roles</th>
                            <th className="border-l border-b px-6 py-3 min-w-[200px]">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {DataNull ? 
                            <tr>
                                <td className="px-6 py-3 uppercase" colSpan={13}>
                                    Data Kosong / Belum Ditambahkan
                                </td>
                            </tr>
                        :
                            Pegawai.map((data, index) => (
                                <tr key={data.id}>
                                    <td className="border-r border-b px-6 py-4">{index + 1}</td>
                                    <td className="border-r border-b px-6 py-4">{data.nama_pegawai ? data.nama_pegawai : "-"}</td>
                                    <td className="border-r border-b px-6 py-4">{data.nip ? data.nip : "-"}</td>
                                    <td className="border-r border-b px-6 py-4">{data.kode_opd ? data.kode_opd : "-"}</td>
                                    <td className="border-r border-b px-6 py-4">{data.roles ? data.roles : "-"}</td>
                                    <td className="border-r border-b px-6 py-4">
                                        <div className="flex flex-col jutify-center items-center gap-2">
                                            <ButtonGreen className="w-full" halaman_url={`/DataMaster/masterpegawai/${data.id}`}>Edit</ButtonGreen>
                                            <ButtonRed 
                                                className="w-full"
                                                onClick={() => {
                                                    AlertQuestion("Hapus?", "Hapus Pegawai yang dipilih?", "question", "Hapus", "Batal").then((result) => {
                                                        if(result.isConfirmed){
                                                            hapusPegawai(data.id);
                                                        }
                                                    });
                                                }}
                                            >
                                                Hapus
                                            </ButtonRed>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>
        </>
    )
}

export default Table;