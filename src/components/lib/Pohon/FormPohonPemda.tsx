'use client'

import { useState, useEffect } from 'react';
import { ButtonSky, ButtonRed } from '@/components/global/Button';
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { getOpdTahun } from '../Cookie';
import { AlertNotification } from '@/components/global/Alert';
import Select from 'react-select';
import { PohonEdited } from './Pohon';

interface OptionTypeString {
    value: string;
    label: string;
}
interface OptionType {
    value: number;
    label: string;
}
interface FormValue {
    id: number;
    parent: string;
    nama_pohon: string;
    jenis_pohon: string;
    keterangan: string;
    tahun: OptionTypeString;
    kode_opd: OptionTypeString;
    pelaksana: OptionTypeString[];
    pohon?: OptionType;
}
interface form {
    formId: number;
    onSave: [
        {data: any},
        {id: number}
    ];
    onCancle: () => void;
}

export const FormPohonPemda: React.FC<{ 
    formId: number; 
    id: number | null; 
    level: number; 
    onSave?: (data: any, id: number) => void; 
    onCancel?: () => void 
    pokin: 'pemda' | 'opd';
}> = ({ id, level, formId, onSave, onCancel, pokin }) => {

    const {
      control,
      handleSubmit,
      formState: { errors },
      reset
    } = useForm<FormValue>();
    const [formData, setFormData] = useState({ tema: '', keterangan: '' });
    const [NamaPohon, setNamaPohon] = useState<string>('');
    const [Keterangan, setKeterangan] = useState<string>('');
    const [KodeOpd, setKodeOpd] = useState<OptionTypeString | null>(null);
    const [Pelaksana, setPelaksana] = useState<OptionTypeString[]>([]);
    const [OpdOption, setOpdOption] = useState<OptionTypeString[]>([]);
    const [PelaksanaOption, setPelaksanaOption] = useState<OptionTypeString[]>([]);
    const [Tahun, setTahun] = useState<any>(null);
    const [SelectedOpd, setSelectedOpd] = useState<any>(null);
    const [DataAdd, setDataAdd] = useState<any>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [IsAdded, setIsAdded] = useState<boolean>(false);
    const [Deleted, setDeleted] = useState<boolean>(false);
    
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

    const fetchOpd = async() => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        setIsLoading(true);
        try{ 
          const response = await fetch(`${API_URL}/opd/findall`,{
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          });
          if(!response.ok){
            throw new Error('cant fetch data opd');
          }
          const data = await response.json();
          const opd = data.data.map((item: any) => ({
            value : item.kode_opd,
            label : item.nama_opd,
          }));
          setOpdOption(opd);
        } catch (err){
          console.log('gagal mendapatkan data opd');
        } finally {
          setIsLoading(false);
        }
      };
    const fetchPelaksana = async() => {
      const API_URL = process.env.NEXT_PUBLIC_API_URL;
      setIsLoading(true);
      try{ 
        const response = await fetch(`${API_URL}/pegawai/findall`,{
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if(!response.ok){
          throw new Error('cant fetch data opd');
        }
        const data = await response.json();
        const opd = data.data.map((item: any) => ({
          value : item.id,
          label : item.nama_pegawai,
        }));
        setPelaksanaOption(opd);
      } catch (err){
        console.log('gagal mendapatkan data opd');
      } finally {
        setIsLoading(false);
      }
    };
    
    const onSubmit: SubmitHandler<FormValue> = async (data) => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        const pelaksanaIds = Pelaksana?.map((pelaksana) => ({
            pegawai_id: pelaksana.value, // Ubah `value` menjadi `pegawai_id`
        })) || [];
        const formData = {
            //key : value
            nama_pohon : data.nama_pohon,
            Keterangan : data.keterangan,
            jenis_pohon:    level === 0 ? "SubTematik" :
                            level === 1 ? "SubSubTematik" :
                            level === 2 ? "SuperSubTematik" :
                            level === 3 ? "StrategicPemda" :
                            level === 4 ? "TacticalPemda" :
                            level === 5 ? "OperationalPemda" : "Unknown",
            level_pohon :   level === 0 ? 1 :
                            level === 1 ? 2 :
                            level === 2 ? 3 :
                            level === 3 ? 4 :
                            level === 4 ? 5 :
                            level === 5 ? 6 : "Unknown",
            parent: id,
            pelaksana: pelaksanaIds,
            tahun: Tahun?.value?.toString(),
            kode_opd:  (level === 0 || level === 1 || level === 2) ? null : data.kode_opd?.value,
        };
        // console.log(formData);
        try{
            const url = '/pohon_kinerja_admin/create';
            const response = await fetch(`${API_URL}${url}`, {
                method: "POST",
                headers: {
                    "Content-Type" : "application/json",
                },
                body: JSON.stringify(formData),
            });
            if(response.ok){
                AlertNotification("Berhasil", "Berhasil menambahkan pohon", "success", 1000);
                setIsAdded(true);
                const result = await response.json();
                const data = result.data;
                setDataAdd(data);
            } else {
                AlertNotification("Gagal", "terdapat kesalahan pada backend / database server", "error", 2000);
            }
        } catch(err){
            AlertNotification("Gagal", "cek koneksi internet/terdapat kesalahan pada database server", "error", 2000);
            console.error(err);
        }
    };

    return (
        <li>
            {IsAdded && DataAdd ?
                <PohonEdited tema={DataAdd} deleteTrigger={() => setDeleted((prev) => !prev)}/>
            :
            <div className="tf-nc tf flex flex-col w-[600px] rounded-lg shadow-lg shadow-slate-500">
                <div className="flex pt-3 justify-center font-bold text-lg uppercase border my-3 py-3 border-black rounded-lg">
                    {level == 0 && 
                        <h1>Tambah SubTematik</h1>
                    } 
                    {level == 1 && 
                        <h1>Tambah SubSubTematik</h1>
                    } 
                    {level == 2 && 
                        <h1>Tambah SuperSubTematik</h1>
                    } 
                    {level == 3 && 
                        <h1>Tambah Strategic Pemda</h1>
                    } 
                    {level == 4 && 
                        <h1>Tambah Tactical Pemda</h1>
                    } 
                    {level == 5 && 
                        <h1>Tambah Operational Pemda</h1>
                    }
                </div>
                <div className="flex justify-center my-3 w-full">
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className='w-full'
                    >
                        <div className="flex flex-col py-3">
                            <label
                                className="uppercase text-xs font-bold text-gray-700 my-2"
                                htmlFor="nama_pohon"
                            >
                                {level == 0 && 
                                    "SubTematik"
                                } 
                                {level == 1 && 
                                    "SubSubTematik"
                                } 
                                {level == 2 && 
                                    "SuperSubTematik"
                                } 
                                {level == 3 && 
                                    "Strategic Pemda"
                                } 
                                {level == 4 && 
                                    "Tactical Pemda"
                                } 
                                {level == 5 && 
                                    "Operational Pemda"
                                }
                            </label>
                            <Controller
                                name="nama_pohon"
                                control={control}
                                render={({ field }) => (
                                    <input
                                        {...field}
                                        className="border px-4 py-2 rounded-lg"
                                        id="nama_pohon"
                                        type="text"
                                        placeholder="masukkan Pohon"
                                        value={field.value || NamaPohon}
                                        onChange={(e) => {
                                            field.onChange(e);
                                            setNamaPohon(e.target.value);
                                        }}
                                    />
                                )}
                            />
                        </div>
                        {(level === 3 || level === 4 || level === 5 || level === 6) &&
                        <div className="flex flex-col py-3">
                            <label
                                className="uppercase text-xs font-bold text-gray-700 my-2"
                                htmlFor="kode_opd"
                            >
                                Perangkat Daerah
                            </label>
                            <Controller
                                name="kode_opd"
                                control={control}
                                rules={{required : "Perangkat Daerah Harus Terisi"}}
                                render={({ field }) => (
                                <>
                                    <Select
                                        {...field}
                                        placeholder="Masukkan Perangkat Daerah"
                                        value={KodeOpd}
                                        options={OpdOption}
                                        isLoading={isLoading}
                                        isSearchable
                                        isClearable
                                        onMenuOpen={() => {
                                            if (OpdOption.length === 0) {
                                                fetchOpd();
                                            }
                                        }}
                                        onChange={(option) => {
                                            field.onChange(option);
                                            setKodeOpd(option);
                                        }}
                                        styles={{
                                            control: (baseStyles) => ({
                                            ...baseStyles,
                                            borderRadius: '8px',
                                            textAlign: 'start',
                                            })
                                        }}
                                    />
                                    {errors.kode_opd ?
                                        <h1 className="text-red-500">
                                            {errors.kode_opd.message}
                                        </h1>
                                    :
                                        <h1 className="text-slate-300 text-xs">*Perangkat Daerah Harus Terisi</h1>
                                    }
                                </>
                                )}
                            />
                        </div>
                        }
                        {pokin === 'opd' && 
                            <div className="flex flex-col py-3">
                                <label
                                    className="uppercase text-xs font-bold text-gray-700 my-2"
                                    htmlFor="pelaksana"
                                >
                                    Pelaksana
                                </label>
                                <Controller
                                    name="pelaksana"
                                    control={control}
                                    render={({ field }) => (
                                    <>
                                        <Select
                                            {...field}
                                            placeholder="Pilih Pelaksana (bisa lebih dari satu)"
                                            value={Pelaksana}
                                            options={PelaksanaOption}
                                            isLoading={isLoading}
                                            isSearchable
                                            isClearable
                                            isMulti
                                            onMenuOpen={() => {
                                                if (PelaksanaOption.length === 0) {
                                                    fetchPelaksana();
                                                }
                                            }}
                                            onChange={(option) => {
                                                field.onChange(option || []);
                                                setPelaksana(option as OptionTypeString[]);
                                            }}
                                            styles={{
                                                control: (baseStyles) => ({
                                                ...baseStyles,
                                                borderRadius: '8px',
                                                textAlign: 'start',
                                                })
                                            }}
                                        />
                                    </>
                                    )}
                                />
                            </div>
                        }
                        <div className="flex flex-col py-3">
                            <label
                                className="uppercase text-xs font-bold text-gray-700 my-2"
                                htmlFor="keterangan"
                            >
                                Keterangan:
                            </label>
                            <Controller
                                name="keterangan"
                                control={control}
                                render={({ field }) => (
                                    <textarea
                                        {...field}
                                        className="border px-4 py-2 rounded-lg"
                                        id="keterangan"
                                        placeholder="masukkan keterangan"
                                        value={field.value || Keterangan}
                                        onChange={(e) => {
                                            field.onChange(e);
                                            setKeterangan(e.target.value);
                                        }}
                                    />
                                )}
                            />
                        </div>
                        <ButtonSky type="submit" className="w-full my-3">
                            Simpan
                        </ButtonSky>
                        <ButtonRed className="w-full my-3" onClick={onCancel}>
                            Batal
                        </ButtonRed>
                    </form>
                </div>
            </div>
            }
        </li>
    );
};

