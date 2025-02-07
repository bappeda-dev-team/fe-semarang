'use client'

import { ButtonRed, ButtonGreen } from "@/components/global/Button";
import { useEffect, useState } from "react";
import { LoadingClip } from "@/components/global/Loading";
import { AlertNotification, AlertQuestion } from "@/components/global/Alert";
import { getOpdTahun } from "@/components/lib/Cookie";
import { TahunNull } from "@/components/global/OpdTahunNull";
import { getToken, getUser } from "@/components/lib/Cookie";
import { TbPencil, TbTrash } from "react-icons/tb";

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
    
    // useEffect(() => {
    //     const API_URL = process.env.NEXT_PUBLIC_API_URL;
    //     const fetchTujuan = async() => {
    //         setLoading(true)
    //         try{
    //             const url = User?.roles == 'super_admin' ? `tujuan_opd/findall/${SelectedOpd?.value}/${Tahun?.value}` : `tujuan_opd/findall/${User?.kode_opd}/${Tahun?.value}`;
    //             const response = await fetch(`${API_URL}/${url}`, {
    //                 headers: {
    //                   Authorization: `${token}`,
    //                   'Content-Type': 'application/json',
    //                 },
    //             });
    //             const result = await response.json();
    //             const data = result.data;
    //             if(data.length == 0){
    //                 setDataNull(true);
    //                 setTujuan([]);
    //             } else if(result.code == 500){
    //                 setError(true);
    //                 console.log("error 500");
    //                 setTujuan([]);
    //             } else {
    //                 setDataNull(false);
    //                 setTujuan(data);
    //             }
    //         } catch(err){
    //             setError(true);
    //             console.error(err)
    //         } finally{
    //             setLoading(false);
    //         }
    //     }
    //     if(User?.roles !== undefined){
    //         fetchTujuan();
    //     }
    // }, [token, User, Tahun, SelectedOpd]);

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
                        <tr className="bg-gray-500 text-white">
                            <th rowSpan={2} className="border-r border-b px-6 py-3 min-w-[50px] text-center">No</th>
                            <th rowSpan={2} className="border-r border-b px-6 py-3 min-w-[100px]">Aksi</th>
                            <th rowSpan={2} className="border-r border-b px-6 py-3 min-w-[200px]">Tujuan Pemda</th>
                            <th rowSpan={2} className="border-r border-b px-6 py-3 min-w-[200px]">Indikator</th>
                            <th rowSpan={2} className="border-r border-b px-6 py-3 min-w-[200px]">Rumus Perhitungan</th>
                            <th rowSpan={2} className="border-r border-b px-6 py-3 min-w-[200px]">Sumber Data</th>
                            <th colSpan={2} className="border-l border-b px-6 py-3 min-w-[200px]">2024</th>
                            <th colSpan={2} className="border-l border-b px-6 py-3 min-w-[200px]">2025</th>
                            <th colSpan={2} className="border-l border-b px-6 py-3 min-w-[200px]">2026</th>
                            <th colSpan={2} className="border-l border-b px-6 py-3 min-w-[200px]">2027</th>
                            <th colSpan={2} className="border-l border-b px-6 py-3 min-w-[200px]">2028</th>
                        </tr>
                        <tr className="bg-gray-500 text-white">
                            <th className="border-l border-b px-6 py-3 min-w-[200px]">Target</th>
                            <th className="border-l border-b px-6 py-3 min-w-[200px]">Satuan</th>
                            <th className="border-l border-b px-6 py-3 min-w-[200px]">Target</th>
                            <th className="border-l border-b px-6 py-3 min-w-[200px]">Satuan</th>
                            <th className="border-l border-b px-6 py-3 min-w-[200px]">Target</th>
                            <th className="border-l border-b px-6 py-3 min-w-[200px]">Satuan</th>
                            <th className="border-l border-b px-6 py-3 min-w-[200px]">Target</th>
                            <th className="border-l border-b px-6 py-3 min-w-[200px]">Satuan</th>
                            <th className="border-l border-b px-6 py-3 min-w-[200px]">Target</th>
                            <th className="border-l border-b px-6 py-3 min-w-[200px]">Satuan</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="border-r border-b px-6 py-4 text-center">1</td>
                            <td className="border-r border-b px-6 py-4">
                                <div className="flex flex-col jutify-center items-center gap-2">
                                    <ButtonGreen className="flex items-center gap-1 w-full">
                                        <TbPencil />
                                        Edit
                                    </ButtonGreen>
                                    <ButtonRed className="flex items-center gap-1 w-full">
                                        <TbTrash />
                                        Hapus
                                    </ButtonRed>
                                </div>
                            </td>
                            <td className="border-r border-b px-6 py-4 text-center">Contoh Tujuan</td>
                            <td className="border-r border-b px-6 py-4 text-center">contoh indikator</td>
                            <td className="border-r border-b px-6 py-4 text-center">contoh rumus</td>
                            <td className="border-r border-b px-6 py-4 text-center">Contoh sumber data</td>
                            
                            <td className="border-r border-b px-6 py-4 text-center">Contoh Target 2024</td>
                            <td className="border-r border-b px-6 py-4 text-center">Contoh Satuan 2024</td>
                            <td className="border-r border-b px-6 py-4 text-center">Contoh Target 2025</td>
                            <td className="border-r border-b px-6 py-4 text-center">Contoh Satuan 2025</td>
                            <td className="border-r border-b px-6 py-4 text-center">Contoh Target 2026</td>
                            <td className="border-r border-b px-6 py-4 text-center">Contoh Satuan 2026</td>
                            <td className="border-r border-b px-6 py-4 text-center">Contoh Target 2027</td>
                            <td className="border-r border-b px-6 py-4 text-center">Contoh Satuan 2027</td>
                            <td className="border-r border-b px-6 py-4 text-center">Contoh Target 2028</td>
                            <td className="border-r border-b px-6 py-4 text-center">Contoh Satuan 2028</td>
                            
                        </tr>
                    </tbody>
                </table>
            </div>
        </>
    )
}

export default Table;
