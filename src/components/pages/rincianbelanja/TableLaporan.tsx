'use client'

import { useEffect, useState } from "react";
import { ButtonBlackBorder, ButtonGreen, ButtonGreenBorder, ButtonSky, ButtonSkyBorder } from "@/components/global/Button";
import { TbEye, TbBook, TbKeyFilled, TbPencil, TbPrinter, TbReceipt } from "react-icons/tb";
import { ModalIndikator } from "../Pohon/ModalIndikator";

interface TableLaporan {
    tahun: string;
    kode_opd: string;
    nama_opd?: string;
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

    const [ModalOpen, setModalOpen] = useState<boolean>(false);
    const [Isi, setIsi] = useState<string>('');
    const [DataIndikator, setDataIndikator] = useState<indikator[]>([]);

    const [FetchTrigger, setFetchTrigger] = useState<boolean>(false);

    const handleIndikator = (isi: string, indikator: indikator[]) => {
        if(ModalOpen){
            setModalOpen(false);
            setIsi('');
            setDataIndikator([]);
        } else {
            setModalOpen(true);
            setIsi(isi);
            setDataIndikator(indikator);
        }
    }

    return (
        <div className="overflow-auto m-3 rounded-t-xl border w-full">
            <table className="w-full">
                <thead className="bg-[#99CEF5] text-white">
                    <tr>
                        <th className="border-r border-b px-6 py-3 min-w-[50px]">No</th>
                        <th className="border-r border-b px-6 py-3 min-w-[200px]">Pemilik</th>
                        <th className="border-r border-b px-6 py-3 min-w-[300px]">Rencana Kinerja</th>
                        <th className="border-r border-b px-6 py-3 min-w-[100px]">Tahun</th>
                        <th className="border-r border-b px-6 py-3 min-w-[200px]">Indikator Kinerja</th>
                        <th className="border-r border-b px-6 py-3 min-w-[200px]">Target/Satuan</th>
                        <th className="border-r border-b px-6 py-3 min-w-[200px]">Anggaran</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td className="border-r border-b px-6 py-4">1</td>
                        <td colSpan={5} className="border-r border-b px-6 py-4">
                            <div className="flex items-center gap-2">
                                Subkegiatan: penyusunan dokumen perencanaan perangkat daerah (1.123.123)
                                <ButtonBlackBorder
                                    onClick={() => handleIndikator('penysunan dokumen perencanaan perangkat daerah (1.123.123)', [])}
                                    className="flex items-center gap-2"
                                >
                                    <TbEye />
                                    cek indikator
                                </ButtonBlackBorder>
                            </div>
                        </td>
                        <td className="border-r border-b px-6 py-4">Rp. 0,0</td>
                    </tr>
                    <tr>
                        <td className="border-r border-b px-6 py-4">1.1</td>
                        <td className="border-r border-b px-6 py-4">Adi Sucipto</td>
                        <td className="border-r border-b px-6 py-4">tersusun dokumen rancangan aplikasi rencana kinerja terintegrasi</td>
                        <td className="border-r border-b px-6 py-4 text-center">2024</td>
                        <td className="border-r border-b px-6 py-4">dokumen rancangan aplikasi</td>
                        <td className="border-r border-b px-6 py-4 text-center">1 Dokument</td>
                        <td className="border-r border-b px-6 py-4">Rp. 0,0</td>
                    </tr>
                    <tr>
                        <td colSpan={6} className="border-r border-b px-6 py-4">renaksi 1: rapat koordinasi</td>
                        <td className="border-r border-b px-6 py-4">Rp. 0,0</td>
                    </tr>
                    <tr>
                        <td colSpan={6} className="border-r border-b px-6 py-4">renaksi 2: penyusunan KAK pengadaan paket pengerjaan</td>
                        <td className="border-r border-b px-6 py-4">Rp. 0,0</td>
                    </tr>
                    <tr>
                        <td colSpan={6} className="border-r border-b px-6 py-4">renaksi 3: Penyusunan tim pengadaan</td>
                        <td className="border-r border-b px-6 py-4">Rp. 0,0</td>
                    </tr>
                </tbody>
                <tbody>
                    <tr>
                        <td className="border-r border-b px-6 py-4">1</td>
                        <td colSpan={5} className="border-r border-b px-6 py-4">
                            <div className="flex items-center gap-2">
                                Subkegiatan: penyusunan dokumen perencanaan perangkat daerah (1.123.123)
                                <ButtonBlackBorder
                                    onClick={() => handleIndikator('penysunan dokumen perencanaan perangkat daerah (1.123.123)', [])}
                                    className="flex items-center gap-2"
                                >
                                    <TbEye />
                                    cek indikator
                                </ButtonBlackBorder>
                            </div>
                        </td>
                        <td className="border-r border-b px-6 py-4">Rp. 0,0</td>
                    </tr>
                    <tr>
                        <td className="border-r border-b px-6 py-4">1.1</td>
                        <td className="border-r border-b px-6 py-4">Adi Sucipto</td>
                        <td className="border-r border-b px-6 py-4">tersusun dokumen rancangan aplikasi rencana kinerja terintegrasi</td>
                        <td className="border-r border-b px-6 py-4 text-center">2024</td>
                        <td className="border-r border-b px-6 py-4">dokumen rancangan aplikasi</td>
                        <td className="border-r border-b px-6 py-4 text-center">1 Dokument</td>
                        <td className="border-r border-b px-6 py-4">Rp. 0,0</td>
                    </tr>
                    <tr>
                        <td colSpan={6} className="border-r border-b px-6 py-4">renaksi 1: rapat koordinasi</td>
                        <td className="border-r border-b px-6 py-4">Rp. 0,0</td>
                    </tr>
                    <tr>
                        <td colSpan={6} className="border-r border-b px-6 py-4">renaksi 2: penyusunan KAK pengadaan paket pengerjaan</td>
                        <td className="border-r border-b px-6 py-4">Rp. 0,0</td>
                    </tr>
                    <tr>
                        <td colSpan={6} className="border-r border-b px-6 py-4">renaksi 3: Penyusunan tim pengadaan</td>
                        <td className="border-r border-b px-6 py-4">Rp. 0,0</td>
                    </tr>
                </tbody>
            </table>
            <ModalIndikator 
                isOpen={ModalOpen}
                onClose={() => handleIndikator('', [])}
                isi={Isi}
                data={DataIndikator}
            />
        </div>
    )
}