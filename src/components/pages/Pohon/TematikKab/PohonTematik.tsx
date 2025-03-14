import '@/components/pages/Pohon/treeflex.css'
import { useState, useEffect } from 'react';
import { LoadingBeat } from '@/components/global/Loading';
import {Pohon} from '@/components/lib/Pohon/Pemda/Pohon';
import { getToken, getUser } from '@/components/lib/Cookie';

interface pohontematik {
    id: number;
    show_all: boolean;
    set_show_all: () => void;
  }
  interface opd {
    kode_opd: string;
    nama_opd: string;
  }
  
  interface tematik {
    id: number;
    parent: number;
    tema: string;
    taget: string;
    satuan: string;
    keterangan: string;
    indikators: string;
    childs: childs[];
  }
  interface childs {
    id: number;
    parent: number;
    tema_sub_tematik: string;
    keterangan: string;
    kode_opd: opd;
    indikators: string;
    strategics: childs[];
  }

const PohonTematik = ({id, show_all, set_show_all} : pohontematik) => {

    const [Pokin, setPokin] = useState<tematik[]>([]);
    const [Loading, setLoading] = useState<boolean | null>(null);
    const [error, setError] = useState<string>('');
    const [Deleted, setDeleted] = useState<boolean>(false);
    const token = getToken();
    const [User, setUser] = useState<any>(null);

    useEffect(() => {
        const fetchUser = getUser();
        if(fetchUser){
            setUser(fetchUser.user);
        }
    },[])

    useEffect(() => {
        const fetchTematikKab = async() => {
            const API_URL = process.env.NEXT_PUBLIC_API_URL;
            setLoading(true);
            try{
                const response = await fetch(`${API_URL}/pohon_kinerja_admin/tematik/${id}`, {
                    headers: {
                        Authorization: `${token}`,
                        'Content-Type': 'application/json',
                      },
                });
                if(!response.ok){
                    throw new Error('terdapat kesalahan di koneksi backend');
                }
                const result = await response.json();
                const data = result?.data || [];
                setPokin(data);
            } catch(err) {
                setError('gagal mendapatkan data, terdapat kesalahan backend/server saat mengambil data pohon kinerja tematik');
            } finally {
                setLoading(false);
            }
        }
        if(id != undefined){
            fetchTematikKab();
        }
    },[id, Deleted, token]);

    if(error){
        return(
            <div className="flex flex-col p-5 border-b-2 border-x-2 rounded-b-xl">
                <h1 className="text-red-500">{error}</h1>
            </div>
        )
    }
    if(Loading){
        return(
            <div className="flex flex-col p-5 border-b-2 border-x-2 rounded-b-xl">
                <LoadingBeat className="mx-5 py-5"/>
            </div>
        )
    }

    return(
        <>
            <div className="flex flex-col p-5 border-b-2 border-x-2 rounded-b-xl">
                <div className="tf-tree text-center mt-3">
                    <ul>
                        <Pohon 
                            user={User?.roles} 
                            tema={Pokin} 
                            deleteTrigger={() => setDeleted((prev) => !prev)}
                            show_all={show_all}
                            set_show_all={set_show_all}
                        />
                    </ul>
                </div>
            </div>
        </>
    )
}

export default PohonTematik;
