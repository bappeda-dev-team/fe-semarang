'use client'

import React, { useEffect, useState } from "react";
import { LoadingClip } from "@/components/global/Loading";
import { getOpdTahun } from "@/components/lib/Cookie";
import { TahunNull } from "@/components/global/OpdTahunNull";
import { getToken} from "@/components/lib/Cookie";

interface IKU {
    indikator_id: string;
    asal_iku: string;
    sumber: string;
    is_active: boolean;
    rumus_perhitungan: string;
    sumber_data: string;
    indikator: string;
    created_at: string;
    target: Target[];
}

interface Target {
    target: string;
    satuan: string;
}

interface table {
    id_periode: number;
    tahun_awal: string;
    tahun_akhir: string;
    jenis: string;
    tahun_list: string[];
}

const TablePemda: React.FC<table> = ({id_periode, tahun_awal, tahun_akhir, jenis, tahun_list}) => {

    const [IKU, setIKU] = useState<IKU[]>([]);

    const [Error, setError] = useState<boolean | null>(null);
    const [DataNull, setDataNull] = useState<boolean | null>(null);

    const [Loading, setLoading] = useState<boolean | null>(null);
    const [Tahun, setTahun] = useState<any>(null);
    const token = getToken();

    useEffect(() => {
        const data = getOpdTahun();
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
        const fetchIkuPemda = async () => {
            setLoading(true)
            try {
                const response = await fetch(`${API_URL}/indikator_utama/periode/${tahun_awal}/${tahun_akhir}/${jenis}`, {
                    headers: {
                        Authorization: `${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                const result = await response.json();
                const data = result.data;
                if (data == null) {
                    setDataNull(true);
                    setIKU([]);
                } else {
                    setDataNull(false);
                    setIKU(data);
                }
            } catch (err) {
                setError(true);
                console.error(err)
            } finally {
                setLoading(false);
            }
        }
        if (Tahun?.value != undefined) {
            fetchIkuPemda();
        }
    }, [token, Tahun, tahun_awal, tahun_akhir, jenis]);

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
    } else if (Tahun?.value == undefined) {
        return <TahunNull />
    }

    return (
        <>
            <div className="overflow-auto m-2 rounded-t-xl border">
                <table className="w-full">
                    <thead>
                        <tr className="bg-emerald-500 text-white">
                            <th rowSpan={2} className="border-r border-b px-6 py-3 text-center">No</th>
                            <th rowSpan={2} className="border-r border-b px-6 py-3 min-w-[300px]">Indikator Utama</th>
                            <th rowSpan={2} className="border-r border-b px-6 py-3 min-w-[200px]">Rumus Perhitungan</th>
                            <th rowSpan={2} className="border-r border-b px-6 py-3 min-w-[200px]">Sumber Data</th>
                            {tahun_list.map((item: any) => (
                                <th key={item} colSpan={2} className="border-l border-b px-6 py-3 min-w-[100px]">{item}</th>
                            ))}
                        </tr>
                        <tr className="bg-emerald-500 text-white">
                            {tahun_list.map((item: any) => (
                                <React.Fragment key={item}>
                                    <th className="border-l border-b px-6 py-3 min-w-[50px]">Target</th>
                                    <th className="border-l border-b px-6 py-3 min-w-[50px]">Satuan</th>
                                </React.Fragment>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {DataNull ? (
                            <tr>
                                <td className="px-6 py-3" colSpan={30}>
                                    Data Kosong / Belum Ditambahkan
                                </td>
                            </tr>
                        ) : (
                            IKU.map((item, index) => (
                                <tr key={item.indikator_id || index}>
                                    <td className="border-x border-b border-emerald-500 py-4 px-3 text-center">
                                        {index + 1}
                                    </td>
                                    <td className="border-r border-b border-emerald-500 px-6 py-4">
                                        <div className="flex gap-2 items-center">
                                            <p>{item.indikator || "-"}</p>
                                            <p className="text-red-500">{item.is_active === false ? "(tidak aktif)" : ""}</p>
                                        </div>
                                        <p className="text-gray-500 text-xs">({item.asal_iku || "-"})</p>
                                    </td>
                                    <td className="border-r border-b border-emerald-500 px-6 py-4">
                                        {item.rumus_perhitungan || "-"}
                                    </td>
                                    <td className="border-r border-b border-emerald-500 px-6 py-4">
                                        {item.sumber_data || "-"}
                                    </td>
                                    {item.target.map((t: Target, index: number) => (
                                        <React.Fragment key={index}>
                                            <td className="border-r border-b border-emerald-500 px-6 py-4 text-center">
                                                {t.target || "-"}
                                            </td>
                                            <td className="border-r border-b border-emerald-500 px-6 py-4 text-center">
                                                {t.satuan || "-"}
                                            </td>
                                        </React.Fragment>
                                    ))}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </>
    )
}

export default TablePemda;
