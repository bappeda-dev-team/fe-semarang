import '@/components/pages/Pohon/treeflex.css'
import { useState, useEffect } from 'react';
import { LoadingBeat } from '@/components/global/Loading';
import { ButtonSkyBorder, ButtonRedBorder, ButtonGreenBorder } from '@/components/global/Button';
import { TbCirclePlus, TbPencil, TbTrash } from 'react-icons/tb';

interface pohontematik {
    id: number;
}
interface tematik {
    id: number;
    parent: number;
    tema: string;
    taget: string;
    satuan: string;
    keterangan: string;
    indikators: string; 
    sub_tematiks: subtematik[];
}
interface subtematik {
    id: number;
    parent: number;
    tema_sub_tematik: string;
    keterangan: string;
    indikators: string;
}

const PohonTematik = ({id} : pohontematik) => {

    const [Pokin, setPokin] = useState<tematik[]>([]);
    const [Loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');

    useEffect(() => {

        const fetchTematikKab = async() => {
            const API_URL = process.env.NEXT_PUBLIC_API_URL;
            setLoading(true);
            try{
                const response = await fetch(`${API_URL}/pohon_kinerja_admin/tematik/${id}`);
                if(!response.ok){
                    throw new Error('terdapat kesalahan di koneksi backend');
                }
                const result = await response.json();
                const data = result.data?.tematiks || [];
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
    },[id]);

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
                        {Pokin.map((data: any) => (
                        <li key={data.id}>
                            {/* 1 KOTAK */}
                            <div className="tf-nc tf flex flex-col w-[700px] rounded-lg">
                                {/* HEADER */}
                                <div className="flex pt-3 justify-center font-bold text-lg uppercase border my-3 py-3 border-black">
                                    <h1>Tematik Kabupaten</h1>
                                </div>
                                {/* BODY */}
                                <div className="flex justify-center my-3">
                                    <table className='w-full'>
                                        <tbody>
                                            <tr>
                                                <td className="min-w-[100px] border px-2 py-3 border-black text-start">Tema</td>
                                                <td className="min-w-[300px] border px-2 py-3 border-black text-start">{data.tema? data.tema : "-"}</td>
                                            </tr>
                                            <tr>
                                                <td className="min-w-[100px] border px-2 py-3 border-black text-start">Target/Satuan</td>
                                                <td className="min-w-[300px] border px-2 py-3 border-black text-start">{data.target ? data.target : "-"}{data.satuan ? data.satuan : ""}</td>
                                            </tr>
                                            <tr>
                                                <td className="min-w-[100px] border px-2 py-3 border-black text-start">Keterangan</td>
                                                <td className="min-w-[300px] border px-2 py-3 border-black text-start">{data.keterangan ? data.keterangan : "-"}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                {/* button */}
                                <div className="flex justify-center border my-3 py-3 border-black">
                                    <ButtonSkyBorder halaman_url={`/tematikkota/${data.id}`}>
                                        <TbPencil className="mr-1"/>
                                        Edit
                                    </ButtonSkyBorder>
                                </div>
                                {/* footer */}
                                <div className="flex justify-center my-3 py-3">
                                    <ButtonGreenBorder halaman_url={`/subtematik/${data.id}/tambah`}>
                                        <TbCirclePlus className='mr-1'/>
                                        Sub Tema
                                    </ButtonGreenBorder>
                                </div>
                            </div>
                            {data.sub_tematiks ? (
                                <ul>
                                    {data.sub_tematiks.map((item: any) => (
                                    <li key={item.id}>
                                        <div className="tf-nc tf flex flex-col w-[700px] rounded-lg">
                                            <div className="flex pt-3 justify-center font-bold text-lg uppercase border my-3 py-3 border-black">
                                                <h1>Sub-Tematik Kabupaten</h1>
                                            </div>
                                            <div className="flex justify-center my-3">
                                                <table className="w-full">
                                                    <tbody>
                                                        <tr>
                                                            <td className="min-w-[100px] border px-2 py-1 border-black text-start">Sub Tema</td>
                                                            <td className="min-w-[300px] border px-2 py-1 border-black text-start">{item.tema_sub_tematik ? item.tema_sub_tematik : "-"}</td>
                                                        </tr>
                                                        <tr>
                                                            <td className="min-w-[100px] border px-2 py-1 border-black text-start">Target/Satuan</td>
                                                            <td className="min-w-[300px] border px-2 py-1 border-black text-start">{item.target ? item.target : "-"} {item.satuan ? item.satuan : ""}</td>
                                                        </tr>
                                                        <tr>
                                                            <td className="min-w-[100px] border px-2 py-1 border-black text-start">Keterangan</td>
                                                            <td className="min-w-[300px] border px-2 py-1 border-black text-start">{item.keterangan ? item.keterangan : "-"}</td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                            <div className="flex justify-evenly border my-3 py-2 border-black">
                                                <ButtonSkyBorder halaman_url={`/subtematik/${data.id}/edit`}>
                                                    <TbPencil className="mr-1"/>
                                                    Edit
                                                </ButtonSkyBorder>
                                                <ButtonRedBorder>
                                                    <TbTrash className='mr-1'/>
                                                    Hapus
                                                </ButtonRedBorder>
                                            </div>
                                            <div className="flex justify-evenly my-3 py-2">
                                                <ButtonGreenBorder>
                                                    <TbCirclePlus className="mr-1"/>
                                                    Strategic
                                                </ButtonGreenBorder>
                                                <ButtonGreenBorder>
                                                    <TbCirclePlus className="mr-1"/>
                                                    Sub Sub Tematik
                                                </ButtonGreenBorder>
                                            </div>
                                        </div>
                                    </li>
                                    ))}
                                </ul>
                            ) : (
                                <></>
                            )}
                        </li>
                        ))}
                    </ul>
                </div>
            </div>
        </>
    )
}

export default PohonTematik;
