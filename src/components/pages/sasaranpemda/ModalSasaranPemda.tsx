'use client'

import React, { useState, useEffect } from "react";
import { Controller, SubmitHandler, useForm, useFieldArray } from "react-hook-form";
import { ButtonSky, ButtonRed, ButtonSkyBorder, ButtonRedBorder } from '@/components/global/Button';
import { getToken } from "@/components/lib/Cookie";
import { LoadingButtonClip } from "@/components/global/Loading";
import Select from 'react-select';
import { AlertNotification, AlertQuestion } from "@/components/global/Alert";

interface OptionType {
    value: number;
    label: string;
}

interface FormValue {
    subtema_id: OptionType;
    tujuan_pemda_id: OptionType;
    sasaran_pemda: string;
}

interface modal {
    isOpen: boolean;
    onClose: () => void;
    metode: 'lama' | 'baru';
    id?: number;
    tahun: number;
    jenis_pohon: string;
    subtema_id: number;
    nama_pohon: string;
    onSuccess: () => void;
}


export const ModalSasaranPemda: React.FC<modal> = ({ isOpen, onClose, id, tahun, subtema_id, nama_pohon, jenis_pohon, metode, onSuccess }) => {

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<FormValue>();

    const token = getToken();

    const [SasaranPemda, setSasaranPemda] = useState<string>('');
    const [JenisPohon, setJenisPohon] = useState<string>('');
    const [TujuanPemda, setTujuanPemda] = useState<OptionType | null>(null);
    const [OptionTujuanPemda, setOptionTujuanPemda] = useState<OptionType[]>([]);

    const [Proses, setProses] = useState<boolean>(false);
    const [Loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        const fetchSasaranPemda = async () => {
            try {
                const response = await fetch(`${API_URL}/sasaran_pemda/detail/${id}`, {
                    headers: {
                        Authorization: `${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                const result = await response.json();
                const hasil = result.data;
                if(hasil.sasaran_pemda){
                    setSasaranPemda(hasil.sasaran_pemda);
                }
                if(hasil.tujuan_pemda){
                    const tujuanpemda = {
                        value: hasil.tujuan_pemda_id,
                        label: hasil.tujuan_pemda,
                    }
                    setTujuanPemda(tujuanpemda);
                }
                if(hasil.jenis_pohon){
                    setJenisPohon(hasil.jenis_pohon);
                }
            } catch (err) {
                console.log(err);
            }
        };
        if (isOpen && metode === 'lama') {
            fetchSasaranPemda();
        }
    }, [id, token, isOpen, metode]);

    const fetchOptionTujuanPemda = async () => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        setLoading(true);
        try {
            const response = await fetch(`${API_URL}/tujuan_pemda/findall_with_pokin/${tahun}`, {
                headers: {
                    Authorization: `${token}`,
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                throw new Error('error fetch option tujuan pemda dengan response !ok');
            }
            const result = await response.json();
            const hasil = result.data;
            const data = hasil
                .filter((item: any) => item.tujuan_pemda) // Filter item yang memiliki tujuan_pemda
                .map((item: any) => ({
                    value: item.tujuan_pemda.id,
                    label: item.tujuan_pemda.tujuan_pemda,
                }));
            setOptionTujuanPemda(data);
        } catch (err) {
            console.log('error saat fetch option tujuan pemda');
        } finally {
            setLoading(false);
        }
    }

    const onSubmit: SubmitHandler<FormValue> = async (data) => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        const formDataNew = {
            //key : value
            subtema_id: subtema_id,
            tujuan_pemda_id: TujuanPemda?.value,
            sasaran_pemda: SasaranPemda,
        };
        const formDataEdit = {
            //key : value
            id: id,
            subtema_id: subtema_id,
            tujuan_pemda_id: TujuanPemda?.value,
            sasaran_pemda: SasaranPemda,
        };
        const getBody = () => {
            if (metode === "lama") return formDataEdit;
            if (metode === "baru") return formDataNew;
            return {}; // Default jika metode tidak sesuai
        };
        // metode === 'baru' && console.log("baru :", formDataNew);
        // metode === 'lama' && console.log("lama :", formDataEdit);
        if(TujuanPemda?.value == null || TujuanPemda?.value == undefined){
            AlertNotification("", "pilih tujuan pemda", "warning", 2000);
        } else {
            try {
                let url = "";
                if (metode === "lama") {
                    url = `sasaran_pemda/update/${id}`;
                } else if (metode === "baru") {
                    url = `sasaran_pemda/create`;
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
                if (response.ok) {
                    AlertNotification("Berhasil", `Berhasil ${metode === 'baru' ? "Menambahkan" : "Mengubah"} Sasaran Pemda`, "success", 1000);
                    onClose();
                    onSuccess();
                } else {
                    AlertNotification("Gagal", "terdapat kesalahan pada backend / database server dengan response !ok", "error", 2000);
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
        setSasaranPemda('');
        setTujuanPemda(null);
    }

    if (!isOpen) {
        return null;
    } else {

        return (
            <div className="fixed inset-0 flex items-center justify-center z-50">
                <div className="fixed inset-0 bg-black opacity-30" onClick={handleClose}></div>
                <div className={`bg-white rounded-lg p-8 z-10 w-5/6 max-h-[80%] overflow-auto`}>
                    <div className="w-max-[500px] py-2 border-b">
                        <h1 className="text-xl uppercase text-center">{metode === 'baru' ? "Tambah" : "Edit"} Sasaran Pemda {id}</h1>
                    </div>
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="flex flex-col mx-5 py-5"
                    >
                        <div className="flex flex-col py-3">
                            <label
                                className="uppercase text-xs font-bold text-gray-700 my-2"
                                htmlFor="sasaran_pemda"
                            >
                                Strategic Pemda ({jenis_pohon}):
                            </label>
                            <div className="border px-4 py-2 rounded-lg">{nama_pohon}</div>
                        </div>
                        <div className="flex flex-col py-3">
                            <label
                                className="uppercase text-xs font-bold text-gray-700 my-2"
                                htmlFor="tujuan_pemda_id"
                            >
                                Tujuan Pemda :
                            </label>
                            <Controller
                                name="tujuan_pemda_id"
                                control={control}
                                render={({ field }) => (
                                    <>
                                        <Select
                                            {...field}
                                            placeholder="Pilih Tujuan Pemda"
                                            options={OptionTujuanPemda}
                                            isLoading={Loading}
                                            isSearchable
                                            isClearable
                                            value={TujuanPemda}
                                            onMenuOpen={() => {
                                                fetchOptionTujuanPemda();
                                            }}
                                            onChange={(option) => {
                                                field.onChange(option);
                                                setTujuanPemda(option);
                                            }}
                                            styles={{
                                                control: (baseStyles) => ({
                                                    ...baseStyles,
                                                    borderRadius: '8px',
                                                })
                                            }}
                                        />
                                    </>
                                )}
                            />
                        </div>
                        <div className="flex flex-col py-3">
                            <label
                                className="uppercase text-xs font-bold text-gray-700 my-2"
                                htmlFor="sasaran_pemda"
                            >
                                Sasaran Pemda:
                            </label>
                            <Controller
                                name="sasaran_pemda"
                                control={control}
                                render={({ field }) => (
                                    <textarea
                                        {...field}
                                        className="border px-4 py-2 rounded-lg"
                                        id="sasaran_pemda"
                                        placeholder="masukkan Tujuan Pemda"
                                        value={SasaranPemda}
                                        onChange={(e) => {
                                            field.onChange(e);
                                            setSasaranPemda(e.target.value);
                                        }}
                                    />
                                )}
                            />
                        </div>
                        <ButtonSky className="w-full mt-3" type="submit">
                            {Proses ?
                                <span className="flex">
                                    <LoadingButtonClip />
                                    Menyimpan...
                                </span>
                                :
                                "Simpan"
                            }
                        </ButtonSky>
                        <ButtonRed className="w-full my-2" onClick={handleClose}>
                            Batal
                        </ButtonRed>
                    </form>
                </div>
            </div>
        )
    }
}