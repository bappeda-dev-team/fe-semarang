'use client'

import { ButtonSky, ButtonRedBorder } from "@/components/global/Button";
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import Select from 'react-select';
import React, { useState, useEffect } from "react";
import { LoadingSync, LoadingButtonClip } from "@/components/global/Loading";
import { getToken, getUser } from "@/components/lib/Cookie";
import { AlertNotification, AlertQuestion } from "@/components/global/Alert";
import { TbCirclePlus, TbTrash } from "react-icons/tb";

interface id {
    id: string;
}
interface OptionTypeString {
    value: string;
    label: string;
}
interface subkegiatan {
    subkegiatanterpilih_id: string;
    id: string;
    rekin_id: string;
    status: string;
    nama_sub_kegiatan: string;
    kode_opd: string;
    tahun: string;
    indikator: indikator[];
}
interface indikator {
    id_indikator: string;
    nama_indikator: string;
    targets: targets[];
}
interface targets {
    id_target: string;
    indikator_id: string;
    target: string;
    satuan: string;
}
interface formValue {
    sub_kegiatan: OptionTypeString;
}

const SubKegiatan: React.FC<id> = ({ id }) => {

    const { control, handleSubmit } = useForm<formValue>();

    const [subKegiatan, setSubKegiatan] = useState<subkegiatan[]>([]);
    const [InputSubKegiatan, setInputSubKegiatan] = useState<OptionTypeString | null>(null);
    const [OptionSubKegiatan, setOptionSubKegiatan] = useState<OptionTypeString[]>([]);

    const [Loading, setLoading] = useState<boolean>(false);
    const [Proses, setProses] = useState<boolean>(false);
    const [Deleted, setDeleted] = useState<boolean>(false);
    const [dataNull, setDataNull] = useState<boolean | null>(null);
    const [user, setUser] = useState<any>(null);
    const token = getToken();

    useEffect(() => {
        const fetchUser = getUser();
        if (fetchUser) {
            setUser(fetchUser.user);
        }
    }, []);

    useEffect(() => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        const fetchSubKegiatan = async () => {
            setLoading(true);
            try {
                const response = await fetch(`${API_URL}/rencana_kinerja/${id}/pegawai/${user?.nip}/input_rincian_kak`, {
                    headers: {
                        Authorization: `${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                const result = await response.json();
                const hasil = result.rencana_kinerja;
                if (hasil) {
                    const data = hasil.find((item: any) => item.subkegiatan);
                    if (data == null) {
                        setDataNull(true);
                        setSubKegiatan([]);
                    } else {
                        setDataNull(false);
                        setSubKegiatan(data.subkegiatan);
                    }
                } else {
                    setDataNull(true);
                    setSubKegiatan([]);
                }
            } catch (err) {
                console.log(err)
            } finally {
                setLoading(false);
            }
        };
        if (user?.roles != undefined) {
            fetchSubKegiatan();
        }
    }, [id, user, token, Deleted]);

    const fetchOptionSubKegiatan = async () => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        try {
            const response = await fetch(`${API_URL}/sub_kegiatan/pilihan/${user?.kode_opd}?status=belum_diambil`, {
                headers: {
                    Authorization: `${token}`
                }
            });
            if (!response.ok) {
                throw new Error("terdapat kesalahan pada endpoint backend");
            }
            const hasil = await response.json();
            const data = hasil.sub_kegiatan;
            if (data.length === 0) {
                console.log("data sub kegiatan kosong / belum ditambahkan");
            } else {
                const hasilData = data.map((sk: any) => ({
                    value: sk.id,
                    label: sk.nama_sub_kegiatan
                }));
                setOptionSubKegiatan(hasilData);
            }
        } catch (err) {
            console.log("gagal mendapatkan data sub kegiatan, periksa endpoint backend atau internet server");
        }
    }

    const onSubmit: SubmitHandler<formValue> = async (data) => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        const formData = {
            id_subkegiatan: data.sub_kegiatan?.value
        }
        // console.log(formData);
        try {
            setProses(true);
            const response = await fetch(`${API_URL}/sub_kegiatan/create_rekin/${id}`, {
                method: "POST",
                headers: {
                    Authorization: `${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            if (response.ok) {
                AlertNotification("Berhasil", "menambahkan sub kegiatan ke rencana kinerja", "success", 2000);
                setDeleted((prev) => !prev);
            } else {
                AlertNotification("Gagal", "terdapat kesalahan pada endpoint backend / internet server", "error", 2000);
            }
        } catch (err) {
            console.log(err);
            AlertNotification("Gagal", "cek koneksi internet / database server", "success", 2000);
        } finally {
            setProses(false);
        }
    }

    const hapusSubKegiatan = async (id: any) => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        try {
            setProses(true);
            const response = await fetch(`${API_URL}/sub_kegiatan/delete_subkegiatan_terpilih/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `${token}`,
                    'Content-Type': 'application/json',
                },
            })
            if (!response.ok) {
                alert("response !ok ketika gagal hapus sub kegiatan");
            }
            setSubKegiatan(subKegiatan.filter((data) => (data.id !== id)))
            AlertNotification("Berhasil", "Sub Kegiatan Berhasil Dihapus", "success", 1000);
            setDeleted((prev) => !prev);
        } catch (err) {
            AlertNotification("Gagal", "cek koneksi internet atau database server", "error", 2000);
        } finally {
            setProses(false);
        }
    };

    if (Loading) {
        return (
            <>
                <div className="mt-3 rounded-t-xl border px-5 py-3">
                    <h1 className="font-bold">Sub Kegiatan</h1>
                </div>
                <div className="rounded-b-xl shadow-lg border-x border-b px-5 py-3">
                    <LoadingSync />
                </div>
            </>
        );
    }

    return (
        <>
            {/* usulan subkegiatan */}
            <div className="mt-3 rounded-t-xl border px-5 py-3">
                <h1 className="font-bold">Sub Kegiatan</h1>
            </div>
            <div className="rounded-b-xl shadow-lg border-x border-b px-5 py-3">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="my-2">
                        <Controller
                            name="sub_kegiatan"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    id="sub_kegiatan"
                                    isClearable
                                    isLoading={Loading}
                                    value={InputSubKegiatan}
                                    options={OptionSubKegiatan}
                                    onMenuOpen={fetchOptionSubKegiatan}
                                    onMenuClose={() => setOptionSubKegiatan([])}
                                    onChange={(option) => {
                                        field.onChange(option);
                                        setInputSubKegiatan(option);
                                    }}
                                    styles={{
                                        control: (baseStyles) => ({
                                            ...baseStyles,
                                            borderRadius: '8px',
                                            marginTop: '4px'
                                        })
                                    }}
                                    placeholder={"Pilih sub kegiatan"}
                                />
                            )}
                        />
                    </div>
                    <ButtonSky type="submit" className="w-full mt-2" disabled={Proses}>
                        {Proses ?
                            <span className="flex">
                                <LoadingButtonClip />
                                Menambahkan...
                            </span>
                            :
                            <span className="flex items-center">
                                <TbCirclePlus className='mr-1' />
                                Tambahkan
                            </span>
                        }
                    </ButtonSky>
                </form>
                <div className="overflow-auto mt-3 rounded-t-xl border">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gray-300">
                                <td className="border-r border-b px-6 py-3 min-w-[200px]">Sub Kegiatan</td>
                                <td colSpan={2} className="border-r border-b px-6 py-3 min-w-[200px] text-center">Aksi</td>
                            </tr>
                        </thead>
                        <tbody>
                            {dataNull ?
                                <tr>
                                    <td className="px-6 py-3" colSpan={10}>
                                        Data Kosong / Belum Ditambahkan
                                    </td>
                                </tr>
                                :
                                subKegiatan.map((data: any) => (
                                    <React.Fragment key={data.id}>
                                        <tr>
                                            <td className="border-r border-b px-6 py-3 min-w-[200px]">{data.nama_sub_kegiatan || "-"}</td>
                                            <td colSpan={2} className="border-r border-b px-6 py-3 min-w-[200px]">
                                                <ButtonRedBorder
                                                    className="w-full"
                                                    disabled={Proses}
                                                    onClick={() => {
                                                        AlertQuestion("Hapus?", "Hapus Sub Kegiatan yang dipilih?", "question", "Hapus", "Batal").then((result) => {
                                                            if (result.isConfirmed) {
                                                                hapusSubKegiatan(data.subkegiatanterpilih_id);
                                                            }
                                                        });
                                                    }}
                                                >
                                                    {Proses ? 
                                                        <span className="flex">
                                                            <LoadingButtonClip />
                                                            Menghapus...
                                                        </span>
                                                    :
                                                        <span className="flex items-center">
                                                            <TbTrash className="mr-2" />
                                                            Hapus
                                                        </span>
                                                    }
                                                </ButtonRedBorder>
                                            </td>
                                        </tr>
                                        <tr className="bg-gray-300">
                                            <td className="border-r border-b px-6 py-3 min-w-[200px]">Indikator</td>
                                            <td className="border-r border-b px-6 py-3 min-w-[200px] text-center">Target</td>
                                            <td className="border-r border-b px-6 py-3 min-w-[200px] text-center">Satuan</td>
                                        </tr>
                                        {data.indikator ?
                                            data.indikator.map((i: indikator) => (
                                                <tr key={i.id_indikator}>
                                                    <td className="border-r border-b px-6 py-3 min-w-[200px]">{i.nama_indikator || "-"}</td>
                                                    {i.targets.map((t: targets) => (
                                                        <React.Fragment key={t.id_target}>
                                                            <td className="border-r border-b px-6 py-3 min-w-[200px]">{t.target}</td>
                                                            <td className="border-r border-b px-6 py-3 min-w-[200px]">{t.satuan}</td>
                                                        </React.Fragment>
                                                    ))}
                                                </tr>
                                            ))
                                            :
                                            <tr>
                                                <td className="border-r border-b px-6 py-3 min-w-[200px]">-</td>
                                                <td className="border-r border-b px-6 py-3 min-w-[200px]">-</td>
                                                <td className="border-r border-b px-6 py-3 min-w-[200px]">-</td>
                                            </tr>
                                        }
                                    </React.Fragment>
                                ))
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    )
}

export default SubKegiatan;