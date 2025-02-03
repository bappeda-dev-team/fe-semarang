'use client'

import { useState, useEffect } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { ButtonSky, ButtonRed } from '@/components/global/Button';
import { AlertNotification } from "@/components/global/Alert";
import { getToken } from "@/components/lib/Cookie";
import { LoadingClip } from "@/components/global/Loading";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    id?: number | null;
    idPohon: number;
    jenis?: "post" | "put";
    onSuccess: () => void;
}

interface FormValue {
    review: string;
    keterangan: string;
}

export const ModalReview: React.FC<ModalProps> = ({ isOpen, onClose, id, jenis, idPohon, onSuccess }) => {
    const { control, handleSubmit, reset } = useForm<FormValue>();

    const [IsLoading, setIsLoading] = useState<boolean>(false);
    const token = getToken();

    useEffect(() => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;

        const fetchDetailReview = async () => {
            if (!id) return;

            try {
                setIsLoading(true);
                const response = await fetch(`${API_URL}/review_pokin/detail/${id}`, {
                    headers: {
                        Authorization: `${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error('Terjadi kesalahan pada koneksi backend');
                }

                const result = await response.json();
                const data = result.data;

                reset({
                    review: data.review || '',
                    keterangan: data.keterangan || '',
                });

            } catch (err) {
                console.error(err, 'Gagal mengambil data sesuai id pohon');
            } finally {
                setIsLoading(false);
            }
        };

        if ((jenis === 'put') && isOpen) {
            fetchDetailReview();
        } else {
            reset({ review: '', keterangan: '' });
        }
    }, [id, isOpen, jenis, reset, token]);

    const handleClose = () => {
        reset({ review: '', keterangan: '' });
        onClose();
    };

    const onSubmit: SubmitHandler<FormValue> = async (data) => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        const endpoint = jenis === 'post' ? `${API_URL}/review_pokin/create/${idPohon}` : `${API_URL}/review_pokin/update/${id}`;
        const method = jenis === 'post' ? "POST" : "PUT";
        const formData = {
            //key : value
            id_pohon_kinerja: idPohon,
            review: data.review,
            Keterangan : data.keterangan,
        };
        // console.log(formData);
        try {
            const response = await fetch(endpoint, {
                method,
                headers: {
                    Authorization: `${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                AlertNotification("Berhasil", jenis === 'post' ? "Berhasil menambahkan crosscutting" : "Berhasil mengupdate crosscutting", "success", 1000);
                onClose();
                onSuccess();
            } else {
                AlertNotification("Gagal", "Terjadi kesalahan pada backend / database server", "error", 2000);
            }
        } catch (err) {
            AlertNotification("Gagal", "Cek koneksi internet / terdapat kesalahan pada server", "error", 2000);
            console.error(err);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="fixed inset-0 bg-black opacity-30" onClick={handleClose}></div>
            <div className="bg-white rounded-lg p-8 z-10 w-3/5 text-start">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="w-max-[500px] py-2 border-b font-bold text-center">
                        {jenis === 'post' ? "Tambah Review" : "Edit Review"} id : {id} pohon: {idPohon ? idPohon : ""}
                    </div>

                    {IsLoading ? 
                        <LoadingClip />
                    :
                    <>
                        <div className="flex flex-col py-3">
                            <label className="uppercase text-xs font-medium text-gray-700 my-2" htmlFor="review">Review</label>
                            <Controller
                                name="review"
                                control={control}
                                render={({ field }) => (
                                    <textarea 
                                        {...field} 
                                        className="border px-4 py-2 rounded-lg" 
                                        id="review" 
                                        placeholder="Masukkan review"
                                    />
                                )}
                            />
                        </div>

                        <div className="flex flex-col py-3">
                            <label className="uppercase text-xs font-medium text-gray-700 my-2" htmlFor="keterangan">Keterangan</label>
                            <Controller
                                name="keterangan"
                                control={control}
                                render={({ field }) => (
                                    <textarea 
                                        {...field} 
                                        className="border px-4 py-2 rounded-lg" 
                                        id="keterangan" 
                                        placeholder="Masukkan keterangan"
                                    />
                                )}
                            />
                        </div>

                        <ButtonSky type="submit" className="w-full my-3">
                            {jenis === 'post' ? "Tambah" : "Simpan Perubahan"}
                        </ButtonSky>
                        <ButtonRed className="w-full my-3" onClick={handleClose}>
                            Batal
                        </ButtonRed>
                    </>
                    }

                </form>
            </div>
        </div>
    );
};
