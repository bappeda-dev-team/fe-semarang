'use client'

import { ButtonRed, ButtonGreen } from "@/components/global/Button";
import { useEffect, useState } from "react";
import { LoadingClip } from "@/components/global/Loading";
import { AlertNotification, AlertQuestion } from "@/components/global/Alert";
import { getOpdTahun } from "@/components/lib/Cookie";
import { TahunNull } from "@/components/global/OpdTahunNull";
import { getToken, getUser } from "@/components/lib/Cookie";

interface tujuan {
    id_tujuan_opd: string;
    nama_opd: string;
    kode_opd: string;
    tujuan: string;
    rumus_perhitungan: string;
    sumber_data: string;
    tahun_awal: string;
    tahun_akhir: string;
    indikator: indikator[];
}
interface indikator {
    id_indikator: string;
    nama_indikator: string;
    targets: target[];
}
type target = {
    id_target: string;
    target: string;
    satuan: string;
};

const Table = () => {

    const [Tujuan, setTujuan] = useState<tujuan[]>([]);
    const [Loading, setLoading] = useState<boolean | null>(null);
    const [Error, setError] = useState<boolean | null>(null);
    const [DataNull, setDataNull] = useState<boolean | null>(null);
    const [Tahun, setTahun] = useState<any>(null);
    const [User, setUser] = useState<any>(null);
    const [SelectedOpd, setSelectedOpd] = useState<any>(null);
    const token = getToken();
    
    useEffect(() => {
        const data = getOpdTahun();
        const fetchUser = getUser();
        if (fetchUser) {
            setUser(fetchUser.user);
        }
        if(data.tahun){
            const tahun = {
                value: data.tahun.value,
                label: data.tahun.label,
            }
            setTahun(tahun);
        }
        if(data.opd){
            const opd = {
                value: data.opd.value,
                label: data.opd.label,
            }
            setSelectedOpd(opd);
        }
    },[]);
    
    useEffect(() => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        const fetchTujuan = async() => {
            setLoading(true)
            try{
                const url = User?.roles == 'super_admin' ? `tujuan_opd/findall/${SelectedOpd?.value}/${Tahun?.value}` : `tujuan_opd/findall/${User?.kode_opd}/${Tahun?.value}`;
                const response = await fetch(`${API_URL}/${url}`, {
                    headers: {
                      Authorization: `${token}`,
                      'Content-Type': 'application/json',
                    },
                });
                const result = await response.json();
                const data = result.data;
                if(data == null){
                    setDataNull(true);
                    setTujuan([]);
                } else if(result.code == 500){
                    setError(true);
                    console.log("error 500");
                    setTujuan([]);
                } else {
                    setDataNull(false);
                    setTujuan(data);
                }
            } catch(err){
                setError(true);
                console.error(err)
            } finally{
                setLoading(false);
            }
        }
        if(User?.roles !== undefined){
            fetchTujuan();
        }
    }, [token, User, Tahun, SelectedOpd]);

    const hapusTujuan = async(id: any) => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        try{
            const response = await fetch(`${API_URL}/tujuan_opd/delete/${id}`, {
                method: "DELETE",
                headers: {
                  Authorization: `${token}`,
                  'Content-Type': 'application/json',
                },
            })
            if(!response.ok){
                alert("cant fetch data")
            }
            setTujuan(Tujuan.filter((data) => (data.id_tujuan_opd !== id)))
            AlertNotification("Berhasil", "Data Tujuan OPD Berhasil Dihapus", "success", 1000);
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
    } else if(Tahun?.value == undefined){
        return <TahunNull />
    }

    return(
        <>
            <div className="overflow-auto m-2 rounded-t-xl border">
                <table className="w-full">
                    <thead>
                        <tr className="bg-[#99CEF5] text-white">
                            <th className="border-r border-b px-6 py-3 min-w-[50px] text-center">No</th>
                            <th className="border-r border-b px-6 py-3 min-w-[100px]">Aksi</th>
                            <th className="border-r border-b px-6 py-3 min-w-[200px]">Tujuan OPD</th>
                            <th className="border-r border-b px-6 py-3 min-w-[200px]">Rumus Perhitungan</th>
                            <th className="border-r border-b px-6 py-3 min-w-[200px]">Sumber Data</th>
                            <th className="border-l border-b px-6 py-3 min-w-[200px]">Indikator</th>
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
                        Tujuan.map((data, index) => (
                        <tr key={data.id_tujuan_opd}>
                            <td className="border-r border-b px-6 py-4 text-center">{index + 1}</td>
                            <td className="border-r border-b px-6 py-4">
                                <div className="flex flex-col jutify-center items-center gap-2">
                                    <ButtonGreen className="w-full" halaman_url={`/tujuanopd/${data.id_tujuan_opd}`}>Edit</ButtonGreen>
                                    <ButtonRed 
                                        className="w-full"
                                        onClick={() => {
                                            AlertQuestion("Hapus?", "Hapus Tujuan OPD yang dipilih?", "question", "Hapus", "Batal").then((result) => {
                                                if(result.isConfirmed){
                                                    hapusTujuan(data.id_tujuan_opd);
                                                }
                                            });
                                        }}
                                    >
                                        Hapus
                                    </ButtonRed>
                                </div>
                            </td>
                            <td className="border-r border-b px-6 py-4 text-center">{data.tujuan ? data.tujuan : "-"}</td>
                            <td className="border-r border-b px-6 py-4 text-center">{data.rumus_perhitungan ? data.rumus_perhitungan : "-"}</td>
                            <td className="border-r border-b px-6 py-4 text-center">{data.sumber_data ? data.sumber_data : "-"}</td>
                            {data.indikator ? 
                                <td className="border-r border-b px-6 py-4 text-center">
                                    {data.indikator.map((item: any) => (
                                        <p key={item.id_indikator}>{item.nama_indikator}</p>
                                    ))}
                                </td>
                            :
                                <td className="border-r border-b px-6 py-4 text-center">
                                   -
                                </td>
                            }
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
