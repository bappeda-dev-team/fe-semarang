'use client'

import { ButtonSky } from "@/components/global/Button";
import Select from 'react-select';
import { useState, useEffect } from "react";
import { getUser, getToken } from "@/components/lib/Cookie";
import { LoadingSync } from "@/components/global/Loading";

interface id {
    id: string;
}

interface musrenbang {
    id : string;
    jenis : string;
    usulan : string;
    alamat : string;
    permasalahan : string;
}

const Musrebang: React.FC<id> = ({id}) => {

    const [musrebang, setMusrebang] = useState<musrenbang[]>([]);
    const [dataNull, setDataNull] = useState<boolean | null>(null);
    const [Loading, setLoading] = useState<boolean | null>(null);
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
        const fetchMusrebang = async() => {
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
                if(hasil.usulan_musrebang){
                    const musrenbang = hasil.find((item: any) => item.usulan_musrebang);
                    const data = musrenbang.usulan_musrebang
                    if(data == null){
                        setDataNull(true);
                        setMusrebang([]);
                    } else {
                        setDataNull(false);
                        setMusrebang(data);
                    }
                } else {
                    setDataNull(true);
                    setMusrebang([]);
                }
            } catch(err) {
                console.log(err)
            } finally {
                setLoading(false);
            }
        };
        if(user?.roles != undefined){    
            fetchMusrebang();
        }
    },[id, user, token]);

    if(Loading){
        return(
            <>
                <div className="mt-3 rounded-t-xl border px-5 py-3">
                    <h1 className="font-bold">Usulan Musrenbang</h1>
                </div>
                <div className="rounded-b-xl shadow-lg border-x border-b px-5 py-3">
                    <LoadingSync />
                </div>
            </>
        );
    }

    return(
        <>
            {/* usulan musrebang */}
            <div className="mt-3 rounded-t-xl border px-5 py-3">
                <h1 className="font-bold">Usulan Musrenbang</h1>
            </div>
            <div className="rounded-b-xl shadow-lg border-x border-b px-5 py-3">
                <div className="my-2">
                    <Select 
                        styles={{
                            control: (baseStyles) => ({
                                ...baseStyles,
                                borderRadius: '8px',
                                })
                            }}
                            placeholder={"Pilih Musrebang"}
                        />
                </div>
                <ButtonSky className="w-full mt-2">Simpan</ButtonSky>
                <div className="overflow-auto mt-3 rounded-t-xl border">
                    <table className="w-full">
                        <thead>
                            <tr>
                                <td className="border-r border-b px-6 py-3 min-w-[50px]">No</td>
                                <td className="border-r border-b px-6 py-3 min-w-[200px]">Usulan</td>
                                <td className="border-r border-b px-6 py-3 min-w-[200px]">Alamat</td>
                                <td className="border-r border-b px-6 py-3 min-w-[400px]">Permasalahan</td>
                                <td className="border-r border-b px-6 py-3 min-w-[200px]">Aksi</td>
                            </tr>
                        </thead>
                        <tbody>
                            {dataNull ? (
                                <tr>
                                   <td className="px-6 py-3" colSpan={5}>
                                        Data Kosong / Belum Ditambahkan
                                   </td>
                                </tr>
                            ) : (
                                musrebang.map((data, index) => (
                                    <tr key={data.id}>
                                        <td className="border-r border-b px-6 py-3 min-w-[50px]">1</td>
                                        <td className="border-r border-b px-6 py-3 min-w-[200px]">{data.usulan}</td>
                                        <td className="border-r border-b px-6 py-3 min-w-[200px]">{data.alamat}</td>
                                        <td className="border-r border-b px-6 py-3 min-w-[400px]">{data.permasalahan}</td>
                                        <td className="border-r border-b px-6 py-3 min-w-[200px]">Aksi</td>
                                    </tr>
                                ))
                            )
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    )
}

export default Musrebang;