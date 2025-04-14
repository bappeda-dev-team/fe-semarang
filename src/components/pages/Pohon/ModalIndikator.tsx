import React from 'react';
import { ButtonRed } from '@/components/global/Button';
import { TbX } from "react-icons/tb";


interface modal {
    isOpen: boolean;
    onClose: () => void;
    data: indikator[];
    isi: string;
}
interface indikator {
    id_indikator: string;
    kode: string;
    id_rekin: string;
    nama_indikator: string;
    targets: target[];
}
interface target {
    id_target: string;
    indikator_id: string;
    target: string;
    satuan: string;
}


export const ModalIndikator: React.FC<modal> = ({ isOpen, onClose, data, isi }) => {

    if (!isOpen) {
        return null;
    } else {

        return (
            <div className="fixed inset-0 flex items-center justify-center z-50">
                <div className="fixed inset-0 bg-black opacity-30" onClick={onClose}></div>
                <div className={`flex flex-col gap-2 bg-white rounded-lg p-6 z-10 w-4/5`}>
                    <div className="flex items-center justify-between w-max-[500px] py-2 border-b">
                        <h1 className="text-xl text-start uppercase">{isi}</h1>
                        <ButtonRed onClick={onClose} className="py-2"><TbX /></ButtonRed>
                    </div>
                    <div className="overflow-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-black text-white">
                                    <th className="border-r border-b border-white px-6 py-3 min-w-[400px]">Indikator</th>
                                    <th className="border-r border-b border-white px-6 py-3 min-w-[100px]">Target</th>
                                    <th className="border-r border-b border-white px-6 py-3 min-w-[100px]">Satuan</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.length === 0 ?
                                    <tr>
                                        <td colSpan={3} className="border border-black px-6 py-4">
                                            <p>indikator belum di tambahkan</p>
                                        </td>
                                    </tr>
                                    :
                                    data.map((data: indikator, index: number) => (
                                        <tr key={index}>
                                            <td className="border border-black px-6 py-4">
                                                <p>{data.nama_indikator || '-'}</p>
                                            </td>
                                            {data.targets === null ?
                                                <React.Fragment>
                                                    <td className="border border-black px-6 py-4">
                                                        <p>-</p>
                                                    </td>
                                                    <td className="border border-black px-6 py-4">
                                                        <p>-</p>
                                                    </td>
                                                </React.Fragment>
                                                :
                                                data.targets.map((t: target, t_index) => (
                                                    <React.Fragment key={t_index}>
                                                        <td className="border border-black px-6 py-4">
                                                            <p>{t.target || "-"}</p>
                                                        </td>
                                                        <td className="border border-black px-6 py-4">
                                                            <p>{t.satuan || "-"}</p>
                                                        </td>
                                                    </React.Fragment>
                                                ))
                                            }
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div >
        )
    }
}