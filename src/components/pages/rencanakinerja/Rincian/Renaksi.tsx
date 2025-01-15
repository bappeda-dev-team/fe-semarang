'use client'

import { ButtonSky, ButtonSkyBorder, ButtonRedBorder } from "@/components/global/Button";
import { TbPencil, TbTrash } from "react-icons/tb";
import { ModalRenaksi } from "../ModalRenaksi";
import { ModalTahapan } from "../ModalTahapan";
import { useState } from "react";

const Renaksi = () => {

    const [isOpenNewRenaksi, setIsOpenNewRenaksi] = useState<boolean>(false);

    const handleModalNewRenaksi = () => {
        if(isOpenNewRenaksi){
            setIsOpenNewRenaksi(false);
        } else {
            setIsOpenNewRenaksi(true);
        }
    }

    return(
        <>
            {/* rencana aksi */}
            <div className="rounded-b-xl shadow-lg border-x border-b px-5 py-3">
                <div className="flex flex-wrap justify-between items-center">
                    <h1 className="font-bold">Rencana Aksi</h1>
                    <div className="flex flex-wrap">
                        <ButtonSky className="m-1" onClick={() => handleModalNewRenaksi()}>Tambah Tahapan</ButtonSky>
                        {/* <ModalRenaksi isOpen={isOpenNewRenaksi} onClose={handleModalNewRenaksi}/> */}
                        <ModalTahapan isOpen={isOpenNewRenaksi} onClose={handleModalNewRenaksi}/>
                    </div>
                </div>
                <div className="overflow-auto mt-3 rounded-t-xl border">
                    <table className='w-full'>
                        <thead>
                            <tr>
                                <td rowSpan={2} className="border-r border-b px-6 py-3 min-w-[50px]">No</td>
                                <td rowSpan={2} className="border-r border-b px-6 py-3 min-w-[200px]">Tahapan kerja</td>
                                <td rowSpan={2} className="border-r border-b px-6 py-3 min-w-[100px] text-center">Aksi</td>
                                <td colSpan={3} className="border-r border-b px-6 py-3 min-w-[20px]">1</td>
                                <td colSpan={3} className="border-r border-b px-6 py-3 min-w-[20px]">2</td>
                                <td colSpan={3} className="border-r border-b px-6 py-3 min-w-[20px]">3</td>
                                <td colSpan={3} className="border-r border-b px-6 py-3 min-w-[20px]">4</td>
                                <td colSpan={3} className="border-r border-b px-6 py-3 min-w-[20px]">5</td>
                                <td colSpan={3} className="border-r border-b px-6 py-3 min-w-[20px]">6</td>
                                <td colSpan={3} className="border-r border-b px-6 py-3 min-w-[20px]">7</td>
                                <td colSpan={3} className="border-r border-b px-6 py-3 min-w-[20px]">8</td>
                                <td colSpan={3} className="border-r border-b px-6 py-3 min-w-[20px]">9</td>
                                <td colSpan={3} className="border-r border-b px-6 py-3 min-w-[20px]">10</td>
                                <td colSpan={3} className="border-r border-b px-6 py-3 min-w-[20px]">11</td>
                                <td colSpan={3} className="border-r border-b px-6 py-3 min-w-[20px]">12</td>
                                <td colSpan={3} className="border-r border-b px-6 py-3 min-w-[20px]">Total</td>
                                <td rowSpan={2} className="border-b px-6 py-3 min-w-[200px]">Keterangan</td>
                            </tr>
                            <tr className="bg-blue-900 text-white">
                                <td colSpan={3} className="border-r border-b px-6 py-3 min-w-[20px] max-h-[20px] text-center">T</td>
                                <td colSpan={3} className="border-r border-b px-6 py-3 min-w-[20px] max-h-[20px] text-center">T</td>
                                <td colSpan={3} className="border-r border-b px-6 py-3 min-w-[20px] max-h-[20px] text-center">T</td>
                                <td colSpan={3} className="border-r border-b px-6 py-3 min-w-[20px] max-h-[20px] text-center">T</td>
                                <td colSpan={3} className="border-r border-b px-6 py-3 min-w-[20px] max-h-[20px] text-center">T</td>
                                <td colSpan={3} className="border-r border-b px-6 py-3 min-w-[20px] max-h-[20px] text-center">T</td>
                                <td colSpan={3} className="border-r border-b px-6 py-3 min-w-[20px] max-h-[20px] text-center">T</td>
                                <td colSpan={3} className="border-r border-b px-6 py-3 min-w-[20px] max-h-[20px] text-center">T</td>
                                <td colSpan={3} className="border-r border-b px-6 py-3 min-w-[20px] max-h-[20px] text-center">T</td>
                                <td colSpan={3} className="border-r border-b px-6 py-3 min-w-[20px] max-h-[20px] text-center">T</td>
                                <td colSpan={3} className="border-r border-b px-6 py-3 min-w-[20px] max-h-[20px] text-center">T</td>
                                <td colSpan={3} className="border-r border-b px-6 py-3 min-w-[20px] max-h-[20px] text-center">T</td>
                                <td colSpan={3} className="border-r border-b px-6 py-3 min-w-[20px] max-h-[20px] text-center">T</td>
                            </tr>
                        </thead>
                        <tbody className="text-sm">
                            <tr>
                                <td className="border-r border-b px-6 py-4">1</td>
                                <td className="border-r border-b px-6 py-4">Rapat Koordinasi</td>
                                <td className="border-r border-b px-6 py-4">
                                    <div className="flex flex-col justify-center items-center gap-2">
                                       <ButtonSkyBorder className="w-full flex items-center gap-1">
                                          <TbPencil />
                                          Edit
                                       </ButtonSkyBorder>
                                       <ButtonRedBorder className="w-full flex items-center gap-1">
                                          <TbTrash />
                                          Hapus
                                       </ButtonRedBorder>
                                    </div>
                                </td>
                                <td colSpan={3} className="border-r border-b px-6 py-4">
                                   <button className="py-1 px-2 rounded-full hover:bg-gray-300 hover:text-white cursor-pointer">
                                        10
                                   </button>
                                </td>
                                <td colSpan={3} className="border-r border-b px-6 py-4">
                                   <button className="py-1 px-2 rounded-full hover:bg-gray-300 hover:text-white cursor-pointer">
                                        +
                                   </button>
                                </td>
                                <td colSpan={3} className="border-r border-b px-6 py-4">
                                   <button className="py-1 px-2 rounded-full hover:bg-gray-300 hover:text-white cursor-pointer">
                                        +
                                   </button>
                                </td>
                                <td colSpan={3} className="border-r border-b px-6 py-4">
                                   <button className="py-1 px-2 rounded-full hover:bg-gray-300 hover:text-white cursor-pointer">
                                        +
                                   </button>
                                </td>
                                <td colSpan={3} className="border-r border-b px-6 py-4">
                                   <button className="py-1 px-2 rounded-full hover:bg-gray-300 hover:text-white cursor-pointer">
                                        +
                                   </button>
                                </td>
                                <td colSpan={3} className="border-r border-b px-6 py-4">
                                   <button className="py-1 px-2 rounded-full hover:bg-gray-300 hover:text-white cursor-pointer">
                                        +
                                   </button>
                                </td>
                                <td colSpan={3} className="border-r border-b px-6 py-4">
                                   <button className="py-1 px-2 rounded-full hover:bg-gray-300 hover:text-white cursor-pointer">
                                        +
                                   </button>
                                </td>
                                <td colSpan={3} className="border-r border-b px-6 py-4">
                                   <button className="py-1 px-2 rounded-full hover:bg-gray-300 hover:text-white cursor-pointer">
                                        +
                                   </button>
                                </td>
                                <td colSpan={3} className="border-r border-b px-6 py-4">
                                   <button className="py-1 px-2 rounded-full hover:bg-gray-300 hover:text-white cursor-pointer">
                                        +
                                   </button>
                                </td>
                                <td colSpan={3} className="border-r border-b px-6 py-4">
                                   <button className="py-1 px-2 rounded-full hover:bg-gray-300 hover:text-white cursor-pointer">
                                        +
                                   </button>
                                </td>
                                <td colSpan={3} className="border-r border-b px-6 py-4">
                                   <button className="py-1 px-2 rounded-full hover:bg-gray-300 hover:text-white cursor-pointer">
                                        +
                                   </button>
                                </td>
                                <td colSpan={3} className="border-r border-b px-6 py-4">
                                   <button className="py-1 px-2 rounded-full hover:bg-gray-300 hover:text-white cursor-pointer">
                                        +
                                   </button>
                                </td>
                                <td colSpan={3} className="border-r border-b px-6 py-4">
                                   -
                                </td>
                                <td colSpan={3} className="border-r border-b px-6 py-4">
                                   -
                                </td>
                            </tr>
                            <tr>
                                <td colSpan={3} className="border-r border-b px-6 py-1">
                                   Total
                                </td>
                                <td colSpan={3} className="border-r border-b px-6 py-1">
                                   -
                                </td>
                                <td colSpan={3} className="border-r border-b px-6 py-1">
                                   -
                                </td>
                                <td colSpan={3} className="border-r border-b px-6 py-1">
                                   -
                                </td>
                                <td colSpan={3} className="border-r border-b px-6 py-1">
                                   -
                                </td>
                                <td colSpan={3} className="border-r border-b px-6 py-1">
                                   -
                                </td>
                                <td colSpan={3} className="border-r border-b px-6 py-1">
                                   -
                                </td>
                                <td colSpan={3} className="border-r border-b px-6 py-1">
                                   -
                                </td>
                                <td colSpan={3} className="border-r border-b px-6 py-1">
                                   -
                                </td>
                                <td colSpan={3} className="border-r border-b px-6 py-1">
                                   -
                                </td>
                                <td colSpan={3} className="border-r border-b px-6 py-1">
                                   -
                                </td>
                                <td colSpan={3} className="border-r border-b px-6 py-1">
                                   -
                                </td>
                                <td colSpan={3} className="border-r border-b px-6 py-1">
                                   -
                                </td>
                                <td colSpan={3} className="border-r border-b px-6 py-1">
                                   -
                                </td>
                                <td colSpan={3} className="border-r border-b px-6 py-1">
                                   -
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <h1 className="my-2">waktu yang dibutuhkan : 4 Bulan</h1>
                <div className="my-3 border"></div>
                <div className="flex flex-wrap gap-2">
                    <select className="px-3 py-1 rounded-lg border min-w-20">
                        <option value="Dau">Dau</option>
                        <option value="Dau">Dau</option>
                        <option value="Dau">Dau</option>
                    </select>
                    <ButtonSky>ubah</ButtonSky>
                </div>
            </div>
        </>
    )
}

export default Renaksi;