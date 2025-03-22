'use client'

import { getToken } from "@/components/lib/Cookie";
import React, { useEffect, useState } from "react";
import { ButtonGreenBorder, ButtonSkyBorder } from "@/components/global/Button";
import { TbPencil } from "react-icons/tb";
import { LoadingClip } from "@/components/global/Loading";
import { ModalMatrix } from "./ModalMatrix";

interface renstra {
    nama: string;
    kode: string;
    jenis: string;
    indikator: Indikator[];
    bidang_urusan?: renstra[];
    program?: renstra[]
    kegiatan?: renstra[]
    subkegiatan?: renstra[]
}
interface matrix {
    kode_opd: string
    tahun_awal: string;
    tahun_akhir: string;
    pagu_total: pagu[];
    urusan: renstra;
}
interface Indikator {
    id: string;
    kode: string;
    kode_opd: string;
    indikator: string;
    pagu_anggaran: number;
    tahun: string;
    target: Target[];
}
interface Target {
    id: string;
    indikator_id: string;
    target: string;
    satuan: string;
}
interface pagu {
    tahun: string;
    pagu_indikatif: number;
}
interface table {
    jenis: "Urusan" | "Bidang Urusan" | "Program" | "Kegiatan" | "Sub Kegiatan";
    tahun_awal: string;
    tahun_akhir: string;
    tahun_list: string[];
    kode_opd: string;
}
interface Thead {
    jenis: "Urusan" | "Bidang Urusan" | "Program" | "Kegiatan" | "Sub Kegiatan";
    tahun_list: string[];
}
interface Tr {
    indikator: any[];
    nama: string;
    kode: string;
    kode_opd: string;
    jenis: "Urusan" | "Bidang Urusan" | "Program" | "Kegiatan" | "Sub Kegiatan";
    fetchTrigger: () => void;
}
interface TablePagu {
    tahun_list: string[];
    pagu_total: pagu[];
}

