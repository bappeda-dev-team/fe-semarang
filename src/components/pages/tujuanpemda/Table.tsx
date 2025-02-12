'use client'

import { ButtonRed, ButtonGreen, ButtonSky } from "@/components/global/Button";
import React, { useEffect, useState } from "react";
import { LoadingClip } from "@/components/global/Loading";
import { AlertNotification, AlertQuestion } from "@/components/global/Alert";
import { getOpdTahun } from "@/components/lib/Cookie";
import { TahunNull } from "@/components/global/OpdTahunNull";
import { getToken, getUser } from "@/components/lib/Cookie";
import { TbPencil, TbTrash, TbCirclePlus } from "react-icons/tb";
import { ModalTujuanPemda } from "./ModalTujuanPemda";

interface Periode {
    tahun_awal: string;
    tahun_akhir: string;
}

interface Target {
    id: string;
    target: string;
    satuan: string;
    tahun: string;
}

interface Indikator {
    id: string;
    indikator: string;
    rumus_perhitungan: string;
    sumber_data: string;
    target: Target[];
}

interface TujuanPemda {
    id: number;
    tujuan_pemda: string;
    tema_id: number;
    nama_tema: string;
    periode: Periode;
    indikator: Indikator[];
}

interface tujuan {
    pokin_id: number;
    nama_tematik: string;
    jenis_pohon: string;
    level_pohon: number;
    keterangan: string;
    tahun_pokin: string;
    tujuan_pemda: TujuanPemda;
}

interface Periode_Header {
    id: number;
    tahun_awal: string;
    tahun_akhir: string;
    tahun_list: string[];
}

