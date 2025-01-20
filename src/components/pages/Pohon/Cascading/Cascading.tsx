'use client'

import '@/components/pages/Pohon/treeflex.css'
import { getOpdTahun } from '@/components/lib/Cookie';
import { useState, useEffect, useRef } from 'react';
import { TbHandStop, TbPointer } from 'react-icons/tb';
import { LoadingBeat } from '@/components/global/Loading';
import { OpdTahunNull, TahunNull } from '@/components/global/OpdTahunNull';
import { FormPohonOpd } from '@/components/lib/Pohon/Opd/FormPohonOpd';
import { getUser, getToken } from '@/components/lib/Cookie';
import { PohonCascading } from '@/components/lib/Pohon/Cascading/PohonCascading';

interface OptionType {
    value: number;
    label: string;
}
interface opd {
    kode_opd: string;
    nama_opd: string;
}
interface pokin {
    kode_opd: string;
    nama_opd: string;
    tahun: string;
    childs: childs[]
}
interface childs {
    id: number;
    parent: number;
    strategi: string;
    taget: string;
    satuan: string;
    keterangan: string;
    indikators: string; 
    childs: childs[];
}

const Cascading = () => {

    const [User, setUser] = useState<any>(null);
    const [Tahun, setTahun] = useState<any>(null);
    const [SelectedOpd, setSelectedOpd] = useState<any>(null);
    const [Pokin, setPokin] = useState<pokin | null>(null);
    const [Loading, setLoading] = useState<boolean | null>(null);
    const [error, setError] = useState<string>('');
    const token = getToken();

    const [formList, setFormList] = useState<number[]>([]); // List of form IDs
    const [Deleted, setDeleted] = useState<boolean>(false);

    //Hand Tool state
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const [scrollStart, setScrollStart] = useState({ x: 0, y: 0 });
    const [cursorMode, setCursorMode] = useState<"normal" | "hand">("normal");
    const containerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const fetchUser = getUser();
        if(fetchUser){
            setUser(fetchUser.user);
        }
        const data = getOpdTahun();
        if(data.tahun){
            const tahun = {
                value: data.tahun.value,
                label: data.tahun.label,
            }
            setTahun(tahun);
        }
        if(data.opd){
            const opd = {
                value: data.opd.value,
                label: data.opd.label,
            }
            setSelectedOpd(opd);
        }
    },[]);

    const toggleCursorMode = () =>{
      setCursorMode((prevMode) => (prevMode === "normal" ? "hand" : "normal"));
    }
    const handleMouseDown = (e: React.MouseEvent) => {
      if (cursorMode === "normal") return; // Ignore if cursor is normal

      setIsDragging(true);
      setDragStart({ x: e.clientX, y: e.clientY });
      if (containerRef.current) {
        setScrollStart({
          x: containerRef.current.scrollLeft,
          y: containerRef.current.scrollTop,
        });
      }
    };

    const handleMouseMove = (e: React.MouseEvent) => {
      if (!isDragging || !containerRef.current) return;
      const dx = dragStart.x - e.clientX;
      const dy = dragStart.y - e.clientY;
      containerRef.current.scrollLeft = scrollStart.x + dx;
      containerRef.current.scrollTop = scrollStart.y + dy;
    };

    const handleMouseUp = () => setIsDragging(false);

    useEffect(() => {
        const fetchPokinOpd = async(url: string) => {
            const API_URL = process.env.NEXT_PUBLIC_API_URL;
            setLoading(true);
            try{
                const response = await fetch(`${API_URL}/${url}`, {
                    headers: {
                        Authorization: `${token}`,
                        'Content-Type': 'application/json',
                      },
                });
                if(!response.ok){
                    throw new Error('terdapat kesalahan di koneksi backend');
                }
                const result = await response.json();
                const data = result.data || [];
                setPokin(data);
            } catch(err) {
                setError('gagal mendapatkan data, terdapat kesalahan backend/server saat mengambil data pohon kinerja perangkat daerah');
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
        if(User?.roles == 'super_admin'){
            if(SelectedOpd?.value != undefined && Tahun?.value != undefined){
                fetchPokinOpd(`pohon_kinerja_opd/findall/${SelectedOpd?.value}/${Tahun?.value}`);
            }
        } else if(User?.roles != 'super_admin'){
            if(User?.kode_opd != undefined && Tahun?.value != undefined){
                fetchPokinOpd(`pohon_kinerja_opd/findall/${User?.kode_opd}/${Tahun?.value}`);
            }
        }
    },[User, SelectedOpd, Tahun, Deleted, token]);
    
    if(Loading){
        return(
            <>
                <div className="flex flex-col p-5 border-2 rounded-t-xl mt-2">
                    <h1>Pohon Cascading {SelectedOpd?.label}</h1>
                </div>
                <div className="flex flex-col p-5 border-b-2 border-x-2 rounded-b-xl">
                    <LoadingBeat />
                </div>
            </>
        )
    }
    if(error){
        return(
            <>
                <div className="flex flex-col p-5 border-2 rounded-t-xl mt-2">
                    <h1>Pohon Cascading</h1>
                </div>
                <div className="flex flex-col p-5 border-b-2 border-x-2 rounded-b-xl">
                    {error}
                </div>
            </>
        )
    }
    if(User?.roles == 'super_admin'){
        if(SelectedOpd?.value == undefined || Tahun?.value == undefined){
            return(
                <>
                    <div className="flex flex-col p-5 border-2 rounded-t-xl mt-2">
                        <h1>Pohon Cascading {SelectedOpd?.label}</h1>
                    </div>
                    <div className="flex flex-col p-5 border-b-2 border-x-2 rounded-b-xl">
                        <OpdTahunNull />
                    </div>
                </>
            )
        }
    } 
    if(User?.roles != 'super_admin'){
        if(Tahun?.value == undefined){
            return(
                <>
                    <div className="flex flex-col p-5 border-2 rounded-t-xl mt-2">
                        <h1>Pohon Cascading {SelectedOpd?.label}</h1>
                    </div>
                    <div className="flex flex-col p-5 border-b-2 border-x-2 rounded-b-xl">
                        <TahunNull />
                    </div>
                </>
            )
        }
    }

    return(
        <div>
            <div className="flex flex-col p-5 border-2 rounded-t-xl overflow-auto mt-2">
                {User?.roles == 'super_admin' ? 
                    <h1 className="font-bold">Pohon Cascading {SelectedOpd?.label}</h1>
                :
                    <h1 className="font-bold">Pohon Cascading {Pokin?.nama_opd}</h1>
                }
            </div>
            <div className="flex flex-col p-5 border-b-2 border-x-2 rounded-b-xl relative w-full h-[calc(100vh-100px)] max-h-screen overflow-auto">
                <div className={`tf-tree text-center mt-3 ${cursorMode === 'hand' ? "select-none" : ""}`}
                    ref={containerRef}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    style={{
                      cursor: cursorMode === "hand" ? (isDragging ? "grabbing" : "grab") : "default", // Cursor style
                    }}
                >
                    <ul>
                        <li>
                            <div className="tf-nc tf flex flex-col w-[600px] rounded-lg">
                                <div className="header flex pt-3 justify-center font-bold text-lg uppercase border my-3 py-3 border-black">
                                {(User?.roles == 'super_admin' || User?.roles == 'admin_opd') ?
                                    <h1>Pohon Cascading</h1>
                                    :
                                    <h1>Pohon Cascading</h1>
                                }
                                </div>
                                <div className="body flex justify-center my-3">
                                    <table className="w-full">
                                        <tbody>
                                            <tr>
                                                <td className="min-w-[100px] border px-2 py-3 border-black text-start">Perangkat Daerah</td>
                                                <td className="min-w-[300px] border px-2 py-3 border-black text-start">{Pokin?.nama_opd}</td>
                                            </tr>
                                            <tr>
                                                <td className="min-w-[100px] border px-2 py-3 border-black text-start">Kode OPD</td>
                                                <td className="min-w-[300px] border px-2 py-3 border-black text-start">{Pokin?.kode_opd}</td>
                                            </tr>
                                            <tr>
                                                <td className="min-w-[100px] border px-2 py-3 border-black text-start">Tahun</td>
                                                <td className="min-w-[300px] border px-2 py-3 border-black text-start">{Pokin?.tahun}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            {Pokin?.childs ? (
                            <ul>
                                {Pokin.childs.map((data: any) => (
                                    <li key={data.id}>
                                        <PohonCascading tema={data} deleteTrigger={() => setDeleted((prev) => !prev)}/>
                                    </li>
                                ))}
                                {formList.map((formId) => (
                                    <FormPohonOpd
                                        level={3}
                                        id={null}
                                        key={formId}
                                        formId={formId}
                                        pokin={'opd'}
                                        onCancel={() => setFormList(formList.filter((id) => id !== formId))}
                                    />
                                ))}
                            </ul>
                            ) : (
                                <ul>
                                    {formList.map((formId) => (
                                        <FormPohonOpd
                                            level={3}
                                            id={null}
                                            key={formId}
                                            formId={formId}
                                            pokin={'opd'}
                                            onCancel={() => setFormList(formList.filter((id) => id !== formId))}
                                        />
                                    ))}
                                </ul>
                            )}
                        </li>
                    </ul>
                </div>
                {/* BUTTON HAND TOOL */}
                <div className="fixed flex items-center mr-2 mb-2 bottom-0 right-0">
                  <button
                    onClick={toggleCursorMode}
                    className={`p-2 rounded ${
                      cursorMode === "hand" ? "bg-green-500 text-white" : "bg-gray-300 text-black"
                    }`}
                  >
                    {cursorMode === "hand" ? <TbHandStop size={30}/> : <TbPointer size={30}/>}
                  </button>
                </div>
            </div>
        </div>
    )
}

export default Cascading;