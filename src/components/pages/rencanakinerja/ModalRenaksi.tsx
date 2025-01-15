'use client'

import { useState, useEffect } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { ButtonSky, ButtonRed } from '@/components/global/Button';

interface renaksi {
    urutan: number;
    nama_rencana_aksi: string;
}
interface modal {
    isOpen: boolean;
    onClose: () => void;
    className?: string; 
}


export const ModalRenaksi: React.FC<modal> = ({isOpen, onClose, className}) => {

    const {
      control,
      handleSubmit,
      formState: { errors },
    } = useForm<renaksi>();
    const [namaRenaksi, setNamaRenaksi] = useState<string>('');
    const [urutan, setUrutan] = useState<number>(0);

    if(!isOpen){
        return null;
    } else {

    return(
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="fixed inset-0 bg-black opacity-30" onClick={onClose}></div>
            <div className={`bg-white rounded-lg p-8 z-10 w-4/5`}>
                <div className="w-max-[500px] py-2 border-b">
                    <h1 className="text-xl uppercase">Tambah Tahapan</h1>
                </div>
                <div className="flex flex-col py-3">
                    <label
                        className="uppercase text-xs font-bold text-gray-700 my-2"
                        htmlFor="nama_rencana_aksi"
                    >
                        Tahapan:
                    </label>
                    <Controller
                        name="nama_rencana_aksi"
                        control={control}
                        render={({ field }) => (
                            <input
                                {...field}
                                className="border px-4 py-2 rounded-lg"
                                id="nama_rencana_aksi"
                                type="text"
                                placeholder="masukkan Tahapan Rencana Aksi"
                                value={field.value || namaRenaksi}
                                onChange={(e) => {
                                    field.onChange(e);
                                    setNamaRenaksi(e.target.value);
                                }}
                            />
                        )}
                    />
                </div>
                <div className="flex flex-col py-3">
                    <label
                        className="uppercase text-xs font-bold text-gray-700 my-2"
                        htmlFor="urutan"
                    >
                        Urutan:
                    </label>
                    <Controller
                        name="urutan"
                        control={control}
                        render={({ field }) => (
                            <input
                                {...field}
                                className="border px-4 py-2 rounded-lg"
                                id="urutan"
                                type="number"
                                placeholder="masukkan Urutan"
                                value={field.value || urutan}
                                onChange={(e) => {
                                    field.onChange(e);
                                    setUrutan(Number(e.target.value));
                                }}
                            />
                        )}
                    />
                </div>
                <ButtonSky className="w-full my-3">
                    Simpan
                </ButtonSky>
                <ButtonRed className="w-full my-3" onClick={onClose}>
                    Batal
                </ButtonRed>
            </div>
        </div>
    )
    }
}