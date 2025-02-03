'use client'

import { useState, useEffect } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { ButtonSky, ButtonRed } from '@/components/global/Button';
import { AlertNotification } from "@/components/global/Alert";
import { getToken, getUser } from "@/components/lib/Cookie";
import { LoadingButtonClip } from "@/components/global/Loading";
import Select from "react-select";

interface OptionType {
    value: number;
    label: string;
}
interface OptionMusrenbang {
    value: number;
    label: string;
    alamat: string;
    uraian: string;
    tahun: string;
}
interface modal {
    isOpen: boolean;
    onClose: () => void;
    className?: string;
    id?: string;
}

interface FormValue {
    usulan: OptionType | null | string;
}


export const ModalAddUsulan: React.FC<modal> = ({ isOpen, onClose }) => {

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<FormValue>();
    const [user, setUser] = useState<any>(null);

    const [JenisUsulan, setJenisUsulan] = useState<string>('');

    const [UsulanMusrenbang, setUsulanMusrenbang] = useState<OptionMusrenbang | null>(null);
    const [OptionMusrenbang, setOptionMusrenbang] = useState<OptionMusrenbang[]>([]);
    
    const [UsulanPokir, setUsulanPokir] = useState<OptionMusrenbang | null>(null);
    const [OptionPokir, setOptionPokir] = useState<OptionMusrenbang[]>([]);
    
    const [LoadingOption, setLoadingOption] = useState<boolean>(false);
    const [Proses, setProses] = useState<boolean>(false);
    const token = getToken();

    useEffect(() => {
        const fetchUser = getUser();
        if (fetchUser) {
            setUser(fetchUser.user);
        }
    }, []);

    const fetchMusrenbang = async () => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        try {
            setLoadingOption(true);
            const response = await fetch(`${API_URL}/usulan_musrebang/findall`, {
                headers: {
                    Authorization: `${token}`,
                }
            });
            if (!response.ok) {
                throw new Error("terdapat kesalahan server ketika fetch data dropdown musrenbang");
            }
            const hasil = await response.json();
            const data = hasil.usulan_musrebang;
            if (data.length != 0) {
                const option = data.map((item: any) => ({
                    value: item.id,
                    label: item.usulan,
                    alamat: item.alamat,
                    uraian: item.uraian,
                    tahun: item.tahun,
                }))
                setOptionMusrenbang(option);
            } else {
                console.log('dropdown musrenbang kosong');
            }
        } catch (err) {
            console.log(err, 'gagal mendapatkan data dropdown musrenbang, cek endpoint backend atau database server');
        } finally {
            setLoadingOption(false);
        }
    }

    const onSubmit: SubmitHandler<FormValue> = async (data) => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        const formData = {
            //key : value
            usulan: UsulanMusrenbang?.value,
        };
        console.log(formData);
        // try{
        //     setProses(true);
        //     const response = await fetch(`${API_URL}/gambaran_umum/create/${id_rekin}`, {
        //         method: "POST",
        //         headers: {
        //             Authorization: `${token}`,
        //             'Content-Type': 'application/json',
        //         },
        //         body: JSON.stringify(formData),
        //     });
        //     if(response.ok){
        //         AlertNotification("Berhasil", "Berhasil menambahkan gambaran umum", "success", 1000);
        //         onClose();
        //     } else {
        //         AlertNotification("Gagal", "terdapat kesalahan pada backend / database server", "error", 2000);
        //     }
        // } catch(err){
        //     AlertNotification("Gagal", "cek koneksi internet/terdapat kesalahan pada database server", "error", 2000);
        // } finally {
        //     setProses(false);
        // }
    };

    const handleClose = () => {
        onClose();
        setJenisUsulan('');
        setUsulanMusrenbang(null);
        setUsulanPokir(null);
    }

    if (!isOpen) {
        return null;
    } else {

        return (
            <div className="fixed inset-0 flex items-center justify-center z-50">
                <div className="fixed inset-0 bg-black opacity-30" onClick={handleClose}></div>
                <div className={`bg-white rounded-lg p-8 z-10 w-4/5`}>
                    <div className="flex justify-center w-max-[500px] py-2 border-b">
                        <h1 className="text-xl uppercase">Tambah Usulan</h1>
                    </div>
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="flex flex-col mx-5 py-5"
                    >
                        <label className="uppercase text-xs font-bold text-gray-700 my-2">pilih jenis usulan yang ingin ditambahkan</label>
                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={() =>{
                                    setJenisUsulan('musrenbang');
                                    setOptionMusrenbang([]);
                                    setUsulanPokir(null);
                                }}
                                className={`px-2 py-1 rounded-xl border ${JenisUsulan === 'musrenbang' ? "bg-blue-500 text-white" : "bg-white text-blue-500 border border-blue-500 hover:text-white hover:bg-blue-500"}`}
                            >
                                Musrenbang
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setJenisUsulan('pokir');
                                    setUsulanMusrenbang(null);
                                }}
                                className={`px-2 py-1 rounded-xl border ${JenisUsulan === 'pokir' ? "bg-blue-500 text-white" : "bg-white text-blue-500 border border-blue-500 hover:text-white hover:bg-blue-500"}`}
                            >
                                Pokok Pikiran
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setJenisUsulan('inisiatif');
                                    setUsulanMusrenbang(null);
                                    setUsulanPokir(null);
                                }}
                                className={`px-2 py-1 rounded-xl border ${JenisUsulan === 'inisiatif' ? "bg-blue-500 text-white" : "bg-white text-blue-500 border border-blue-500 hover:text-white hover:bg-blue-500"}`}
                            >
                                Inisiatif
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setJenisUsulan('mandatori');
                                    setUsulanMusrenbang(null);
                                    setUsulanPokir(null);
                                }}
                                className={`px-2 py-1 rounded-xl border ${JenisUsulan === 'mandatori' ? "bg-blue-500 text-white" : "bg-white text-blue-500 border border-blue-500 hover:text-white hover:bg-blue-500"}`}
                            >
                                Mandatori
                            </button>
                        </div>
                        {/* MUSRENBANG */}
                        {(JenisUsulan === 'musrenbang') &&
                            <>
                                <div className="flex flex-col py-3">
                                    <label
                                        className="uppercase text-xs font-bold text-gray-700 my-2"
                                        htmlFor="usulan"
                                    >
                                        Usulan Musrenbang :
                                    </label>
                                    <Controller
                                        name="usulan"
                                        control={control}
                                        rules={{ required: "Wajib Terisi" }}
                                        render={({ field }) => (
                                            <>
                                                <Select
                                                    {...field}
                                                    placeholder="Pilih usulan musrenbang"
                                                    value={UsulanMusrenbang}
                                                    options={OptionMusrenbang}
                                                    isLoading={LoadingOption}
                                                    isSearchable
                                                    isClearable
                                                    onMenuOpen={() => {
                                                        fetchMusrenbang();
                                                    }}
                                                    onChange={(option) => {
                                                        field.onChange(option);
                                                        setUsulanMusrenbang(option);
                                                    }}
                                                    styles={{
                                                        control: (baseStyles) => ({
                                                            ...baseStyles,
                                                            borderRadius: '8px',
                                                        })
                                                    }}
                                                />
                                                {errors.usulan &&
                                                    <h1 className="text-red-500">
                                                        {errors.usulan.message}
                                                    </h1>
                                                }
                                            </>
                                        )}
                                    />
                                </div>
                                <div className={`transition-all duration-300 ease-in-out ${UsulanMusrenbang ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0 pointer-events-none'}`}>
                                    preview usulan :
                                    <div className="flex flex-col rounded-lg border border-black p-2 mt-2">
                                        <table>
                                            <tbody>
                                                <tr className="border border-black">
                                                    <td className="p-2 font-medium">Usulan</td>
                                                    <td className="p-2">:</td>
                                                    <td className="p-2"><h1>{UsulanMusrenbang?.label}</h1></td>
                                                </tr>
                                                <tr className="border border-black">
                                                    <td className="p-2 font-medium">Alamat</td>
                                                    <td className="p-2">:</td>
                                                    <td className="p-2"><h1>{UsulanMusrenbang?.alamat}</h1></td>
                                                </tr>
                                                <tr className="border border-black">
                                                    <td className="p-2 font-medium">Uraian</td>
                                                    <td className="p-2">:</td>
                                                    <td className="p-2"><h1>{UsulanMusrenbang?.uraian}</h1></td>
                                                </tr>
                                                <tr className="border border-black">
                                                    <td className="p-2 font-medium">Tahun</td>
                                                    <td className="p-2">:</td>
                                                    <td className="p-2"><h1>{UsulanMusrenbang?.tahun}</h1></td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div> 
                                </div>
                            </>
                        }
                        {/* POKIR */}
                        {(JenisUsulan === 'pokir') &&
                            <>
                                <div className="flex flex-col py-3">
                                    <label
                                        className="uppercase text-xs font-bold text-gray-700 my-2"
                                        htmlFor="usulan"
                                    >
                                        Usulan Pokok Pikiran :
                                    </label>
                                    <Controller
                                        name="usulan"
                                        control={control}
                                        rules={{ required: "Wajib Terisi" }}
                                        render={({ field }) => (
                                            <>
                                                <Select
                                                    {...field}
                                                    placeholder="Pilih usulan Pokok Pikiran"
                                                    value={UsulanMusrenbang}
                                                    options={OptionMusrenbang}
                                                    isLoading={LoadingOption}
                                                    isSearchable
                                                    isClearable
                                                    onMenuOpen={() => {
                                                        fetchMusrenbang();
                                                    }}
                                                    onChange={(option) => {
                                                        field.onChange(option);
                                                        setUsulanMusrenbang(option);
                                                    }}
                                                    styles={{
                                                        control: (baseStyles) => ({
                                                            ...baseStyles,
                                                            borderRadius: '8px',
                                                        })
                                                    }}
                                                />
                                                {errors.usulan &&
                                                    <h1 className="text-red-500">
                                                        {errors.usulan.message}
                                                    </h1>
                                                }
                                            </>
                                        )}
                                    />
                                </div>
                                <div className={`transition-all duration-300 ease-in-out ${UsulanMusrenbang ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0 pointer-events-none'}`}>
                                    preview usulan :
                                    <div className="flex flex-col rounded-lg border border-black p-2 mt-2">
                                        <table>
                                            <tbody>
                                                <tr className="border border-black">
                                                    <td className="p-2 font-medium">Usulan</td>
                                                    <td className="p-2">:</td>
                                                    <td className="p-2"><h1>{UsulanMusrenbang?.label}</h1></td>
                                                </tr>
                                                <tr className="border border-black">
                                                    <td className="p-2 font-medium">Alamat</td>
                                                    <td className="p-2">:</td>
                                                    <td className="p-2"><h1>{UsulanMusrenbang?.alamat}</h1></td>
                                                </tr>
                                                <tr className="border border-black">
                                                    <td className="p-2 font-medium">Uraian</td>
                                                    <td className="p-2">:</td>
                                                    <td className="p-2"><h1>{UsulanMusrenbang?.uraian}</h1></td>
                                                </tr>
                                                <tr className="border border-black">
                                                    <td className="p-2 font-medium">Tahun</td>
                                                    <td className="p-2">:</td>
                                                    <td className="p-2"><h1>{UsulanMusrenbang?.tahun}</h1></td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div> 
                                </div>
                            </>
                        }
                        {(JenisUsulan === 'inisiatif') &&
                            <h1>inisiatif</h1>
                        }
                        {(JenisUsulan === 'mandatori') &&
                            <h1>mandatori</h1>
                        }
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
                        <ButtonRed className="w-full mb-3" type="button" onClick={handleClose}>
                            Batal
                        </ButtonRed>
                    </form>
                </div>
            </div>
        )
    }
}
