'use client'

import { useEffect, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { ButtonSky, ButtonRed } from '@/components/global/Button';
import { getToken } from "@/components/lib/Cookie";
import { LoadingButtonClip } from "@/components/global/Loading";
import { AlertNotification } from "@/components/global/Alert";

interface FormValue {
    anggaran: number;
}

interface modal {
    isOpen: boolean;
    onClose: () => void;
    metode: 'lama' | 'baru';
    id?: string;
    nama_renaksi: string;
    anggaran: number | null;
    onSuccess: () => void;
}


export const ModalAnggaran: React.FC<modal> = ({ isOpen, onClose, nama_renaksi, anggaran, id, metode, onSuccess }) => {

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<FormValue>();
    const token = getToken();

    const [Anggaran, setAnggaran] = useState<number | null>(null);
    const [Proses, setProses] = useState<boolean>(false);

    useEffect(() => {
        setAnggaran(anggaran);
    }, [anggaran]);

    const onSubmit: SubmitHandler<FormValue> = async () => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        const formDataNew = {
            //key : value
            renaksi_id: id,
            anggaran: Anggaran,
        };
        const formDataEdit = {
            //key : value
            renaksi_id: id,
            anggaran: Anggaran,
        };
        const getBody = () => {
            if (metode === "lama") return formDataEdit;
            if (metode === "baru") return formDataNew;
            return {}; // Default jika metode tidak sesuai
        };
        // metode === 'baru' && console.log("baru :", formDataNew);
        // metode === 'lama' && console.log("lama :", formDataEdit);
        if(Anggaran === 0 || Anggaran === null){
            AlertNotification("Anggaran tidak boleh 0", "", "warning", 3000);
        } else {
            try {
                let url = "";
                if (metode === "lama") {
                    url = `rincian_belanja/update/${id}`;
                } else if (metode === "baru") {
                    url = `rincian_belanja/create`;
                } else {
                    url = '';
                }
                setProses(true);
                const response = await fetch(`${API_URL}/${url}`, {
                    method: metode === 'lama' ? "PUT" : "POST",
                    headers: {
                        Authorization: `${token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(getBody()),
                });
                const result = await response.json();
                if (result.code === 200 || result.code === 201) {
                    AlertNotification("Berhasil", `Berhasil ${metode === 'baru' ? "Menambahkan" : "Mengubah"} Anggaran Renaksi`, "success", 1000);
                    onClose();
                    onSuccess();
                } else {
                    AlertNotification("Gagal", `${result.data}`, "error", 2000);
                }
            } catch (err) {
                AlertNotification("Gagal", "cek koneksi internet/terdapat kesalahan pada database server", "error", 2000);
            } finally {
                setProses(false);
            }
        }
    };

    const handleClose = () => {
        onClose();
        onSuccess();
        setAnggaran(0);
    }

    if (!isOpen) {
        return null;
    } else {

        return (
            <div className="fixed inset-0 flex items-center justify-center z-50">
                <div className="fixed inset-0 bg-black opacity-30" onClick={handleClose}></div>
                <div className={`bg-white rounded-lg p-8 z-10 w-4/5`}>
                    <div className="w-max-[500px] py-2 border-b">
                        <h1 className="text-xl uppercase text-center">Edit Anggaran Renaksi</h1>
                    </div>
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="flex flex-col mx-5 py-5"
                    >
                        <div className="flex flex-col py-3">
                            <label
                                className="uppercase text-xs font-bold text-gray-700 my-2"
                            >
                                Nama Tahapan Rencana Aksi :
                            </label>
                            <div className="border px-4 py-2 rounded-lg">{nama_renaksi}</div>
                        </div>
                        <div className="flex flex-col py-3">
                            <label
                                className="uppercase text-xs font-bold text-gray-700 my-2"
                                htmlFor="anggaran"
                            >
                                Anggaran (Rp.):
                            </label>
                            <Controller
                                name="anggaran"
                                control={control}
                                render={({ field }) => (
                                    <input
                                        {...field}
                                        className="border px-4 py-2 rounded-lg"
                                        id="anggaran"
                                        type="number"
                                        placeholder="masukkan anggaran tahapan renaksi"
                                        value={Anggaran === null ? "" : Anggaran}
                                        onChange={(e) => {
                                            field.onChange(e);
                                            setAnggaran(Number(e.target.value));
                                        }}
                                    />
                                )}
                            />
                        </div>
                        <ButtonSky className="w-full mt-3 mb-2" type="submit">
                            {Proses ?
                                <span className="flex">
                                    <LoadingButtonClip />
                                    Menyimpan...
                                </span>
                                :
                                "Simpan"
                            }
                        </ButtonSky>
                        <ButtonRed className="w-full mb-3" onClick={handleClose}>
                            Batal
                        </ButtonRed>
                    </form>
                </div>
            </div>
        )
    }
}