const Table = () => {

    const [Tujuan, setTujuan] = useState<tujuan[]>([]);
    const [Periode, setPeriode] = useState<Periode_Header | null>(null);

    const [PeriodeNotFound, setPeriodeNotFound] = useState<boolean | null>(null);
    const [Error, setError] = useState<boolean | null>(null);
    const [DataNull, setDataNull] = useState<boolean | null>(null);

    const [isOpenNewTujuan, setIsOpenNewTujuan] = useState<boolean>(false);
    const [isOpenEditTujuan, setIsOpenEditTujuan] = useState<boolean>(false);
    const [IdTujuan, setIdTujuan] = useState<number>(0);
    const [IdPeriode, setIdPeriode] = useState<number>(0);
    const [IdTema, setIdTema] = useState<number>(0);

    const [Loading, setLoading] = useState<boolean | null>(null);
    const [FetchTrigger, setFetchTrigger] = useState<boolean>(false);
    const [Tahun, setTahun] = useState<any>(null);
    const [User, setUser] = useState<any>(null);
    const token = getToken();

    useEffect(() => {
        const data = getOpdTahun();
        const fetchUser = getUser();
        if (fetchUser) {
            setUser(fetchUser.user);
        }
        if (data.tahun) {
            const tahun = {
                value: data.tahun.value,
                label: data.tahun.label,
            }
            setTahun(tahun);
        }
    }, []);

    useEffect(() => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        const fetchTujuanPemda = async () => {
            setLoading(true)
            try {
                const response = await fetch(`${API_URL}/tujuan_pemda/findall_with_pokin/${Tahun?.value}`, {
                    headers: {
                        Authorization: `${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                const result = await response.json();
                const data = result.data;
                if (data == null) {
                    setDataNull(true);
                    setTujuan([]);
                } else if (result.code == 500) {
                    setPeriodeNotFound(true);
                    setTujuan([]);
                } else {
                    setDataNull(false);
                    setTujuan(data);
                }
            } catch (err) {
                setError(true);
                console.error(err)
            } finally {
                setLoading(false);
            }
        }
        const fetchPeriode = async () => {
            try {
                const response = await fetch(`${API_URL}/periode/tahun/${Tahun?.value}`, {
                    headers: {
                        Authorization: `${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                const result = await response.json();
                const hasil = result.data;
                setPeriode(hasil);
                if(hasil.id){
                    setIdPeriode(hasil.id);
                }
            } catch (err) {
                console.error("error fetch periode", err);
            }
        };
        if (Tahun?.value !== null && Tahun?.value !== undefined) {
            fetchPeriode();
        }
        if (User?.roles !== undefined) {
            fetchTujuanPemda();
        }
    }, [token, User, Tahun, FetchTrigger]);

    const hapusTujuanPemda = async (id: number) => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        // console.log(id);
        try {
            const response = await fetch(`${API_URL}/tujuan_pemda/delete/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `${token}`,
                    'Content-Type': 'application/json',
                },
            })
            if (!response.ok) {
                alert("response !ok saat hapus data tujuan pemda")
            }
            AlertNotification("Berhasil", "Data Tujuan Pemda Berhasil Dihapus", "success", 1000);
            setFetchTrigger((prev) => !prev);
        } catch (err) {
            AlertNotification("Gagal", "cek koneksi internet atau database server", "error", 2000);
            console.error(err);
        }
    };

    const handleModalNewTujuan = (tema: number) => {
        if (isOpenNewTujuan) {
            setIsOpenNewTujuan(false);
            setIdTema(0);
        } else {
            setIsOpenNewTujuan(true);
            setIdTema(tema);
        }
    }
    const handleModalEditTujuan = (id: number, tema: number) => {
        if (isOpenEditTujuan) {
            setIsOpenEditTujuan(false);
            setIdTujuan(0);
            setIdTema(0);
        } else {
            setIsOpenEditTujuan(true);
            setIdTujuan(id);
            setIdTema(tema);
        }
    }

    if (Loading) {
        return (
            <div className="border p-5 rounded-xl shadow-xl">
                <LoadingClip className="mx-5 py-5" />
            </div>
        );
    } else if (Error) {
        return (
            <div className="border p-5 rounded-xl shadow-xl">
                <h1 className="text-red-500 font-bold mx-5 py-5">Periksa koneksi internet atau database server</h1>
            </div>
        )
    } else if (PeriodeNotFound) {
        return (
            <div className="border p-5 rounded-xl shadow-xl">
                <h1 className="text-yellow-600 font-bold mx-5 py-5">Tahun {Tahun?.value} tidak tersedia di data periode / periode dengan tahun {Tahun?.value} belum di buat</h1>
            </div>
        )
    } else if (Tahun?.value == undefined) {
        return <TahunNull />
    }

    return (
        <>
            <div className="overflow-auto m-2 rounded-t-xl border">
                <table className="w-full">
                    <thead>
                        <tr className="bg-emerald-500 text-white">
                            <th rowSpan={2} className="border-r border-b px-6 py-3 min-w-[50px] text-center">No</th>
                            <th rowSpan={2} className="border-r border-b px-6 py-3 min-w-[100px]">Aksi</th>
                            <th rowSpan={2} className="border-r border-b px-6 py-3 min-w-[300px]">Tema</th>
                            <th rowSpan={2} className="border-r border-b px-6 py-3 min-w-[300px]">Tujuan Pemda</th>
                            <th rowSpan={2} className="border-r border-b px-6 py-3 min-w-[200px]">Indikator</th>
                            <th rowSpan={2} className="border-r border-b px-6 py-3 min-w-[200px]">Rumus Perhitungan</th>
                            <th rowSpan={2} className="border-r border-b px-6 py-3 min-w-[200px]">Sumber Data</th>
                            {Periode?.tahun_list.map((item: any) => (
                                <th key={item} colSpan={2} className="border-l border-b px-6 py-3 min-w-[100px]">{item}</th>
                            ))}
                        </tr>
                        <tr className="bg-emerald-500 text-white">
                            {Periode?.tahun_list.map((item: any) => (
                                <React.Fragment key={item}>
                                    <th className="border-l border-b px-6 py-3 min-w-[50px]">Target</th>
                                    <th className="border-l border-b px-6 py-3 min-w-[50px]">Satuan</th>
                                </React.Fragment>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {DataNull ?
                            <tr>
                                <td className="px-6 py-3" colSpan={30}>
                                    Data Kosong / Belum Ditambahkan
                                </td>
                            </tr>
                            :
                            Tujuan.map((item: tujuan, index: number) => {
                                // Cek apakah item.tujuan_pemda ada
                                const hasTujuanPemda = !!item.tujuan_pemda;
                                const indikatorLength = hasTujuanPemda ? item.tujuan_pemda.indikator.length : 0;

                                return (
                                    <React.Fragment key={item.tujuan_pemda?.id || index}>
                                        {/* Baris Utama */}
                                        <tr>
                                            <td className="border-x border-b border-emerald-500 px-6 py-4 text-center" rowSpan={indikatorLength + 1}>
                                                {index + 1}
                                            </td>
                                            <td className="border-r border-b border-emerald-500 px-6 py-4" rowSpan={indikatorLength + 1}>
                                                <div className="flex flex-col justify-center items-center gap-2">
                                                    {hasTujuanPemda ?
                                                        <>
                                                            <ButtonGreen 
                                                                className="flex items-center gap-1 w-full"
                                                                onClick={() => handleModalEditTujuan(item.tujuan_pemda.id, item.pokin_id)}
                                                            >
                                                                <TbPencil />
                                                                Edit
                                                            </ButtonGreen>
                                                            <ButtonRed
                                                                className="flex items-center gap-1 w-full"
                                                                onClick={() => {
                                                                    AlertQuestion("Hapus?", "Hapus Tujuan Pemda yang dipilih?", "question", "Hapus", "Batal").then((result) => {
                                                                        if (result.isConfirmed) {
                                                                            hapusTujuanPemda(item.tujuan_pemda?.id);
                                                                        }
                                                                    });
                                                                }}
                                                            >
                                                                <TbTrash />
                                                                Hapus
                                                            </ButtonRed>
                                                        </>
                                                        :
                                                        <ButtonSky
                                                            className="flex items-center gap-1 w-full"
                                                            onClick={() => handleModalNewTujuan(item.pokin_id)}
                                                        >
                                                            <TbCirclePlus />
                                                            Tambah
                                                        </ButtonSky>
                                                    }
                                                </div>
                                            </td>
                                            <td className="border-r border-b border-emerald-500 px-6 py-4" rowSpan={indikatorLength + 1}>
                                                {item.nama_tematik || "-"}
                                            </td>
                                            {hasTujuanPemda ?
                                                <td className="border-r border-b border-emerald-500 px-6 py-4" rowSpan={indikatorLength + 1}>
                                                    {item.tujuan_pemda.tujuan_pemda || "-"}
                                                </td>
                                                :
                                                <td className="border-r border-b border-emerald-500 px-6 py-4 bg-red-500 text-center text-white" colSpan={30}>
                                                    Tujuan Pemda belum di buat
                                                </td>
                                            }
                                        </tr>

                                        {/* Baris Indikator (hanya jika item.tujuan_pemda ada) */}
                                        {hasTujuanPemda &&
                                            item.tujuan_pemda.indikator.map((i: Indikator, indikatorIndex: number) => (
                                                <tr key={i.id || indikatorIndex}>
                                                    <td className="border-r border-b border-emerald-500 px-6 py-4">{i.indikator || "-"}</td>
                                                    <td className="border-r border-b border-emerald-500 px-6 py-4">{i.rumus_perhitungan || "-"}</td>
                                                    <td className="border-r border-b border-emerald-500 px-6 py-4">{i.sumber_data || "-"}</td>
                                                    {i?.target.map((t: Target) => (
                                                        <React.Fragment key={t.id}>
                                                            <td className="border-r border-b border-emerald-500 px-6 py-4 text-center">{t.target || "-"}</td>
                                                            <td className="border-r border-b border-emerald-500 px-6 py-4 text-center">{t.satuan || "-"}</td>
                                                        </React.Fragment>
                                                    ))}
                                                </tr>
                                            ))}
                                    </React.Fragment>
                                );
                            })
                        }
                    </tbody>
                </table>
                {/* MODAL EDIT TUJUAN */}
                <ModalTujuanPemda
                    metode="baru"
                    tema_id={IdTema}
                    tahun={Tahun?.value}
                    periode={IdPeriode}
                    isOpen={isOpenNewTujuan} 
                    onClose={() => handleModalNewTujuan(0)} 
                    onSuccess={() => setFetchTrigger((prev) => !prev)}
                />
                {/* MODAL EDIT TUJUAN */}
                <ModalTujuanPemda
                    metode="lama" 
                    id={IdTujuan}
                    tema_id={IdTema}
                    tahun={Tahun?.value}
                    periode={IdPeriode}
                    isOpen={isOpenEditTujuan} 
                    onClose={() => handleModalEditTujuan(0, 0)} 
                    onSuccess={() => setFetchTrigger((prev) => !prev)}
                />
            </div>
        </>
    )
}

export default Table;
