
import { ButtonRed } from '@/components/global/Button';
import { TbX } from "react-icons/tb";


interface modal {
    isOpen: boolean;
    onClose: () => void;
    isi: string;
    target: string | number;
    satuan: string;
    jenis: 'Sub Kegiatan' | 'Program' | 'Kegiatan'
}


export const ModalIndikator: React.FC<modal> = ({ isOpen, onClose, jenis, isi, target, satuan }) => {

    if (!isOpen) {
        return null;
    } else {

        return (
            <div className="fixed inset-0 flex items-center justify-center z-50">
                <div className="fixed inset-0 bg-black opacity-30" onClick={onClose}></div>
                <div className={`flex flex-col gap-2 bg-white rounded-lg p-8 z-10 w-4/5`}>
                    <div className="flex items-center justify-between w-max-[500px] py-2 border-b">
                        <h1 className="text-xl uppercase">Detail Indikator</h1>
                        <ButtonRed onClick={onClose} className="py-2"><TbX /></ButtonRed>
                    </div>
                    <div className="overflow-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-black text-white">
                                    <th className="border-r border-b px-6 py-3 min-w-[400px]">{jenis}</th>
                                    <th className="border-r border-b px-6 py-3 min-w-[100px]">Target</th>
                                    <th className="border-r border-b px-6 py-3 min-w-[100px]">Satuan</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className="border border-emerald-500 px-6 py-4">
                                        <p>{isi}</p>
                                    </td>
                                    <td className="border border-emerald-500 px-6 py-4">
                                        <p>{target}</p>
                                    </td>
                                    <td className="border border-emerald-500 px-6 py-4">
                                        <p>{satuan}</p>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div >
        )
    }
}