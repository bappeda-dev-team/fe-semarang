'use client'

import { ButtonGreen, ButtonRed } from "@/components/global/Button";
import { useState, useEffect } from "react";
import { AlertNotification, AlertQuestion } from "@/components/global/Alert";
import { LoadingClip } from "@/components/global/Loading";

interface subkegiatan {
    id: string;
    nama_sub_kegiatan: string;
    tahun: string;
    indikator_subkegiatan: string;
    target_subkegiatan: string;
    satuan_target_subkegiatan: string;
    kode_opd: string;
}

// interface opd {
//     kode_opd: string;
//     nama_opd: string;
// }

const Table = () => {

    const [SubKegiatan, setSubKegiatan] = useState<subkegiatan[]>([]);
    const [Error, setError] = useState<boolean | null>(null);
    const [Loading, setLoading] = useState<boolean | null>(null);
    const [DataNull, setDataNull] = useState<boolean | null>(null);
    const API_URL = process.env.NEXT_PUBLIC_API_URL;

    useEffect(() => {
        const fetchSubKegiatan = async() => {
            setLoading(true)
            try{
                const response = await fetch(`${API_URL}/sub_kegiatan/findall`);
                const result = await response.json();
                const data = result.sub_kegiatan;
                if(data == null){
                    setDataNull(true);
                    setSubKegiatan([]);
                } else {
                    setDataNull(false);
                    setSubKegiatan(data);
                }
                setSubKegiatan(data);
            } catch(err){
                setError(true);
                console.error(err)
            } finally{
                setLoading(false);
            }
        }
        fetchSubKegiatan();
    }, []);

    const hapusSubKegiatan = async(id: any) => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        try{
            const response = await fetch(`${API_URL}/sub_kegiatan/delete/${id}`, {
                method: "DELETE",
            })
            if(!response.ok){
                alert("cant fetch data")
            }
            setSubKegiatan(SubKegiatan.filter((data) => (data.id !== id)))
            AlertNotification("Berhasil", "Data sub kegiatan Berhasil Dihapus", "success", 1000);
        } catch(err){
            AlertNotification("Gagal", "cek koneksi internet atau database server", "error", 2000);
            console.error(err)
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
                            <th className="border-r border-b px-6 py-3 min-w-[500px]">Nama Sub Kegiatan</th>
                            <th className="border-r border-b px-6 py-3 min-w-[200px]">Tahun</th>
                            <th className="border-r border-b px-6 py-3 min-w-[200px]">Perangkat Daerah</th>
                            <th className="border-r border-b px-6 py-3 min-w-[200px]">Aksi</th>
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
                        SubKegiatan.map((data, index) => (
                        <tr key={data.id}>
                            <td className="border-r border-b px-6 py-4">{index + 1}</td>
                            <td className="border-r border-b px-6 py-4">{data.nama_sub_kegiatan ? data.nama_sub_kegiatan : "-"}</td>
                            <td className="border-r border-b px-6 py-4">{data.tahun ? data.tahun : "-"}</td>
                            <td className="border-r border-b px-6 py-4">{data.kode_opd ? data.kode_opd : "-"}</td>
                            <td className="border-r border-b px-6 py-4">
                                <div className="flex flex-col jutify-center items-center gap-2">
                                    <ButtonGreen className="w-full" halaman_url={`/DataMaster/masterprogramkegiatan/subkegiatan/${data.id}`}>Edit</ButtonGreen>
                                    <ButtonRed 
                                        className="w-full"
                                        onClick={() => {
                                            AlertQuestion("Hapus?", "Hapus sub kegiatan yang dipilih?", "question", "Hapus", "Batal").then((result) => {
                                                if(result.isConfirmed){
                                                    hapusSubKegiatan(data.id);
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