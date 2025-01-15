'use client'

import { ButtonSky, ButtonRed } from "@/components/global/Button";
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import Select from 'react-select';
import { useState, useEffect } from "react";
import { LoadingSync } from "@/components/global/Loading";
import { getToken, getUser } from "@/components/lib/Cookie";
import { AlertNotification } from "@/components/global/Alert";

interface id {
    id: string;
}
interface OptionTypeString {
    value: string;
    label: string;
}
interface subkegiatan {
    id : string;
    nama_sub_kegiatan : string;
    indikator : string;
    pagu_ranwal : string;
    pagu_rankir : string;
    pagu_penetapan : string;
}
interface formValue {
    sub_kegiatan: OptionTypeString;
}

const SubKegiatan: React.FC<id> = ({id}) => {

    const { control, handleSubmit } = useForm<formValue>();

    const [subKegiatan, setSubKegiatan] = useState<subkegiatan[]>([]);
    const [InputSubKegiatan, setInputSubKegiatan] = useState<OptionTypeString | null>(null);
    const [OptionSubKegiatan, setOptionSubKegiatan] = useState<OptionTypeString[]>([]);
    const [Loading, setLoading] = useState<boolean>(false);
    const [dataNull, setDataNull] = useState<boolean | null>(null);
    const [user, setUser] = useState<any>(null);
    const token = getToken();
    
    useEffect(() => {
        const fetchUser = getUser();
        if(fetchUser){
            setUser(fetchUser.user);
        }
    },[]);

    useEffect(() => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        const fetchSubKegiatan = async() => {
            setLoading(true);
            try{
                const response = await fetch(`${API_URL}/rencana_kinerja/${id}/pegawai/${user?.pegawai_id}/input_rincian_kak`, {
                    headers: {
                      Authorization: `${token}`,
                      'Content-Type': 'application/json',
                    },
                });
                const result = await response.json();
                const hasil = result.rencana_kinerja;
                if(hasil.subkegiatan){
                    const sub = hasil.find((item: any) => item.subkegiatan);
                    const data = sub.subkegiatan
                    if(data == null){
                        setDataNull(true);
                        setSubKegiatan([]);
                    } else {
                        setDataNull(false);
                        setSubKegiatan(data);
                    }
                } else {
                    setDataNull(true);
                    setSubKegiatan([]);
                }
            } catch(err) {
                console.log(err)
            } finally {
                setLoading(false);
            }
        };
        if(user?.roles != undefined){
            fetchSubKegiatan();
        }
    },[id, user, token]);

    const fetchOptionSubKegiatan = async() => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        try{
            const response = await fetch(`${API_URL}/sub_kegiatan/findall`, {
                headers: {
                    Authorization: `${token}`
                }
            });
            if(!response.ok){
                throw new Error("terdapat kesalahan pada endpoint backend");
            }
            const hasil = await response.json();
            const data = hasil.sub_kegiatan;
            if(data.length === 0){
                console.log("data sub kegiatan kosong / belum ditambahkan");
            } else {
                const hasilData = data.map((sk: any) => ({
                    value: sk.id,
                    label: sk.nama_sub_kegiatan
                }));
                setOptionSubKegiatan(hasilData);
            }
        } catch(err){
            console.log("gagal mendapatkan data sub kegiatan, periksa endpoint backend atau internet server");
        }
    }

    const onSubmit: SubmitHandler<formValue> = async(data) => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        const formData = {
            sub_kegiatan : data.sub_kegiatan?.value
        }
        console.log(formData);
        // try{
        //     const response = await fetch(`${API_URL}/lorem`, {
        //         method: "POST",
        //         headers: {
        //             Authorization : `${token}`
        //         }
        //     });
        //     if(response.ok){
        //         AlertNotification("Berhasil", "menambahkan sub kegiatan ke rencana kinerja", "success", 2000);
        //     } else {
        //         AlertNotification("Gagal", "terdapat kesalahan pada endpoint backend / internet server", "success", 2000);
        //     }
        // } catch(err){
        //     console.log(err);
        //     AlertNotification("Gagal", "cek koneksi internet / database server", "success", 2000);
        // }
    }

    if(Loading){
        return(
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

    return(
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
                            render={({field}) => (
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
                    <ButtonSky type="submit" className="w-full mt-2">Tambahkan</ButtonSky>
                </form>
                <div className="overflow-auto mt-3 rounded-t-xl border">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gray-300">
                                <td className="border-r border-b px-6 py-3 min-w-[200px]">Sub Kegiatan</td>
                                <td className="border-r border-b px-6 py-3 min-w-[200px]">Indikator</td>
                                <td className="border-r border-b px-6 py-3 min-w-[200px]">Pagu Ranwal 2024</td>
                                <td className="border-r border-b px-6 py-3 min-w-[200px]">Pagu Rankir 2024</td>
                                <td className="border-r border-b px-6 py-3 min-w-[200px]">Pagu Penetapan 2024</td>
                                <td className="border-r border-b px-6 py-3 min-w-[200px]">Aksi</td>
                            </tr>
                        </thead>
                        <tbody>
                            {dataNull ? 
                                <tr>
                                    <td className="px-6 py-3" colSpan={6}>
                                        Data Kosong / Belum Ditambahkan
                                    </td>
                                </tr>
                            :
                                subKegiatan.map((data: any) => (
                                    <tr key={data.id}>
                                        <td className="border-r border-b px-6 py-3 min-w-[200px]">{data.nama_sub_kegiatan}</td>
                                        <td className="border-r border-b px-6 py-3 min-w-[200px]">{data.indikator}</td>
                                        <td className="border-r border-b px-6 py-3 min-w-[200px]">{data.pagu_ranwal}</td>
                                        <td className="border-r border-b px-6 py-3 min-w-[200px]">{data.pagu_rankir}</td>
                                        <td className="border-r border-b px-6 py-3 min-w-[200px]">{data.pagu_penetapan}</td>
                                        <td className="border-r border-b px-6 py-3 min-w-[200px]">
                                            <ButtonRed>Hapus</ButtonRed>
                                        </td>
                                    </tr>
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