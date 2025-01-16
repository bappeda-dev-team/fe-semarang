'use client'

import { useState, useEffect } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { ButtonSky, ButtonRed } from '@/components/global/Button';

interface renaksi {
    tahapan: number;
}
interface modal {
    isOpen: boolean;
    onClose: () => void;
    className?: string; 
}


export const ModalTahapan: React.FC<modal> = ({isOpen, onClose}) => {

    const {
      control,
      handleSubmit,
      formState: { errors },
    } = useForm<renaksi>();
    
    const [Tahapan, setTahapan] = useState<number | null>(null);

    if(!isOpen){
        return null;
    } else {

    return(
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="fixed inset-0 bg-black opacity-30" onClick={() => {onClose(); setTahapan(null);}}></div>
            <div className={`bg-white rounded-lg p-8 z-10 w-3/5`}>
                <div className="w-max-[500px] py-2 border-b">
                    <h1 className="text-xl uppercase">Target Bulanan</h1>
                </div>
                <div className="flex flex-col justify-center py-3">
                    <label
                        className="uppercase text-xs font-bold text-gray-700 my-2"
                        htmlFor="tahapan"
                    >
                        Target:
                    </label>
                    {/* <div className="border text-center rounded-2xl py-2 my-3 font-bold">{Tahapan}</div> */}
                    <input
                        type="number" 
                        className="border-2 text-center rounded-2xl px-5 py-2 my-3 font-bold hover:border-sky-500 focus:outline-none focus:border-blue-500"
                        value={Tahapan || undefined}
                        onChange={(e) => {
                            setTahapan(Number(e.target.value));
                        }}
                    />
                    <Controller
                        name="tahapan"
                        control={control}
                        render={({ field }) => (
                            <>
                                <input
                                    {...field}
                                    type="range" 
                                    id="tahapan" 
                                    min="0" 
                                    max="100" 
                                    value={Tahapan || undefined}
                                    onChange={(e) => {
                                        setTahapan(Number(e.target.value));
                                    }}
                                    step="1"
                                    className="w-full bg-blue-100 text-black rounded-lg appearance-none cursor-pointer"
                                />
                            </>
                        )}
                    />
                </div>
                <ButtonSky className="w-full my-3">
                    Simpan
                </ButtonSky>
                <ButtonRed className="w-full my-3" onClick={() =>{onClose(); setTahapan(null);}}>
                    Batal
                </ButtonRed>
            </div>
        </div>
    )
    }
}