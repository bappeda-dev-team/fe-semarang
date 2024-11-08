'use client'

import './treeflex.css'
import { getOpdTahun } from '@/components/lib/Cookie';
import { useState, useEffect } from 'react';
import Select from 'react-select'
import { ButtonSky } from '@/components/global/Button';

interface OptionType {
    value: number;
    label: string;
}

const PohonCascading = () => {

    const [Tahun, setTahun] = useState<any>(null);
    const [TematikOption, setTematikOption] = useState<OptionType[]>([]);
    const [Tematik, setTematik] = useState<OptionType | null>(null);
    const [IsLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        const data = getOpdTahun();
        if(data.tahun){
            const tahun = {
                value: data.tahun.value,
                label: data.tahun.label,
            }
            setTahun(tahun);
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

    return(
        <>
            <div className="flex flex-col p-5 border-2 rounded-xl mt-3">
                <div className="flex flex-wrap">
                    <h1 className='text-lg font-bold'>Pohon Kinerja Kabupaten</h1>
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
                <ButtonSky>Pilih</ButtonSky>
            </div>
            <div className="flex flex-col p-5 border-2 rounded-t-xl mt-2">
                <h1>{Tematik ? Tematik?.label : "Pilih Tema"}</h1>
            </div>
            <div className="flex flex-col p-5 border-b-2 border-x-2 rounded-b-xl">
                <div className="tf-tree text-center mt-3">
                    <ul>
                        <li>
                            <div className="tf-nc tf flex flex-col w-[700px] rounded-lg">
                                <div className="header flex pt-3 justify-center font-bold text-lg uppercase border my-3 py-3 border-black">
                                    <h1>Tematik Kota</h1>
                                </div>
                                <div className="body flex justify-center my-3">
                                    <table>
                                        <tbody>
                                            <tr>
                                                <td className="min-w-[100px] border px-2 py-3 border-black text-start">Tema</td>
                                                <td className="min-w-[300px] border px-2 py-3 border-black text-start">Peningkatan Kualitas Pelayanan Publik Berbasis Smart City dan Percepatan Reformasi Birokrasi</td>
                                            </tr>
                                            <tr>
                                                <td className="min-w-[100px] border px-2 py-3 border-black text-start">Indikator</td>
                                                <td className="min-w-[300px] border px-2 py-3 border-black text-start">Nilai indexs RB</td>
                                            </tr>
                                            <tr>
                                                <td className="min-w-[100px] border px-2 py-3 border-black text-start">Target/Satuan</td>
                                                <td className="min-w-[300px] border px-2 py-3 border-black text-start">85 indeks</td>
                                            </tr>
                                            <tr>
                                                <td className="min-w-[100px] border px-2 py-3 border-black text-start">Keterangan</td>
                                                <td className="min-w-[300px] border px-2 py-3 border-black text-start">RKPD 2024</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                {/* button */}
                                <div className="flex justify-center border my-3 py-3 border-black">
                                    <button className="border px-5 py-1 rounded-lg border-black">Review</button>
                                </div>
                                <div className="flex justify-center border my-3 py-3 border-black">
                                    <button className="border px-5 py-1 rounded-lg border-black">Edit</button>
                                </div>
                                {/* footer */}
                                <div className="flex justify-between my-3 py-3">
                                    <button className="border px-5 py-1 rounded-lg border-black">Tampilkan semua</button>
                                    <button className="border px-5 py-1 rounded-lg border-black">+ subtema</button>
                                    <button className="border px-5 py-1 rounded-lg border-black">+ ambil (strategic)</button>
                                    <button className="border px-5 py-1 rounded-lg border-black">+ strategic</button>
                                </div>
                            </div>
                            <ul>
                                <li>
                                    <div className="tf-nc tf flex flex-col w-[700px] rounded-lg">
                                        <div className="flex pt-3 justify-center font-bold text-lg uppercase border my-3 py-3 border-black">
                                            <h1>Sub-Tematik Kota</h1>
                                        </div>
                                        <div className="flex justify-center my-3">
                                            <table>
                                                <tbody>
                                                    <tr>
                                                        <td className="min-w-[100px] border px-2 py-1 border-black text-start">Sub Tema</td>
                                                        <td className="min-w-[300px] border px-2 py-1 border-black text-start">Peningkatan Kualitas Pelayanan Publik Berbasis Smart City dan Percepatan Reformasi Birokrasi</td>
                                                    </tr>
                                                    <tr>
                                                        <td className="min-w-[100px] border px-2 py-1 border-black text-start">Indikator</td>
                                                        <td className="min-w-[300px] border px-2 py-1 border-black text-start">Nilai indexs RB</td>
                                                    </tr>
                                                    <tr>
                                                        <td className="min-w-[100px] border px-2 py-1 border-black text-start">Target/Satuan</td>
                                                        <td className="min-w-[300px] border px-2 py-1 border-black text-start">85 indeks</td>
                                                    </tr>
                                                    <tr>
                                                        <td className="min-w-[100px] border px-2 py-1 border-black text-start">Indikator</td>
                                                        <td className="min-w-[300px] border px-2 py-1 border-black text-start">Nilai indexs RB</td>
                                                    </tr>
                                                    <tr>
                                                        <td className="min-w-[100px] border px-2 py-1 border-black text-start">Target/Satuan</td>
                                                        <td className="min-w-[300px] border px-2 py-1 border-black text-start">85 indeks</td>
                                                    </tr>
                                                    <tr>
                                                        <td className="min-w-[100px] border px-2 py-1 border-black text-start">Indikator</td>
                                                        <td className="min-w-[300px] border px-2 py-1 border-black text-start">Nilai indexs RB</td>
                                                    </tr>
                                                    <tr>
                                                        <td className="min-w-[100px] border px-2 py-1 border-black text-start">Target/Satuan</td>
                                                        <td className="min-w-[300px] border px-2 py-1 border-black text-start">85 indeks</td>
                                                    </tr>
                                                    <tr>
                                                        <td className="min-w-[100px] border px-2 py-1 border-black text-start">Keterangan</td>
                                                        <td className="min-w-[300px] border px-2 py-1 border-black text-start">RKPD 2024</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                        <div className="flex justify-center border my-3 py-2 border-black">
                                            <button className="border px-5 py-1 rounded-lg border-black">Review</button>
                                        </div>
                                        <div className="flex justify-evenly border my-3 py-2 border-black">
                                            <button className="border px-5 py-1 rounded-lg border-black">Edit</button>
                                            <button className="border px-5 py-1 rounded-lg border-black">Hapus</button>
                                        </div>
                                        <div className="flex justify-between my-3 py-2">
                                            <button className="border px-5 py-1 rounded-lg border-black">Tampilkan semua</button>
                                            <button className="border px-5 py-1 rounded-lg border-black">+ subtema</button>
                                            <button className="border px-5 py-1 rounded-lg border-black">+ ambil (strategic)</button>
                                            <button className="border px-5 py-1 rounded-lg border-black">+ strategic</button>
                                        </div>
                                    </div>
                                </li>
                                <li>
                                    <div className="tf-nc tf flex flex-col w-[700px] rounded-lg">
                                        <div className="flex pt-3 justify-center font-bold text-lg uppercase border my-3 py-3 border-black">
                                            <h1>Sub-Tematik Kota</h1>
                                        </div>
                                        <div className="flex justify-center my-3">
                                            <table>
                                                <tbody>
                                                    <tr>
                                                        <td className="min-w-[100px] border px-2 py-1 border-black text-start">Sub Tema</td>
                                                        <td className="min-w-[300px] border px-2 py-1 border-black text-start">Peningkatan Kualitas Pelayanan Publik Berbasis Smart City dan Percepatan Reformasi Birokrasi</td>
                                                    </tr>
                                                    <tr>
                                                        <td className="min-w-[100px] border px-2 py-1 border-black text-start">Indikator</td>
                                                        <td className="min-w-[300px] border px-2 py-1 border-black text-start">Nilai indexs RB</td>
                                                    </tr>
                                                    <tr>
                                                        <td className="min-w-[100px] border px-2 py-1 border-black text-start">Target/Satuan</td>
                                                        <td className="min-w-[300px] border px-2 py-1 border-black text-start">85 indeks</td>
                                                    </tr>
                                                    <tr>
                                                        <td className="min-w-[100px] border px-2 py-1 border-black text-start">Keterangan</td>
                                                        <td className="min-w-[300px] border px-2 py-1 border-black text-start">RKPD 2024</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                        <div className="flex justify-center border my-3 py-2 border-black">
                                            <button className="border px-5 py-1 rounded-lg border-black">Review</button>
                                        </div>
                                        <div className="flex justify-evenly border my-3 py-2 border-black">
                                            <button className="border px-5 py-1 rounded-lg border-black">Edit</button>
                                            <button className="border px-5 py-1 rounded-lg border-black">Hapus</button>
                                        </div>
                                        <div className="flex justify-between my-3 py-2">
                                            <button className="border px-5 py-1 rounded-lg border-black">Tampilkan semua</button>
                                            <button className="border px-5 py-1 rounded-lg border-black">+ subtema</button>
                                            <button className="border px-5 py-1 rounded-lg border-black">+ ambil (strategic)</button>
                                            <button className="border px-5 py-1 rounded-lg border-black">+ strategic</button>
                                        </div>
                                    </div>
                                </li>
                                <li>
                                    <div className="tf-nc tf flex flex-col w-[700px] rounded-lg">
                                        <div className="flex pt-3 justify-center font-bold text-lg uppercase border my-3 py-3 border-black">
                                            <h1>Sub-Tematik Kota</h1>
                                        </div>
                                        <div className="flex justify-center my-3">
                                            <table>
                                                <tbody>
                                                    <tr>
                                                        <td className="min-w-[100px] border px-2 py-1 border-black text-start">Sub Tema</td>
                                                        <td className="min-w-[300px] border px-2 py-1 border-black text-start">Peningkatan Kualitas Pelayanan Publik Berbasis Smart City dan Percepatan Reformasi Birokrasi</td>
                                                    </tr>
                                                    <tr>
                                                        <td className="min-w-[100px] border px-2 py-1 border-black text-start">Indikator</td>
                                                        <td className="min-w-[300px] border px-2 py-1 border-black text-start">Nilai indexs RB</td>
                                                    </tr>
                                                    <tr>
                                                        <td className="min-w-[100px] border px-2 py-1 border-black text-start">Target/Satuan</td>
                                                        <td className="min-w-[300px] border px-2 py-1 border-black text-start">85 indeks</td>
                                                    </tr>
                                                    <tr>
                                                        <td className="min-w-[100px] border px-2 py-1 border-black text-start">Keterangan</td>
                                                        <td className="min-w-[300px] border px-2 py-1 border-black text-start">RKPD 2024</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                        <div className="flex justify-center border my-3 py-2 border-black">
                                            <button className="border px-5 py-1 rounded-lg border-black">Review</button>
                                        </div>
                                        <div className="flex justify-evenly border my-3 py-2 border-black">
                                            <button className="border px-5 py-1 rounded-lg border-black">Edit</button>
                                            <button className="border px-5 py-1 rounded-lg border-black">Hapus</button>
                                        </div>
                                        <div className="flex justify-between my-3 py-2">
                                            <button className="border px-5 py-1 rounded-lg border-black">Tampilkan semua</button>
                                            <button className="border px-5 py-1 rounded-lg border-black">+ subtema</button>
                                            <button className="border px-5 py-1 rounded-lg border-black">+ ambil (strategic)</button>
                                            <button className="border px-5 py-1 rounded-lg border-black">+ strategic</button>
                                        </div>
                                    </div>
                                </li>
                            </ul>
                        </li>
                    </ul>
                </div>
            </div>
        </>
    )
}

export default PohonCascading;