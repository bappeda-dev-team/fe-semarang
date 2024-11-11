'use client'

import { getOpdTahun } from '@/components/lib/Cookie';
import { useState, useEffect } from 'react';
import Select from 'react-select'
import { ButtonSky } from '@/components/global/Button';
import PohonTematik from './PohonTematik';
import { TahunNull } from '@/components/global/OpdTahunNull';

interface OptionType {
    value: number;
    label: string;
}

const TematikKab = () => {

    const [Tahun, setTahun] = useState<any>(null);
    const [TematikOption, setTematikOption] = useState<OptionType[]>([]);
    const [Tematik, setTematik] = useState<OptionType | null>(null);
    const [IsLoading, setIsLoading] = useState<boolean>(false);
    const [SelectedOpd, setSelectedOpd] = useState<any>(null);

    useEffect(() => {
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

    const fetchTematik = async() => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        setIsLoading(true);
        try{ 
          const response = await fetch(`${API_URL}/pohon_kinerja_admin/findall/${Tahun?.value}`,{
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          });
          if(!response.ok){
            throw new Error('cant fetch data opd');
          }
          const data = await response.json();
          const tema = data.data.tematiks.map((item: any) => ({
            value : item.id,
            label : item.tema,
          }));
          setTematikOption(tema);
        } catch (err){
          console.log('gagal mendapatkan data opd');
        } finally {
          setIsLoading(false);
        }
      };

    if(Tahun?.value == undefined){
        return <TahunNull />
    }

    return(
        <>
            <div className="flex flex-col p-5 border-2 rounded-xl mt-3">
                <div className="flex flex-wrap">
                    <h1 className='text-lg font-bold'>Pohon Kinerja Pemda</h1>
                    <h1 className='text-lg font-bold ml-1'>{Tahun?.label}</h1>
                </div>
                <div className="flex flex-col py-3">
                    <label
                        className="uppercase text-xs font-bold mb-2"
                        htmlFor="tematik"
                    >
                        Tema :
                    </label>
                    <Select
                        placeholder="Masukkan Tema"
                        isSearchable
                        isClearable
                        options={TematikOption}
                        isLoading={IsLoading}
                        onChange={(option) => setTematik(option)}
                        value={Tematik}
                        onMenuOpen={() => {
                            if(TematikOption.length == 0){
                                fetchTematik();
                            }
                        }}
                        styles={{
                            control: (baseStyles) => ({
                            ...baseStyles,
                            borderRadius: '8px',
                        })
                        }}
                    />
                </div>
            </div>
            <div className="flex flex-col p-5 border-2 rounded-t-xl mt-2">
                <h1 className="font-bold">{Tematik ? Tematik?.label : "Pilih Tema"}</h1>
            </div>
            {Tematik &&
                <PohonTematik id={Tematik?.value}/>
            }
        </>
    )
}

export default TematikKab;