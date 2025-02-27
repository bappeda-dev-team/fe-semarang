'use client'

import { ButtonGreen, ButtonRed } from "@/components/global/Button";
import React, { useState, useEffect } from "react";
import { AlertNotification, AlertQuestion } from "@/components/global/Alert";
import { LoadingClip } from "@/components/global/Loading";
import { getToken } from "@/components/lib/Cookie";
import { TbPencil, TbTrash } from "react-icons/tb";

interface Target {
    id_target: string;
    indikator_id: string;
    target: string;
    satuan: string;
}

interface Indikator {
    id_indikator: string;
    nama_indikator: string;
    targets: Target[];
}

interface SubKegiatan {
    subkegiatanterpilih_id: string;
    id: string;
    status: string;
    nama_sub_kegiatan: string;
    kode_opd: string;
    nama_opd: string;
    tahun: string;
    indikator: Indikator[];
}

const Table = () => {

    const [SubKegiatan, setSubKegiatan] = useState<SubKegiatan[]>([]);
    const [Error, setError] = useState<boolean | null>(null);
    const [Loading, setLoading] = useState<boolean | null>(null);
    const [DataNull, setDataNull] = useState<boolean | null>(null);
    const token = getToken();

    useEffect(() => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        const fetchSubKegiatan = async () => {
            setLoading(true)
            try {
                const response = await fetch(`${API_URL}/sub_kegiatan/findall`, {
                    headers: {
                        Authorization: `${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                const result = await response.json();
                const data = result.sub_kegiatan;
                if (data == null) {
                    setDataNull(true);
                    setSubKegiatan([]);
                } else if (result.code === 401) {
                    setError(true);
                } else {
                    setError(false);
                    setDataNull(false);
                    setSubKegiatan(data);
                }
                setSubKegiatan(data);
            } catch (err) {
                setError(true);
                console.error(err)
            } finally {
                setLoading(false);
            }
        }
        fetchSubKegiatan();
    }, [token]);

    const hapusSubKegiatan = async (id: any) => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        try {
            const response = await fetch(`${API_URL}/sub_kegiatan/delete/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `${token}`,
                    'Content-Type': 'application/json',
                },
            })
            if (!response.ok) {
                alert("gagal hapus sub kegiatan dengan response !ok, cek koneksi internet atau server");
            }
            setSubKegiatan(SubKegiatan.filter((data) => (data.id !== id)))
            AlertNotification("Berhasil", "Data sub kegiatan Berhasil Dihapus", "success", 1000);
        } catch (err) {
            AlertNotification("Gagal", "cek koneksi internet atau database server", "error", 2000);
            console.error(err)
        }
    };

    if (Loading) {
        return (
            <div className="border p-5 rounded-xl shadow-xl">
                <LoadingClip className="mx-5 py-5" />
            </div>
        );
    } else if (Error) {
        return (
            <div className="border p-5 rounded-xl shadow-xl">
                <h1 className="text-red-500 mx-5 py-5">Periksa koneksi internet atau database server</h1>
            </div>
        )
    }

    return (
        <>
            <div className="overflow-auto m-2 rounded-t-xl border">
                <table className="w-full">
                    <thead>
                        <tr className="bg-[#99CEF5] text-white">
                            <th rowSpan={2} className="border-r border-b px-6 py-3 min-w-[50px]">No</th>
                            <th rowSpan={2} className="border-r border-b px-6 py-3 min-w-[100px]">Aksi</th>
                            <th rowSpan={2} className="border-r border-b px-6 py-3 min-w-[300px]">Nama Sub Kegiatan</th>
                            <th rowSpan={2} className="border-r border-b px-6 py-3 min-w-[100px]">Tahun</th>
                            <th rowSpan={2} className="border-r border-b px-6 py-3 min-w-[200px]">Perangkat Daerah</th>
                            <th rowSpan={2} className="border-r border-b px-6 py-3 min-w-[200px]">Indikator</th>
                        </tr>
                        <tr className="bg-[#99CEF5] text-white">
                            <th className="border-l border-b px-6 py-3 min-w-[50px]">Target</th>
                            <th className="border-l border-b px-6 py-3 min-w-[50px]">Satuan</th>
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
                            SubKegiatan.map((item: SubKegiatan, index: number) => {
                                // Cek apakah item.tujuan_pemda ada
                                const hasIndikator = !!item.indikator;
                                const indikatorLength = hasIndikator ? item.indikator.length : 0;

                                return (
                                    <React.Fragment key={item.id || index}>
                                        {/* Baris Utama */}
                                        <tr>
                                            <td className="border-x border-b px-6 py-4 text-center" rowSpan={indikatorLength + 1}>{index + 1}</td>
                                            <td className="border-r border-b px-6 py-4" rowSpan={indikatorLength + 1}>
                                                <div className="flex flex-col justify-center items-center gap-2">
                                                    <ButtonGreen
                                                        className="flex items-center gap-1 w-full"
                                                        halaman_url={`/DataMaster/masterprogramkegiatan/subkegiatan/${item.id}`}
                                                    >
                                                        <TbPencil />
                                                        Edit
                                                    </ButtonGreen>
                                                    <ButtonRed
                                                        className="flex items-center gap-1 w-full"
                                                        onClick={() => {
                                                            AlertQuestion("Hapus?", "Hapus Sub Kegiatan yang dipilih?", "question", "Hapus", "Batal").then((result) => {
                                                                if (result.isConfirmed) {
                                                                    hapusSubKegiatan(item.id);
                                                                }
                                                            });
                                                        }}
                                                    >
                                                        <TbTrash />
                                                        Hapus
                                                    </ButtonRed>
                                                </div>
                                            </td>
                                            <td className="border-r border-b px-6 py-4" rowSpan={indikatorLength + 1}>
                                                {item.nama_sub_kegiatan || "-"}
                                            </td>
                                            <td className="border-r border-b px-6 py-4 text-center" rowSpan={indikatorLength + 1}>
                                                {item.tahun || "-"}
                                            </td>
                                            <td className="border-r border-b px-6 py-4" rowSpan={indikatorLength + 1}>
                                                {item.nama_opd || "-"}
                                            </td>
                                            {!hasIndikator &&
                                                <React.Fragment>
                                                    <td className="border-r border-b px-6 py-4 text-center">-</td>
                                                    <td className="border-r border-b px-6 py-4 text-center">-</td>
                                                    <td className="border-r border-b px-6 py-4 text-center">-</td>
                                                </React.Fragment>
                                            }
                                        </tr>

                                        {/* Baris Indikator (hanya jika item.indikator ada) */}
                                        {hasIndikator &&
                                            item.indikator.map((i: Indikator, indikatorIndex: number) => (
                                                <tr key={i.id_indikator || indikatorIndex}>
                                                    <td className="border-r border-b px-6 py-4">{i.nama_indikator || "-"}</td>
                                                    {i?.targets.map((t: Target) => (
                                                        <React.Fragment key={t.id_target}>
                                                            <td className="border-r border-b px-6 py-4 text-center">{t.target || "-"}</td>
                                                            <td className="border-r border-b px-6 py-4 text-center">{t.satuan || "-"}</td>
                                                        </React.Fragment>
                                                    ))}
                                                </tr>
                                            ))
                                        }
                                    </React.Fragment>
                                );
                            })
                        }
                    </tbody>
                </table>
            </div>
        </>
    )
}

export default Table;