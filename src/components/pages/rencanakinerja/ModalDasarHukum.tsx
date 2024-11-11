'use client'

import { useState, useEffect } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { ButtonSky, ButtonRed } from '@/components/global/Button';

interface renaksi {
    peraturan_terkait: string;
    uraian: string;
}
interface modal {
    isOpen: boolean;
    onClose: () => void;
    className?: string; 
}


export const ModalDasarHukum: React.FC<modal> = ({isOpen, onClose, className}) => {

    const {
      control,
      handleSubmit,
      formState: { errors },
    } = useForm<renaksi>();
    const [PeraturanTerkait, setPeraturanTerkait] = useState<string>('');
    const [Uraian, setUraian] = useState<string>('');

    if(!isOpen){
        return null;
    } else {

    return(
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className={`fixed inset-0 bg-black opacity-30`} onClick={onClose}></div>
            <div className={`bg-white rounded-lg p-8 z-10 w-4/5 text-start`}>
                <div className="w-max-[500px] py-2 border-b text-center">
                    <h1 className="text-xl uppercase">Tambah Dasar Hukum</h1>
                </div>
                <div className="flex flex-col py-3">
                    <label
                        className="uppercase text-xs font-bold text-gray-700 my-2"
                        htmlFor="peraturan_terkait"
                    >
                        Peraturan Terkait:
                    </label>
                    <Controller
                        name="peraturan_terkait"
                        control={control}
                        render={({ field }) => (
                            <input
                                {...field}
                                className="border px-4 py-2 rounded-lg"
                                id="peraturan_terkait"
                                type="text"
                                placeholder="masukkan Peraturan Terkait"
                                value={field.value || PeraturanTerkait}
                                onChange={(e) => {
                                    field.onChange(e);
                                    setPeraturanTerkait(e.target.value);
                                }}
                            />
                        )}
                    />
                </div>
                <div className="flex flex-col py-3">
                    <label
                        className="uppercase text-xs font-bold text-gray-700 my-2"
                        htmlFor="uraian"
                    >
                        Uraian:
                    </label>
                    <Controller
                        name="uraian"
                        control={control}
                        render={({ field }) => (
                            <textarea
                                {...field}
                                className="border px-4 py-2 rounded-lg"
                                id="uraian"
                                placeholder="masukkan uraian"
                                value={field.value || Uraian}
                                onChange={(e) => {
                                    field.onChange(e);
                                    setUraian(e.target.value);
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