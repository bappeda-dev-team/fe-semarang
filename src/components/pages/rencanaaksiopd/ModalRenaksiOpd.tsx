'use client'

import React, { useState } from "react";
import { TbDeviceFloppy, TbX } from "react-icons/tb";
import { Controller, SubmitHandler, useForm, useFieldArray } from "react-hook-form";
import { ButtonSky, ButtonRed } from '@/components/global/Button';
import { AlertNotification, AlertQuestion2 } from "@/components/global/Alert";
import { getToken } from "@/components/lib/Cookie";
import { LoadingButtonClip } from "@/components/global/Loading";
import Select from 'react-select';

interface OptionType {
    value: number;
    label: string;
}
interface modal {
    metode: "baru" | "lama";
    isOpen: boolean;
    onClose: () => void;
    id?: string;
    id_rekin: string;
    rekin: string;
    kode_opd: string;
    indikator: indikator[];
    tahun: string;
    onSuccess: () => void;
}
interface FormValue {
    id_renaksi: OptionType;
    catatan: string;
}
interface indikator {
    id_indikator: string,
    rencana_kinerja_id: string,
    nama_indikator: string,
    targets: target[]
}
interface target {
    id_target: string;
    indikator_id: string;
    target: string;
    satuan: string;
}

export const ModalRenaksiOpd: React.FC<modal> = ({ isOpen, onClose, onSuccess, metode, id, id_rekin, kode_opd, rekin, indikator, tahun }) => {

    const {
        control,
        handleSubmit,
    } = useForm<FormValue>();

    const [Catatan, setCatatan] = useState<string>('');
    const [Renaksi, setRenaksi] = useState<OptionType | null>(null);
    const [RenaksiOption, setRenaksiOption] = useState<OptionType[]>([]);

    const [Proses, setProses] = useState<boolean>(false);
    const token = getToken();

    const handleClose = () => {
        onClose();
        setRenaksi(null);
        setCatatan('');
    }

    const onSubmit: SubmitHandler<FormValue> = async () => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        // try {
        //     const response = await fetch(`${API_URL}/pohon_kinerja_opd/check_pokin/${kode_opd}`, {
        //         method: "GET",
        //         headers: {
        //             Authorization: `${token}`,
        //             "Content-Type": "application/json",
        //         },
        //     });
        //     const hasil_check = await response.json();
        //     if (hasil_check.data === true) {
        //         AlertQuestion2("Peringatan", `data pohon di tahun ${TahunTarget?.value} sudah ada (cloning tidak akan menghapus data pohon yang sudah ada di tahun ${TahunTarget?.value}), lanjutkan cloning?`, "question", "Clone", "Batal").then((result) => {
        //             if (result.isConfirmed) {

        //             }
        //         });
        //     } else {

        //     }
        // } catch (err) {
        //     AlertNotification("Error at Checker Pokin", "terdapat kesalahan pada backend / database server, cek koneksi internet", "error", 2000);
        //     console.error(err);
        // }
    };

    if (!isOpen) {
        return null;
    } else {

        return (
            <div className="fixed inset-0 flex items-center justify-center z-50">
                <div className={`fixed inset-0 bg-black opacity-30`} onClick={handleClose}></div>
                <div className={`bg-white rounded-lg p-8 z-10 w-4/5 max-h-[80%] text-start overflow-auto`}>
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                    >
                        <div className="w-max-[500px] py-2 mb-2 border-b-2 border-gray-300 text-center uppercase font-bold">
                            {metode === "baru" ? "Tambah" : "Edit"} Rencana Aksi OPD
                        </div>
                        <div className="flex flex-col pt-3">
                            <label
                                className="uppercase text-xs font-bold text-gray-700 my-2"
                                htmlFor="nama_pohon"
                            >
                                Rencana Kinerja OPD
                            </label>
                            <div className="border px-4 py-2 rounded-lg">{rekin || "-"}</div>
                        </div>
                        {indikator.length != 0 ?
                            indikator.map((i: indikator, index_indikator: number) => (
                                <React.Fragment key={index_indikator}>
                                    <div className="flex flex-col justify-center">
                                        <label
                                            className="uppercase text-xs font-bold text-gray-700 my-2"
                                            htmlFor="nama_pohon"
                                        >
                                            Rencana Kinerja OPD
                                        </label>
                                        <div className="border px-4 py-2 rounded-lg">{rekin}</div>
                                    </div>
                                </React.Fragment>
                            ))
                            :
                            <div className="flex flex-col py-3">
                                <label
                                    className="uppercase text-xs font-bold text-gray-700 my-2"
                                    htmlFor="nama_pohon"
                                >
                                    Indikator
                                </label>
                                <div className="border px-4 py-2 rounded-lg italic">tidak ada indikator</div>
                            </div>
                        }
                        <div className="flex flex-col justify-center pr-2 pb-5">
                            <label
                                className="uppercase text-xs font-bold text-gray-700 my-2"
                                htmlFor="id_renaksi"
                            >
                                Rencana Aksi OPD
                            </label>
                            <Controller
                                name="id_renaksi"
                                control={control}
                                render={({ field }) => (
                                    <React.Fragment>
                                        <Select
                                            {...field}
                                            placeholder="Pilih Rencana Aksi OPD"
                                            value={Renaksi}
                                            options={RenaksiOption}
                                            isSearchable
                                            isClearable
                                            // menuShouldBlockScroll={true}
                                            // menuPlacement="top"
                                            menuPortalTarget={document.body} // Render menu ke document.body
                                            onChange={(option) => {
                                                field.onChange(option);
                                                setRenaksi(option);
                                            }}
                                            styles={{
                                                control: (baseStyles) => ({
                                                    ...baseStyles,
                                                    borderRadius: '8px',
                                                    textAlign: 'start',
                                                }),
                                                menuPortal: (base) => ({
                                                    ...base, zIndex: 9999
                                                })
                                            }}
                                        />
                                    </React.Fragment>
                                )}
                            />
                        </div>
                        <div className="flex flex-col justify-center">
                            <label
                                className="uppercase text-xs font-bold text-gray-700 my-2"
                                htmlFor="catatan"
                            >
                                Catatan :
                            </label>
                            <Controller
                                name="catatan"
                                control={control}
                                render={({ field }) => (
                                    <>
                                        <textarea
                                            {...field}
                                            className="border px-4 py-2 rounded-lg"
                                            id="catatan"
                                            placeholder="masukkan Catatan"
                                            value={Catatan}
                                            onChange={(e) => {
                                                field.onChange(e);
                                                setCatatan(e.target.value);
                                            }}
                                        />
                                    </>
                                )}
                            />
                        </div>
                        <ButtonSky type="submit" className="w-full my-3 gap-1" disabled={Proses}>
                            {Proses ?
                                <>
                                    <LoadingButtonClip />
                                    <span>menyimpan</span>
                                </>
                                :
                                <>
                                    <TbDeviceFloppy />
                                    <span>Simpan</span>
                                </>
                            }
                        </ButtonSky>
                        <ButtonRed className="flex items-center gap-1 w-full my-3" onClick={handleClose} disabled={Proses}>
                            <TbX />
                            Batal
                        </ButtonRed>
                    </form>
                </div>
            </div>
        )
    }
}