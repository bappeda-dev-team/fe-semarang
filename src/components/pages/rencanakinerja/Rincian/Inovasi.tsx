'use client'

import { ButtonSkyBorder } from "@/components/global/Button";
import { ModalInovasi } from "../ModalInovasi";
import { useState, useEffect } from "react";
import { LoadingSync } from "@/components/global/Loading";
import { getToken, getUser } from "@/components/lib/Cookie";

interface id {
    id: string;
}
interface type_inovasi {
    id : string;
    judul_inovasi : string;
    jenis_inovasi : string;
    gambaran_nilia_kebaruan : string;
}

const Inovasi: React.FC<id> = ({id}) => {

    const [isOpenNewInovasi, setIsOpenNewInovasi] = useState<boolean>(false);
    const [inovasi, setInovasi] = useState<type_inovasi[]>([]);
    const [Loading, setLoading] = useState<boolean | null>(null);
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
        const fetchInovasi = async() => {
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
                if(hasil.inovasi){
                    const i = hasil.find((item: any) => item.inovasi);
                    const data = i.inovasi
                    if(data == null){
                        setDataNull(true);
                        setInovasi([]);
                    } else {
                        setDataNull(false);
                        setInovasi(data);
                    }
                } else {
                    setDataNull(true);
                    setInovasi([]);
                }
            } catch(err) {
                console.log(err)
            } finally {
                setLoading(false);
            }
        };
        if(user?.roles != undefined){    
            fetchInovasi();
        }
    },[id, user, token]);

    const handleModalNewInovasi = () => {
        if(isOpenNewInovasi){
            setIsOpenNewInovasi(false);
        } else {
            setIsOpenNewInovasi(true);
        }
    }

    if(Loading){
        return(
            <>
                <div className="mt-3 rounded-t-xl border px-5 py-3">
                    <h1 className="font-bold">Inovasi</h1>
                </div>
                <div className="rounded-b-xl shadow-lg border-x border-b px-5 py-3">
                    <LoadingSync />
                </div>
            </>
        );
    }

    return(
        <>
            {/* Inovasi Sasaran */}
            <div className="flex flex-wrap justify-between items-center mt-3 rounded-t-xl border px-5 py-3">
                <h1 className="font-bold">Inovasi Sasaran</h1>
            </div>
            <div className="rounded-b-xl shadow-lg border-x border-b px-5 py-3">
                <div className="overflow-auto m-2 rounded-t-xl border">
                    <table className="w-full">
                        <thead>
                            <tr>
                                <td className="border-r border-b px-6 py-3 min-w-[200px]">Judul Inovasi</td>
                                <td className="border-r border-b px-6 py-3 min-w-[200px]">Jenis Inovasi</td>
                                <td className="border-r border-b px-6 py-3 min-w-[200px]">Gambaran nilai kebaruan</td>
                                <td className="border-r border-b px-6 py-3 min-w-[100px]">Aksi</td>
                            </tr>
                        </thead>
                        <tbody className='border'>
                            {dataNull ? 
                                <tr>
                                    <td className="px-6 py-3" colSpan={4}>
                                        Data Kosong / Belum Ditambahkan
                                    </td>
                                </tr>
                            :
                                inovasi.map((data: any) => (
                                <tr key={data.id}>
                                    <td className="border px-6 py-3">{data.judul_inovasi}</td>
                                    <td className="border px-6 py-3">{data.jenis_inovasi}</td>
                                    <td className="border px-6 py-3">{data.gambaran_nilia_kebaruan}</td>
                                    <td className="border px-6 py-3">
                                        <ButtonSkyBorder className="w-full" onClick={handleModalNewInovasi}>Edit</ButtonSkyBorder>
                                        <ModalInovasi onClose={handleModalNewInovasi} isOpen={isOpenNewInovasi}/>
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

export default Inovasi;