export const TableRenstra: React.FC<table> = ({ jenis, tahun_awal, tahun_akhir, tahun_list, kode_opd }) => {

    const [Matrix, setMatrix] = useState<matrix[]>([]);

    const [Loading, setLoading] = useState<boolean>(false);
    const [DataNull, setDataNull] = useState<boolean>(false);
    const [FetchTrigger, setFetchTrigger] = useState<boolean>(false);
    const token = getToken();

    useEffect(() => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        const fetchMatrix = async () => {
            try {
                setLoading(true);
                const response = await fetch(`${API_URL}/matrix_renstra/opd/${kode_opd}?tahun_awal=${tahun_awal}&tahun_akhir=${tahun_akhir}`, {
                    headers: {
                        Authorization: `${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                const result = await response.json();
                const data = result.data;
                // console.log(data);
                if (result.code === 400) {
                    setDataNull(true);
                    setMatrix([]);
                    console.log(data);
                } else if (result.code === 200) {
                    setDataNull(false);
                    setMatrix(data);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
        fetchMatrix();
    }, [kode_opd, tahun_awal, tahun_akhir, token, FetchTrigger]);

    if (DataNull) {
        return (
            <h1 className="p-5 text-red-500 font-semibold">Sub Kegiatan OPD belum di pilih pada periode tahun {tahun_awal} sampai {tahun_akhir}</h1>
        )
    }
    if (Loading) {
        return (
            <>
                <LoadingClip />
            </>
        )
    }

    return (
        <>
            {Matrix.map((item: matrix, index: number) => (
                <React.Fragment key={index}>
                    <div className="overflow-auto m-2 rounded-xl border">
                        <TableTotalPagu
                            tahun_list={tahun_list}
                            pagu_total={item.pagu_total}
                        />
                    </div>
                    <div className="overflow-auto m-2 rounded-t-xl border">
                        <table className="w-full">
                            <TheadMatrix
                                tahun_list={tahun_list}
                                jenis="Urusan"
                            />
                            <tbody>
                                <TrMatrix
                                    jenis="Urusan"
                                    indikator={item.urusan.indikator}
                                    kode={item.urusan.kode}
                                    nama={item.urusan.nama}
                                    kode_opd={item.kode_opd}
                                    fetchTrigger={() => setFetchTrigger((prev) => !prev)}
                                />
                            </tbody>
                            {item.urusan.bidang_urusan &&
                                <React.Fragment>
                                    {item.urusan.bidang_urusan.map((br: renstra, br_index: number) => (
                                        <React.Fragment key={br_index}>
                                            <TheadMatrix
                                                tahun_list={tahun_list}
                                                jenis="Bidang Urusan"
                                            />
                                            <tbody>
                                                <TrMatrix
                                                    jenis="Bidang Urusan"
                                                    indikator={br.indikator}
                                                    kode={br.kode}
                                                    nama={br.nama}
                                                    kode_opd={kode_opd}
                                                    fetchTrigger={() => setFetchTrigger((prev) => !prev)}
                                                />
                                            </tbody>
                                            {br.program &&
                                                <React.Fragment>
                                                    {br.program.map((p: renstra, p_index: number) => (
                                                        <React.Fragment key={p_index}>
                                                            <TheadMatrix
                                                                tahun_list={tahun_list}
                                                                jenis="Program"
                                                            />
                                                            <tbody>
                                                                <TrMatrix
                                                                    jenis="Program"
                                                                    indikator={p.indikator}
                                                                    kode={p.kode}
                                                                    nama={p.nama}
                                                                    kode_opd={kode_opd}
                                                                    fetchTrigger={() => setFetchTrigger((prev) => !prev)}
                                                                />
                                                            </tbody>
                                                            {p.kegiatan &&
                                                                <React.Fragment>
                                                                    {p.kegiatan.map((k: renstra, k_index: number) => (
                                                                        <React.Fragment key={k_index}>
                                                                            <TheadMatrix
                                                                                tahun_list={tahun_list}
                                                                                jenis="Kegiatan"
                                                                            />
                                                                            <tbody>
                                                                                <TrMatrix
                                                                                    jenis="Kegiatan"
                                                                                    indikator={k.indikator}
                                                                                    kode={k.kode}
                                                                                    nama={k.nama}
                                                                                    kode_opd={kode_opd}
                                                                                    fetchTrigger={() => setFetchTrigger((prev) => !prev)}
                                                                                />
                                                                            </tbody>
                                                                            {k.subkegiatan &&
                                                                                <React.Fragment>
                                                                                    <TheadMatrix
                                                                                        tahun_list={tahun_list}
                                                                                        jenis="Sub Kegiatan"
                                                                                    />
                                                                                    {k.subkegiatan.map((sk: renstra, sk_index: number) => (
                                                                                        <React.Fragment key={sk_index}>
                                                                                            <tbody>
                                                                                                <TrMatrix
                                                                                                    jenis="Sub Kegiatan"
                                                                                                    indikator={sk.indikator}
                                                                                                    kode={sk.kode}
                                                                                                    nama={sk.nama}
                                                                                                    kode_opd={kode_opd}
                                                                                                    fetchTrigger={() => setFetchTrigger((prev) => !prev)}
                                                                                                />
                                                                                            </tbody>
                                                                                        </React.Fragment>
                                                                                    ))}
                                                                                </React.Fragment>
                                                                            }
                                                                        </React.Fragment>
                                                                    ))}
                                                                </React.Fragment>
                                                            }
                                                        </React.Fragment>
                                                    ))}
                                                </React.Fragment>
                                            }
                                        </React.Fragment>
                                    ))}
                                </React.Fragment>
                            }
                        </table>
                    </div>
                </React.Fragment>
            ))}
        </>
    )
}
export const TheadMatrix: React.FC<Thead> = ({ jenis, tahun_list }) => {
    return (
        <thead>
            <tr className={`text-white 
                ${jenis === "Urusan" && "bg-[#205781]"}
                ${jenis === "Bidang Urusan" && "bg-red-500"}
                ${jenis === "Program" && "bg-blue-500"}
                ${jenis === "Kegiatan" && "bg-green-500"}
                ${jenis === "Sub Kegiatan" && "bg-emerald-500"}
            `}>
                <td rowSpan={2} className="border-r border-b px-6 py-4 w-[200px]">Kode</td>
                <td rowSpan={2} className="border-r border-b px-6 py-4 min-w-[200px]">{jenis}</td>
                {tahun_list.map((item: any) => (
                    <td key={item} colSpan={5} className="border-r border-b px-6 py-3 min-w-[100px] text-center">{item}</td>
                ))}

            </tr>
            <tr className={`text-white
                ${jenis === "Urusan" && "bg-[#205781]"}
                ${jenis === "Bidang Urusan" && "bg-red-500"}
                ${jenis === "Program" && "bg-blue-500"}
                ${jenis === "Kegiatan" && "bg-green-500"}
                ${jenis === "Sub Kegiatan" && "bg-emerald-500"}
            `}>
                {(jenis === 'Urusan' || jenis === 'Bidang Urusan') ? 
                    tahun_list.map((item: string) => (
                        <React.Fragment key={item}>
                            <td colSpan={5} className="border-l border-b px-6 py-3 min-w-[200px] text-center">Pagu</td>
                        </React.Fragment>
                    ))
                :
                    tahun_list.map((item: string) => (
                        <React.Fragment key={item}>
                            <td className="border-l border-b px-6 py-3 min-w-[300px] text-center">indikator</td>
                            <td className="border-l border-b px-6 py-3 min-w-[50px]">Target</td>
                            <td className="border-l border-b px-6 py-3 min-w-[50px]">Satuan</td>
                            <td className="border-l border-b px-6 py-3 min-w-[200px] text-center">Pagu</td>
                            <td className="border-l border-b px-6 py-3 min-w-[50px] text-center">Aksi</td>
                        </React.Fragment>
                    ))
                }
            </tr>
        </thead>
    )
}
export const TrMatrix: React.FC<Tr> = ({ jenis, kode_opd, kode, nama, indikator, fetchTrigger }) => {

    const [ModalTambah, setModalTambah] = useState<boolean>(false);
    const [ModalEdit, setModalEdit] = useState<boolean>(false);

    const [TahunN, setTahunN] = useState<string>('');
    const [IdIndikator, setIdIndikator] = useState<string>('');

    const handleModalTambah = (tahun: string) => {
        if (ModalTambah) {
            setModalTambah(false);
            setTahunN('');
        } else {
            setModalTambah(true);
            setTahunN(tahun);
        }
    }
    function formatRupiah(angka: number) {
        if (typeof angka !== 'number') {
            return String(angka); // Jika bukan angka, kembalikan sebagai string
        }
        return angka.toLocaleString('id-ID'); // 'id-ID' untuk format Indonesia
    }

    const handleModalEdit = (id: string, tahun: string) => {
        if (ModalEdit) {
            setModalEdit(false);
            setTahunN('');
            setIdIndikator('')
        } else {
            setModalEdit(true);
            setTahunN(tahun);
            setIdIndikator(id);
        }
    }

    return (
        // terdapat error hidrasi disini
        <>
            {(jenis === 'Urusan' || jenis === 'Bidang Urusan') ? 
                <tr>
                    <td className={`border-r border-b px-6 py-4 font-semibold`}>{kode}</td>
                    <td className={`border-r border-b px-6 py-4 w-full`}>{nama}</td>
                    {indikator.map((i: Indikator, index: number) => (
                        <React.Fragment key={i.id || index}>
                            <td colSpan={5} className={`border-r border-b px-6 py-4 w-full text-center`}>Rp.{formatRupiah(i.pagu_anggaran)}</td>
                        </React.Fragment>
                    ))}
                </tr>
            :
                <tr>
                    <td className={`border-r border-b px-6 py-4 font-semibold`}>{kode}</td>
                    <td className={`border-r border-b px-6 py-4 w-full`}>{nama}</td>
                    {indikator.map((i: Indikator, index: number) => (
                        <React.Fragment key={i.id || index}>
                            <td className={`border-r border-b px-6 py-4 w-full`}>{i.indikator || "-"}</td>
                            {i.target.map((t: Target, sub_index: number) => (
                                <React.Fragment key={sub_index}>
                                    <td className={`border-r border-b px-6 py-4 w-full text-center`}>{t.target || "-"}</td>
                                    <td className={`border-r border-b px-6 py-4 w-full text-center`}>{t.satuan || "-"}</td>
                                </React.Fragment>
                            ))}
                            <td className={`border-r border-b px-6 py-4 w-full`}>Rp.{formatRupiah(i.pagu_anggaran)}</td>
                            <td className={`border-r border-b px-6 py-4 w-full`}>
                                {i.id !== "" ?
                                    <ButtonGreenBorder
                                        className="flex items-center gap-1"
                                        onClick={() => handleModalEdit(i.id, i.tahun)}
                                    >
                                        <TbPencil />
                                        Edit
                                    </ButtonGreenBorder>
                                    :
                                    <ButtonSkyBorder
                                        className="flex items-center gap-1"
                                        onClick={() => handleModalTambah(i.tahun)}
                                    >
                                        <TbPencil />
                                        Edit
                                    </ButtonSkyBorder>
                                }
                            </td>
                        </React.Fragment>
                    ))}
                </tr>
            }
            {/* MODAL TAMBAH */}
            <ModalMatrix
                isOpen={ModalTambah}
                onClose={() => handleModalTambah('')}
                metode="baru"
                nama={nama}
                jenis={jenis}
                pagu={jenis === 'Sub Kegiatan' ? 'pagu' : 'non-pagu'}
                kode={kode}
                kode_opd={kode_opd}
                tahun={TahunN}
                onSuccess={fetchTrigger}
            />
            {/* MODAL EDIT */}
            <ModalMatrix
                id={IdIndikator}
                isOpen={ModalEdit}
                onClose={() => handleModalEdit('', '')}
                metode="lama"
                nama={nama}
                jenis={jenis}
                pagu={jenis === 'Sub Kegiatan' ? 'pagu' : 'non-pagu'}
                kode={kode}
                kode_opd={kode_opd}
                tahun={TahunN}
                onSuccess={fetchTrigger}
            />
        </>
    )
}
export const TableTotalPagu: React.FC<TablePagu> = ({ tahun_list, pagu_total }) => {

    function formatRupiah(angka: number) {
        if (typeof angka !== 'number') {
            return String(angka); // Jika bukan angka, kembalikan sebagai string
        }
        return angka.toLocaleString('id-ID'); // 'id-ID' untuk format Indonesia
    }

    return (
        <table className="w-full">
            <tbody>
                <tr>
                    <td rowSpan={2} className={`border-r border-b px-6 py-4 font-semibold`}>Total Pagu OPD</td>
                    {tahun_list.map((item: string) => (
                        <td key={item} className="border-r border-b px-6 py-4 font-semibold text-center">{item}</td>
                    ))}
                </tr>
                <tr>
                    {pagu_total.map((item: pagu, index: number) => (
                        <td key={index} className="border-r border-b px-6 py-4 font-semibold text-center">Rp.{formatRupiah(item.pagu_indikatif)}</td>
                    ))}
                </tr>
            </tbody>
        </table>
    )
}