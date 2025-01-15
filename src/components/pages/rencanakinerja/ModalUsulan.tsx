'use client'

import { useState, useEffect } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { ButtonSky, ButtonRed } from '@/components/global/Button';
import { AlertNotification } from "@/components/global/Alert";
import { getToken, getUser } from "@/components/lib/Cookie";
import { LoadingButtonClip } from "@/components/global/Loading";

interface OptionType {
    value: number;
    label: string;
}

interface modal {
    isOpen: boolean;
    onClose: () => void;
    className?: string;
    id?: string;
}


export const ModalAddUsulan: React.FC<modal> = ({isOpen, onClose}) => {

    const [user, setUser] = useState<any>(null);

    const [JenisUsulan, setJenisUsulan] = useState<string>('');
    const [OptionMusrenbang, setOptionMusrenbang] = useState<OptionType[]>([]);

    const [Loading, setLoading] = useState<boolean>(false);
    const [Proses, setProses] = useState<boolean>(false);
    const token = getToken();

    useEffect(() => {
        const fetchUser = getUser();
        if(fetchUser){
            setUser(fetchUser.user);
        }
    },[]);

    const fetchMusrenbang = async() => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        try{
            setLoading(true);
            const response = await fetch(`${API_URL}/usulan_musrebang/findall`, {
                headers: {
                    Authirization : `${token}`,
                }
            });
            if(!response.ok){
                throw new Error("terdapat kesalahan server ketika fetch data dropdown musrenbang");
            }
            const hasil = await response.json();
            const data = hasil.usulan_musrebang;
            if(data.length != 0){
                setOptionMusrenbang(data);
            } else {
                console.log('dropdown musrenbang kosong');
            }
        } catch(err) {
            console.log(err, 'gagal mendapatkan data dropdown musrenbang, cek endpoint backend atau database server');
        } finally {
            setLoading(false);
        }
    }

    // const onSubmit: SubmitHandler<FormValue> = async (data) => {
    //     const API_URL = process.env.NEXT_PUBLIC_API_URL;
    //     const formData = {
    //         //key : value
    //         rekin_id: id_rekin,
    //         pegawai_id: user?.pegawai_id,
    //         kode_opd: user?.kode_opd,
    //         gambaran_umum : data.gambaran_umum,
    //     };
    //     // console.log(formData);
    //     try{
    //         setProses(true);
    //         const response = await fetch(`${API_URL}/gambaran_umum/create/${id_rekin}`, {
    //             method: "POST",
    //             headers: {
    //                 Authorization: `${token}`,
    //                 'Content-Type': 'application/json',
    //             },
    //             body: JSON.stringify(formData),
    //         });
    //         if(response.ok){
    //             AlertNotification("Berhasil", "Berhasil menambahkan gambaran umum", "success", 1000);
    //             onClose();
    //         } else {
    //             AlertNotification("Gagal", "terdapat kesalahan pada backend / database server", "error", 2000);
    //         }
    //     } catch(err){
    //         AlertNotification("Gagal", "cek koneksi internet/terdapat kesalahan pada database server", "error", 2000);
    //     } finally {
    //         setProses(false);
    //     }
    // };

    if(!isOpen){
        return null;
    } else {

    return(
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="fixed inset-0 bg-black opacity-30" onClick={() => {onClose(); setJenisUsulan('');}}></div>
            <div className={`bg-white rounded-lg p-8 z-10 w-4/5`}>
                <div className="flex justify-center w-max-[500px] py-2 border-b">
                    <h1 className="text-xl uppercase">Tambah Usulan</h1>
                </div>
                <form
                    className="flex flex-col mx-5 py-5"
                >
                    <label className="uppercase text-xs font-bold text-gray-700 my-2">pilih jenis usulan yang ingin ditambahkan</label>
                    <div className="flex gap-3">
                        <button 
                            type="button" 
                            onClick={() => setJenisUsulan('mandatori')} 
                            className={`px-2 py-1 rounded-xl border ${JenisUsulan === 'mandatori' ? "bg-blue-500 text-white" : "bg-white text-blue-500 border border-blue-500 hover:text-white hover:bg-blue-500"}`}
                        >
                            Mandatori
                        </button>
                        <button 
                            type="button" 
                            onClick={() => setJenisUsulan('pokir')} 
                            className={`px-2 py-1 rounded-xl border ${JenisUsulan === 'pokir' ? "bg-blue-500 text-white" : "bg-white text-blue-500 border border-blue-500 hover:text-white hover:bg-blue-500"}`}
                        >
                            Pokok Pikiran
                        </button>
                        <button 
                            type="button" 
                            onClick={() => setJenisUsulan('musrenbang')} 
                            className={`px-2 py-1 rounded-xl border ${JenisUsulan === 'musrenbang' ? "bg-blue-500 text-white" : "bg-white text-blue-500 border border-blue-500 hover:text-white hover:bg-blue-500"}`}
                        >
                            Musrenbang
                        </button>
                        <button 
                            type="button" 
                            onClick={() => setJenisUsulan('inisiatif')} 
                            className={`px-2 py-1 rounded-xl border ${JenisUsulan === 'inisiatif' ? "bg-blue-500 text-white" : "bg-white text-blue-500 border border-blue-500 hover:text-white hover:bg-blue-500"}`}
                        >
                            Inisiatif
                        </button>
                    </div>
                    <ButtonSky className="w-full my-3" type="submit">
                        {Proses ? 
                            <span className="flex">
                                <LoadingButtonClip />
                                Menyimpan...
                            </span> 
                        :
                            "Simpan"
                        }
                    </ButtonSky>
                    <ButtonRed className="w-full mb-3" type="button" onClick={() => {onClose(); setJenisUsulan('');}}>
                        Batal
                    </ButtonRed>
                </form>
            </div>
        </div>
    )
    }
}