export const FormAmbilPohon: React.FC<{ 
    formId: number; 
    id: number; 
    level: number; 
    onSave: (data: any, id: number) => void; 
    onCancel: () => void 
}> = ({ id, level, formId, onSave, onCancel }) => {
    
        const {
      control,
      handleSubmit,
      formState: { errors },
      reset
    } = useForm<FormValue>();
    const [formData, setFormData] = useState({ tema: '', keterangan: '' });
    const [KodeOpd, setKodeOpd] = useState<OptionTypeString | null>(null);
    const [Pohon, setPohon] = useState<OptionType | null>(null);
    const [Tahun, setTahun] = useState<any>(null);
    const [SelectedOpd, setSelectedOpd] = useState<any>(null);
    const [OpdOption, setOpdOption] = useState<OptionTypeString[]>([]);
    const [PohonOption, setPohonOption] = useState<OptionType[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [IsAdded, setIsAdded] = useState<boolean>(false);
    const [DataAdd, setDataAdd] = useState<any>(null);
    const [Deleted, setDeleted] = useState<boolean>(false);
    
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

    const fetchOpd = async() => {
      const API_URL = process.env.NEXT_PUBLIC_API_URL;
      setIsLoading(true);
      try{ 
        const response = await fetch(`${API_URL}/opd/findall`,{
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if(!response.ok){
          throw new Error('cant fetch data opd');
        }
        const data = await response.json();
        const opd = data.data.map((item: any) => ({
          value : item.kode_opd,
          label : item.nama_opd,
        }));
        setOpdOption(opd);
      } catch (err){
        console.log('gagal mendapatkan data opd');
      } finally {
        setIsLoading(false);
      }
    };
    const fetchPohon = async(SelectedOpd: string) => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        setIsLoading(true);
        try{
          const url = 
          (level === 0 || level === 1 || level === 2 || level === 3) 
            ? `pohon_kinerja_opd/strategic_no_parent/${SelectedOpd}/${Tahun?.value}` 
            : level === 4 
            ? `pohon_kinerja/tactical/${SelectedOpd}/${Tahun?.value}` 
            : level === 5 
            ? `pohon_kinerja/operational/${SelectedOpd}/${Tahun?.value}` 
            : `unknown`;
          const response = await fetch(`${API_URL}/${url}`,{
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          });
          if(!response.ok){
            throw new Error('cant fetch data opd');
          }
          const data = await response.json();
          if (level === 0 || level === 1 || level === 2 || level === 3) {
            const pohon = data.data.map((item: any) => ({
              value: item.id,
              label: item.strategi,
            }));
            setPohonOption(pohon);
        } else if (level === 4 || level === 5) {
            const pohon = data.data.map((item: any) => ({
                value: item.id,
                label: item.nama_pohon,
            }));
            setPohonOption(pohon);
          }
        } catch (err){
          console.log('gagal mendapatkan data pohon');
        } finally {
          setIsLoading(false);
        }
      };
    
    const onSubmit: SubmitHandler<FormValue> = async (data) => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        const formData = {
            //key : value
            id: data.pohon?.value,
            jenis_pohon:    (level === 0 || level === 1 || level === 2 || level === 3) ? "Strategic" :
                            level === 4 ? "Tactical" :
                            level === 5 ? "Operational" : "Unknown",
            parent: id,
        };
        // console.log(formData);
        try{
            const response = await fetch(`${API_URL}/pohon_kinerja_admin/clone_strategic/create`, {
                method: "POST",
                headers: {
                    "Content-Type" : "application/json",
                },
                body: JSON.stringify(formData),
            });
            if(response.ok){
                AlertNotification("Berhasil", "Berhasil menambahkan pohon", "success", 1000);
                setIsAdded(true);
                const result = await response.json();
                const data = result.data;
                setDataAdd(data);
            } else {
                AlertNotification("Gagal", "terdapat kesalahan pada backend / database server", "error", 2000);
            }
        } catch(err){
            AlertNotification("Gagal", "cek koneksi internet/terdapat kesalahan pada database server", "error", 2000);
            console.error(err);
        }
    };

    return (
        <li>
            {IsAdded && DataAdd ?
                <PohonEdited tema={DataAdd} deleteTrigger={() => setDeleted((prev) => !prev)}/>
            :
            <div className="tf-nc tf flex flex-col w-[600px] rounded-lg shadow-lg shadow-slate-500">
                <div className="flex pt-3 justify-center font-bold text-lg uppercase border my-3 py-3 border-black rounded-lg">
                    {(level === 0 || level === 1 || level === 2 || level === 3) && 
                        <h1>Ambil Strategic </h1>
                    }
                    {level === 4 && 
                        <h1>Ambil Tactical </h1>
                    }
                    {level === 5 && 
                        <h1>Ambil Operational </h1>
                    }
                </div>
                <div className="flex justify-center my-3 w-full">
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className='w-full'
                    >
                        <div className="flex flex-col py-3">
                            <label
                                className="uppercase text-xs font-bold text-gray-700 my-2"
                                htmlFor="kode_opd"
                            >
                                Perangkat Daerah
                            </label>
                            <Controller
                                name="kode_opd"
                                control={control}
                                rules={{required : "Perangkat Daerah Harus Terisi"}}
                                render={({ field }) => (
                                <>
                                    <Select
                                        {...field}
                                        placeholder="Masukkan Perangkat Daerah"
                                        value={KodeOpd}
                                        options={OpdOption}
                                        isLoading={isLoading}
                                        isSearchable
                                        isClearable
                                        onMenuOpen={() => {
                                            if (OpdOption.length === 0) {
                                                fetchOpd();
                                            }
                                        }}
                                        onChange={(option) => {
                                            field.onChange(option);
                                            setKodeOpd(option);
                                        }}
                                        styles={{
                                            control: (baseStyles) => ({
                                            ...baseStyles,
                                            borderRadius: '8px',
                                            textAlign: 'start',
                                            })
                                        }}
                                    />
                                    {errors.kode_opd ?
                                        <h1 className="text-red-500">
                                            {errors.kode_opd.message}
                                        </h1>
                                    :
                                        <h1 className="text-slate-300 text-xs">*Perangkat Daerah Harus Terisi</h1>
                                    }
                                </>
                                )}
                            />
                        </div>
                        <div className="flex flex-col py-3">
                            <label
                                className="uppercase text-xs font-bold text-gray-700 my-2"
                                htmlFor="pohon"
                            >
                                {(level === 0 || level === 1 || level === 2 || level === 3) && 
                                    <h1>Strategic</h1>
                                } 
                                {level == 4 && 
                                    <h1>Tactical</h1>
                                } 
                                {level == 5 && 
                                    <h1>Operational</h1>
                                }
                            </label>
                            <Controller
                                name="pohon"
                                control={control}
                                rules={{required : "Pohon Harus Terisi"}}
                                render={({ field }) => (
                                <>
                                    <Select
                                        {...field}
                                        placeholder="Pilih OPD terlebih dahulu"
                                        value={Pohon}
                                        options={PohonOption}
                                        isLoading={isLoading}
                                        isSearchable
                                        isClearable
                                        onMenuOpen={() => {
                                            if (KodeOpd?.value != null) {
                                                fetchPohon(KodeOpd?.value);
                                            } else if(KodeOpd?.value == null){
                                                setPohonOption([]);
                                                setPohon(null);
                                            }
                                        }}
                                        onChange={(option) => {
                                            field.onChange(option);
                                            setPohon(option);
                                        }}
                                        styles={{
                                            control: (baseStyles) => ({
                                            ...baseStyles,
                                            borderRadius: '8px',
                                            textAlign: 'start',
                                            })
                                        }}
                                    />
                                    {errors.pohon ?
                                        <h1 className="text-red-500">
                                            {errors.pohon.message}
                                        </h1>
                                    :
                                        <h1 className="text-slate-300 text-xs">*Pohon Harus Terisi</h1>
                                    }
                                </>
                                )}
                            />
                        </div>
                        <ButtonSky type="submit" className="w-full my-3">
                            Simpan
                        </ButtonSky>
                        <ButtonRed className="w-full my-3" onClick={onCancel}>
                            Batal
                        </ButtonRed>
                    </form>
                </div>
            </div>
            }
        </li>
    );
};

export const FormEditPohon: React.FC<{ 
    formId: number; 
    id: number; 
    level: number; 
    onSave?: (data: any, id: number) => void; 
    onCancel: () => void 
    pokin: 'pemda' | 'opd';
}> = ({ id, level, formId, onSave, onCancel, pokin }) => {
    
    const {
      control,
      handleSubmit,
      formState: { errors },
      reset
    } = useForm<FormValue>();
    const [NamaPohon, setNamaPohon] = useState<string>('');
    const [Keterangan, setKeterangan] = useState<string>('');
    const [Parent, setParent] = useState<number | null>(null);
    const [Tahun, setTahun] = useState<any>(null);
    const [Pelaksana, setPelaksana] = useState<OptionTypeString[]>([]);
    const [PelaksanaOption, setPelaksanaOption] = useState<OptionTypeString[]>([]);
    const [SelectedOpd, setSelectedOpd] = useState<any>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    
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

    const fetchPelaksana = async() => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        setIsLoading(true);
        try{ 
          const response = await fetch(`${API_URL}/pegawai/findall`,{
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          });
          if(!response.ok){
            throw new Error('cant fetch data opd');
          }
          const data = await response.json();
          const opd = data.data.map((item: any) => ({
            value : item.id,
            label : item.nama_pegawai,
          }));
          setPelaksanaOption(opd);
        } catch (err){
          console.log('gagal mendapatkan data opd');
        } finally {
          setIsLoading(false);
        }
      };

    useEffect(() => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        const fetchStrategic = async() => {
            try{
                const response = await fetch(`${API_URL}/pohon_kinerja_opd/detail/${id}`);
                if(!response.ok){
                    throw new Error('terdapat kesalahan di koneksi backend');
                }
                const result = await response.json();
                const data = result.data;
                if(data.parent){
                    setParent(data.parent);
                }
                reset({
                    nama_pohon: data.nama_pohon || '',
                    keterangan: data.keterangan || '',
                    parent: data.parent || '',
                    pelaksana: data.pelaksana?.map((item: any) => ({
                        value: item.pegawai_id,
                        label: item.nama_pegawai,
                    })) || [],
                });
                setPelaksana(
                    data.pelaksana?.map((item: any) => ({
                        value: item.pegawai_id,
                        label: item.nama_pegawai,
                    })) || []
                );
            } catch(err) {
                console.error(err, 'gagal mengambil data sesuai id pohon')
            }
        }
        fetchStrategic();
    },[id, reset]);
    
    const onSubmit: SubmitHandler<FormValue> = async (data) => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        const pelaksanaIds = Pelaksana?.map((pelaksana) => ({
            pegawai_id: pelaksana.value, // Ubah `value` menjadi `pegawai_id`
        })) || [];
        const formData = {
            //key : value
            nama_pohon : data.nama_pohon,
            Keterangan : data.keterangan,
            jenis_pohon:    level === 1 ? "SubTematik" :
                            level === 4 ? "Strategic" :
                            level === 5 ? "Tactical" :
                            level === 6 ? "Operational" : "Unknown",
            level_pohon :   level,
            parent: Number(Parent),
            pelaksana: pelaksanaIds,
            tahun: Tahun?.value?.toString(),
            kode_opd: SelectedOpd?.value,
        };
        // console.log(formData);
        try{
            const url = level == 1 ? `/pohon_kinerja_admin/update/${id}` : `/pohon_kinerja_opd/update/${id}`;
            const response = await fetch(`${API_URL}${url}`, {
                method: "PUT",
                headers: {
                    "Content-Type" : "application/json",
                },
                body: JSON.stringify(formData),
            });
            if(response.ok){
                AlertNotification("Berhasil", "Berhasil edit pohon", "success", 1000);
                onCancel();
            } else {
                AlertNotification("Gagal", "terdapat kesalahan pada backend / database server", "error", 2000);
            }
        } catch(err){
            AlertNotification("Gagal", "cek koneksi internet/terdapat kesalahan pada database server", "error", 2000);
            console.error(err);
        }
    };

    return (
        <div className="tf-nc tf flex flex-col w-[600px] rounded-lg shadow-lg shadow-slate-500">
            <div className="flex pt-3 justify-center font-bold text-lg uppercase border my-3 py-3 border-black rounded-lg">
                {level == 1 && 
                    <h1>Edit Sub Tematik </h1>
                } 
                {level == 4 && 
                    <h1>Edit Strategic </h1>
                } 
                {level == 5 && 
                    <h1>Edit Tactical </h1>
                }
                {level == 6 && 
                    <h1>Edit Operational </h1>
                }
            </div>
            <div className="flex justify-center my-3 w-full">
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className='w-full'
                >
                    <div className="flex flex-col py-3">
                        <label
                            className="uppercase text-xs font-bold text-gray-700 my-2"
                            htmlFor="nama_pohon"
                        >
                            {level == 1 && 
                                "SubTematik"
                            } 
                            {level == 4 && 
                                "Strategic"
                            } 
                            {level == 5 && 
                                "Tactical"
                            }
                            {level == 6 && 
                                "Operational"
                            }
                        </label>
                        <Controller
                            name="nama_pohon"
                            control={control}
                            render={({ field }) => (
                                <input
                                    {...field}
                                    className="border px-4 py-2 rounded-lg"
                                    id="nama_pohon"
                                    type="text"
                                    placeholder="masukkan Pohon"
                                    value={field.value || NamaPohon}
                                    onChange={(e) => {
                                        field.onChange(e);
                                        setNamaPohon(e.target.value);
                                    }}
                                />
                            )}
                        />
                    </div>
                    {pokin === 'opd' && 
                        <div className="flex flex-col py-3">
                            <label
                                className="uppercase text-xs font-bold text-gray-700 my-2"
                                htmlFor="pelaksana"
                            >
                                Pelaksana
                            </label>
                            <Controller
                                name="pelaksana"
                                control={control}
                                render={({ field }) => (
                                <>
                                    <Select
                                        {...field}
                                        placeholder="Pilih Pelaksana (bisa lebih dari satu)"
                                        value={Pelaksana}
                                        options={PelaksanaOption}
                                        isLoading={isLoading}
                                        isSearchable
                                        isClearable
                                        isMulti
                                        onMenuOpen={() => {
                                            if (PelaksanaOption.length === 0) {
                                                fetchPelaksana();
                                            }
                                        }}
                                        onChange={(option) => {
                                            field.onChange(option || []);
                                            setPelaksana(option as OptionTypeString[]);
                                        }}
                                        styles={{
                                            control: (baseStyles) => ({
                                            ...baseStyles,
                                            borderRadius: '8px',
                                            textAlign: 'start',
                                            })
                                        }}
                                    />
                                </>
                                )}
                            />
                        </div>
                    }
                    <div className="flex flex-col py-3">
                        <label
                            className="uppercase text-xs font-bold text-gray-700 my-2"
                            htmlFor="keterangan"
                        >
                            Keterangan:
                        </label>
                        <Controller
                            name="keterangan"
                            control={control}
                            render={({ field }) => (
                                <textarea
                                    {...field}
                                    className="border px-4 py-2 rounded-lg"
                                    id="keterangan"
                                    placeholder="masukkan keterangan"
                                    value={field.value || Keterangan}
                                    onChange={(e) => {
                                        field.onChange(e);
                                        setKeterangan(e.target.value);
                                    }}
                                />
                            )}
                        />
                    </div>
                    <ButtonSky type="submit" className="w-full my-3">
                        Simpan
                    </ButtonSky>
                    <ButtonRed className="w-full my-3" onClick={onCancel}>
                        Batal
                    </ButtonRed>
                </form>
            </div>
        </div>
    );
};
