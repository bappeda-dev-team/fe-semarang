'use client'

import { useEffect, useState } from "react";
import { ButtonBlackBorder, ButtonGreen, ButtonGreenBorder, ButtonSky, ButtonSkyBorder } from "@/components/global/Button";
import { TbEye, TbBook, TbKeyFilled, TbPencil, TbPrinter, TbReceipt } from "react-icons/tb";
import { ModalIndikator } from "../Pohon/ModalIndikator";
import { ModalAnggaran } from "./ModalAnggaran";

interface TableLaporan {
    tahun: string;
    kode_opd: string;
    nama_opd?: string;
}
interface TableAsn {
    tahun: string;
    nip: string;
}
interface TableRekinAsn {
    onSuccess: () => void;
}
interface indikator {
    id_indikator: string;
    id_rekin: string;
    kode: string;
    nama_indikator: string;
    targets: target[];
}
interface target {
    id_target: string;
    indikator_id: string;
    target: string;
    satuan: string;
}

export const TableLaporan: React.FC<TableLaporan> = ({ tahun }) => {

    return (
        <div className="overflow-auto m-3 rounded-t-xl border">
            <table className="w-full">
                <thead className="bg-[#99CEF5] text-white">
                    <tr>
                        <th rowSpan={2} className="border-r border-b px-6 py-3 min-w-[50px]">No</th>
                        <th rowSpan={2} className="border-r border-b px-6 py-3 min-w-[200px]">Pemilik Rencana</th>
                        <th rowSpan={2} className="border-r border-b px-6 py-3 min-w-[200px]">Rencana Kinerja</th>
                        <th rowSpan={2} className="border-r border-b px-6 py-3 min-w-[200px]">Tahun</th>
                        <th rowSpan={2} className="border-r border-b px-6 py-3 min-w-[200px]">Indikator Kinerja</th>
                        <th rowSpan={2} className="border-r border-b px-6 py-3 min-w-[200px]">Target</th>
                        <th rowSpan={2} className="border-r border-b px-6 py-3 min-w-[200px]">Satuan</th>
                        <th colSpan={3} className="border-r border-b px-6 py-3 min-w-[200px]">Anggaran</th>
                        <th rowSpan={2} className="border-l border-b px-6 py-3 min-w-[250px]">Aksi</th>
                    </tr>
                    <tr>
                        <th className="border-r border-b px-6 py-3 min-w-[200px]">Rankir-1</th>
                        <th className="border-r border-b px-6 py-3 min-w-[200px]">Rankir-2</th>
                        <th className="border-r border-b px-6 py-3 min-w-[200px]">Penetapan</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td className="border-r border-b px-6 py-4">1</td>
                        <td colSpan={3} className="border-r border-b px-6 py-4">Subkegiatan: penyusunan dokumen perencanaan perangkat daerah</td>
                        <td className="border-r border-b px-6 py-4">jumlah dokumen perencanaan, pengendalian, dan evaluasi perangkat daerah</td>
                        <td className="border-r border-b px-6 py-4">7</td>
                        <td className="border-r border-b px-6 py-4">Dokumen</td>
                        <td className="border-r border-b px-6 py-4">Rp. 0,0</td>
                        <td className="border-r border-b px-6 py-4">Rp. 102.353.000</td>
                        <td className="border-r border-b px-6 py-4">Rp. 0,0</td>
                        <td className="border-r border-b px-6 py-4">
                            <div className="flex flex-col justify-center items-center gap-2">
                                <ButtonSky className="w-full">
                                    <TbBook className="mr-1" />
                                    Tampilkan
                                </ButtonSky>
                                <ButtonGreenBorder className="w-full">
                                    <TbPrinter className="mr-1" />
                                    Cetak rincian belanja
                                </ButtonGreenBorder>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td className="border-r border-b px-6 py-4">1.1</td>
                        <td className="border-r border-b px-6 py-4">Adi Sucipto</td>
                        <td className="border-r border-b px-6 py-4">tersusun dokumen rancangan aplikasi rencana kinerja terintegrasi</td>
                        <td className="border-r border-b px-6 py-4">2024</td>
                        <td className="border-r border-b px-6 py-4">dokumen rancangan aplikasi</td>
                        <td className="border-r border-b px-6 py-4">1</td>
                        <td className="border-r border-b px-6 py-4">dokumen</td>
                        <td className="border-r border-b px-6 py-4">Rp. 0,0</td>
                        <td className="border-r border-b px-6 py-4">Rp. 120.235.234</td>
                        <td className="border-r border-b px-6 py-4">Rp. 0,0</td>
                        <td className="border-r border-b px-6 py-4">
                            <div className="flex flex-col justify-center items-center gap-2">
                                <ButtonGreen className="w-full">
                                    <TbReceipt className="mr-1" />
                                    Rincian
                                </ButtonGreen>
                                <ButtonSkyBorder className="w-full">
                                    <TbPencil className="mr-1" />
                                    Edit
                                </ButtonSkyBorder>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td colSpan={7} className="border-r border-b px-6 py-4">renaksi 1: rapat koordinasi</td>
                        <td className="border-r border-b px-6 py-4">Rp. 0,0</td>
                        <td className="border-r border-b px-6 py-4">Rp. 120.235.234</td>
                        <td className="border-r border-b px-6 py-4">Rp. 0,0</td>
                        <td className="border-r border-b px-6 py-4">

                        </td>
                    </tr>
                    <tr>
                        <td colSpan={7} className="border-r border-b px-6 py-4">renaksi 2: penyusunan KAK pengadaan paket pengerjaan</td>
                        <td className="border-r border-b px-6 py-4">Rp. 0,0</td>
                        <td className="border-r border-b px-6 py-4">Rp. 120.235.234</td>
                        <td className="border-r border-b px-6 py-4">Rp. 0,0</td>
                        <td className="border-r border-b px-6 py-4">

                        </td>
                    </tr>
                    <tr>
                        <td colSpan={7} className="border-r border-b px-6 py-4">renaksi 3: Penyusunan tim pengadaan</td>
                        <td className="border-r border-b px-6 py-4">Rp. 0,0</td>
                        <td className="border-r border-b px-6 py-4">Rp. 120.235.234</td>
                        <td className="border-r border-b px-6 py-4">Rp. 0,0</td>
                        <td className="border-r border-b px-6 py-4">

                        </td>
                    </tr>
                    <tr>
                        <td className="border-r border-b px-6 py-4">1</td>
                        <td colSpan={3} className="border-r border-b px-6 py-4">Subkegiatan: penyusunan dokumen perencanaan perangkat daerah</td>
                        <td className="border-r border-b px-6 py-4">jumlah dokumen perencanaan, pengendalian, dan evaluasi perangkat daerah</td>
                        <td className="border-r border-b px-6 py-4">7</td>
                        <td className="border-r border-b px-6 py-4">Dokumen</td>
                        <td className="border-r border-b px-6 py-4">Rp. 0,0</td>
                        <td className="border-r border-b px-6 py-4">Rp. 102.353.000</td>
                        <td className="border-r border-b px-6 py-4">Rp. 0,0</td>
                        <td className="border-r border-b px-6 py-4">
                            <div className="flex flex-col justify-center items-center gap-2">
                                <ButtonSky className="w-full">
                                    <TbBook className="mr-1" />
                                    Tampilkan
                                </ButtonSky>
                                <ButtonGreenBorder className="w-full">
                                    <TbPrinter className="mr-1" />
                                    Cetak rincian belanja
                                </ButtonGreenBorder>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td className="border-r border-b px-6 py-4">1.1</td>
                        <td className="border-r border-b px-6 py-4">Adi Sucipto</td>
                        <td className="border-r border-b px-6 py-4">tersusun dokumen rancangan aplikasi rencana kinerja terintegrasi</td>
                        <td className="border-r border-b px-6 py-4">2024</td>
                        <td className="border-r border-b px-6 py-4">dokumen rancangan aplikasi</td>
                        <td className="border-r border-b px-6 py-4">1</td>
                        <td className="border-r border-b px-6 py-4">dokumen</td>
                        <td className="border-r border-b px-6 py-4">Rp. 0,0</td>
                        <td className="border-r border-b px-6 py-4">Rp. 120.235.234</td>
                        <td className="border-r border-b px-6 py-4">Rp. 0,0</td>
                        <td className="border-r border-b px-6 py-4">
                            <div className="flex flex-col justify-center items-center gap-2">
                                <ButtonGreen className="w-full">
                                    <TbReceipt className="mr-1" />
                                    Rincian
                                </ButtonGreen>
                                <ButtonSkyBorder className="w-full">
                                    <TbPencil className="mr-1" />
                                    Edit
                                </ButtonSkyBorder>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td colSpan={7} className="border-r border-b px-6 py-4">renaksi 1: rapat koordinasi</td>
                        <td className="border-r border-b px-6 py-4">Rp. 0,0</td>
                        <td className="border-r border-b px-6 py-4">Rp. 120.235.234</td>
                        <td className="border-r border-b px-6 py-4">Rp. 0,0</td>
                        <td className="border-r border-b px-6 py-4">

                        </td>
                    </tr>
                    <tr>
                        <td colSpan={7} className="border-r border-b px-6 py-4">renaksi 2: penyusunan KAK pengadaan paket pengerjaan</td>
                        <td className="border-r border-b px-6 py-4">Rp. 0,0</td>
                        <td className="border-r border-b px-6 py-4">Rp. 120.235.234</td>
                        <td className="border-r border-b px-6 py-4">Rp. 0,0</td>
                        <td className="border-r border-b px-6 py-4">

                        </td>
                    </tr>
                    <tr>
                        <td colSpan={7} className="border-r border-b px-6 py-4">renaksi 3: Penyusunan tim pengadaan</td>
                        <td className="border-r border-b px-6 py-4">Rp. 0,0</td>
                        <td className="border-r border-b px-6 py-4">Rp. 120.235.234</td>
                        <td className="border-r border-b px-6 py-4">Rp. 0,0</td>
                        <td className="border-r border-b px-6 py-4">

                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}
export const TableAsn: React.FC<TableAsn> = ({ tahun, nip }) => {

    const [ShowRekin, setShowRekin] = useState<boolean>(true);
    const [FetchTrigger, setFetchTrigger] = useState<boolean>(true);
    
    const [OpenModalIndikator, setOpenModalIndikator] = useState<boolean>(false);
    const [Isi, setIsi] = useState<string>('');
    const [DataIndikator, setDataIndikator] = useState<indikator[]>([]);

    const handleShowRekin = () => {
        if (ShowRekin) {
            setShowRekin(false);
        } else {
            setShowRekin(true);
        }
    }
    const handleModalIndikator = (isi: string) => {
        if(OpenModalIndikator){
            setOpenModalIndikator(false);
            setIsi('');
            setDataIndikator([]);
        } else {
            setOpenModalIndikator(true);
            setIsi(isi);
            setDataIndikator([]);
        }
    }

    return (
        <div>
            <div className={`flex flex-wrap items-center justify-between w-full p-3 border hover:bg-gray-200 cursor-pointer ${ShowRekin ? 'rounded-t-xl rounded-bl-xl' : 'rounded-xl'}`} onClick={handleShowRekin}>
                <p className="font-bold">1. Sub Kegiatan : (5.23.12.1) Koordinasi dan pemetaan data jalan raya haji dahlan</p>
                <p className="p-2 bg-green-500 rounded-xl min-w-[200px] text-center text-white">Rp. 2.000.000,00</p>
            </div>
            <div className={`flex flex-wrap gap-2 items-center justify-between transition-all duration-300 ease-in-out border-x border-b ${ShowRekin ? 'opacity-100 ml-3 p-3' : 'max-h-0 opacity-0 pointer-events-none'}`}>
                <div className="flex flex-wrap items-center gap-2 w-full justify-between">
                    <div className="flex flex-wrap items-center gap-2">
                        <p className="font-semibold">1.1 rencana kinerja pertama di menu asn</p>
                        <ButtonBlackBorder 
                            onClick={() => handleModalIndikator('1.1 rencana kinerja pertama di menu asn')}
                            className="flex items-center gap-1"
                        >
                            <TbEye />
                            cek indikator
                        </ButtonBlackBorder>
                    </div>
                    <div className="p-2 bg-green-500 rounded-xl min-w-[200px] text-center text-white">Rp. 1.000.000,00</div>
                </div>
                <TableRekinAsn
                    onSuccess={() => setFetchTrigger((prev) => !prev)}
                />
            </div>
            <div className={`flex flex-wrap gap-2 items-center justify-between transition-all duration-300 ease-in-out border-x border-b ${ShowRekin ? 'opacity-100 ml-3 p-3' : 'max-h-0 opacity-0 pointer-events-none'}`}>
                <div className="flex flex-wrap items-center gap-2 w-full justify-between">
                    <div className="flex flex-wrap items-center gap-2">
                        <p className="font-semibold">1.2 rencana kinerja kedua di menu asn</p>
                        <ButtonBlackBorder 
                            onClick={() => handleModalIndikator('1.1 rencana kinerja pertama di menu asn')}
                            className="flex items-center gap-1"
                        >
                            <TbEye />
                            cek indikator
                        </ButtonBlackBorder>
                    </div>
                    <div className="p-2 bg-green-500 rounded-xl min-w-[200px] text-center text-white">Rp. 1.000.000,00</div>
                </div>
                <TableRekinAsn
                    onSuccess={() => setFetchTrigger((prev) => !prev)}
                />
            </div>
            <ModalIndikator 
                isOpen={OpenModalIndikator}
                onClose={() => handleModalIndikator('')}
                isi={Isi}
                data={DataIndikator}
            />
        </div>
    )
}

export const TableRekinAsn:React.FC<TableRekinAsn> = ({ onSuccess }) => {

    const [ModalOpen, setModalOpen] = useState<boolean>(false);
    const [NamaRenaksi, setNamaRenaksi] = useState<string>('');
    const [Anggaran, setAnggaran] = useState<number | string | null>(null);

    const handleModalOpen = (nama: string, anggaran: number) => {
        if(ModalOpen){
            setNamaRenaksi('');
            setModalOpen(false);
            setAnggaran(null);
        } else {
            setNamaRenaksi(nama);
            setModalOpen(true);
            setAnggaran(anggaran);
        }
    }

    return (
        <>
            <div className="flex flex-wrap items-center border-green-500 justify-between rounded-tl-xl rounded-bl-xl border-y border-l py-3 pl-3 w-full">
                <p>renaksi ke 1 : rapat koordinasi</p>
                <div 
                    onClick={() => handleModalOpen('rapat koordinasi', 123123123)} 
                    className="p-2 min-w-[200px] border border-green-500 rounded-xl text-center text-green-500 cursor-pointer hover:bg-green-600 hover:text-white"
                >
                    Rp. 1.000.000,00
                </div>
            </div>
            <div className="flex flex-wrap items-center border-green-500 justify-between rounded-tl-xl rounded-bl-xl border-y border-l py-3 pl-3 w-full">
                <p>renaksi ke 2 : pembentukan tim survey</p>
                <div
                    onClick={() => handleModalOpen('rapat koordinasi', 123123123)} 
                    className="p-2 min-w-[200px] border border-green-500 rounded-xl text-center text-green-500 cursor-pointer hover:bg-green-600 hover:text-white"
                >
                    Rp. 0
                </div>
            </div>
            <ModalAnggaran
                metode="lama"
                isOpen={ModalOpen}
                id={'0'}
                nama_renaksi={NamaRenaksi}
                onClose={() => handleModalOpen('', 0)}
                onSuccess={() => onSuccess}
            />
        </>
    )
}