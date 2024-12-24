'use client'

import { useState, useEffect } from 'react';
import { ButtonSky, ButtonRed, ButtonSkyBorder, ButtonRedBorder } from '@/components/global/Button';
import { Controller, SubmitHandler, useForm, useFieldArray } from "react-hook-form";
import { getOpdTahun } from '../../Cookie';
import { AlertNotification } from '@/components/global/Alert';
import Select from 'react-select';
import { PohonCascadingEdited } from './PohonCascading';
import { getToken, getUser } from '../../Cookie';
import { LoadingButtonClip } from '@/components/global/Loading';

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
    indikator: indikator[];
}
interface indikator {
    nama_indikator: string;
    targets: target[];
}
type target = {
    target: string;
    satuan: string;
};
interface form {
    formId: number;
    onSave: [
        {data: any},
        {id: number}
    ];
    onCancle: () => void;
}

export const FormCascading: React.FC<{ 
    formId: number; 
    id: number | null; 
    level: number;
    onCancel?: () => void 
    pokin: 'pemda' | 'opd';
}> = ({ id, level, onCancel, pokin }) => {

    const {
      control,
      handleSubmit,
      formState: { errors },
      reset
    } = useForm<FormValue>();
    const [NamaPohon, setNamaPohon] = useState<string>('');
    const [Keterangan, setKeterangan] = useState<string>('');
    const [Pelaksana, setPelaksana] = useState<OptionTypeString[]>([]);
    const [PelaksanaOption, setPelaksanaOption] = useState<OptionTypeString[]>([]);
    const [Tahun, setTahun] = useState<any>(null);
    const [SelectedOpd, setSelectedOpd] = useState<any>(null);
    const [DataAdd, setDataAdd] = useState<any>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [IsAdded, setIsAdded] = useState<boolean>(false);
    const [Deleted, setDeleted] = useState<boolean>(false);
    const [user, setUser] = useState<any>(null);
    const token = getToken();
    
    useEffect(() => {
        const fetchUser = getUser();
        const data = getOpdTahun();
        if(fetchUser){
            setUser(fetchUser.user);
        }
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
            Authorization: `${token}`,
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

    const { fields, append, remove } = useFieldArray({
        control,
        name: "indikator",
    });
    
    const onSubmit: SubmitHandler<FormValue> = async (data) => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        const formData = {
            //key : value
            nama_pohon : data.nama_pohon,
            Keterangan : data.keterangan,
            jenis_pohon:    level === 0 ? "Sub Tematik" :
                            level === 1 ? "Sub Sub Tematik" :
                            level === 2 ? "Super Sub Tematik" :
                            level === 3 ? "Strategic" :
                            level === 4 ? "Tactical" :
                            level === 5 ? "Operational" : "Unknown",
            level_pohon :   level === 0 ? 1 :
                            level === 1 ? 2 :
                            level === 2 ? 3 :
                            level === 3 ? 4 :
                            level === 4 ? 5 :
                            level === 5 ? 6 : "Unknown",
            parent: id,
            tahun: Tahun?.value?.toString(),
            kode_opd: user?.roles == 'super_admin' ? SelectedOpd?.value : user?.kode_opd,
            ...(data.indikator && {
                indikator: data.indikator.map((ind) => ({
                    indikator: ind.nama_indikator,
                    target: ind.targets.map((t) => ({
                        target: t.target,
                        satuan: t.satuan,
                    })),
                })),
            }),
        };
        // console.log(formData);
        try{
            const url = '/pohon_kinerja_opd/create';
            const response = await fetch(`${API_URL}${url}`, {
                method: "POST",
                headers: {
                  Authorization: `${token}`,
                  'Content-Type': 'application/json',
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
                <PohonCascadingEdited tema={DataAdd} deleteTrigger={() => setDeleted((prev) => !prev)}/>
            :
            <div className="tf-nc tf flex flex-col w-[600px] rounded-lg shadow-lg shadow-slate-500">
                <div className="flex pt-3 justify-center font-bold text-lg uppercase border my-3 py-3 border-black rounded-lg">
                    {level == 0 && 
                        <h1>Tambah SubTematik Baru </h1>
                    } 
                    {level == 1 && 
                        <h1>Tambah SubSubTematik Baru </h1>
                    } 
                    {level == 2 && 
                        <h1>Tambah SuperSubTematik Baru </h1>
                    } 
                    {level == 3 && 
                        <h1>Tambah Strategic Baru </h1>
                    } 
                    {level == 4 && 
                        <h1>Tambah Tactical Baru </h1>
                    } 
                    {level == 5 && 
                        <h1>Tambah Operational Baru </h1>
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
                                    "Sub Tematik"
                                } 
                                {level == 1 && 
                                    "Sub Sub Tematik"
                                } 
                                {level == 2 && 
                                    "Super Sub Tematik"
                                } 
                                {level == 3 && 
                                    "Strategic"
                                } 
                                {level == 4 && 
                                    "Tactical"
                                } 
                                {level == 5 && 
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
                        <label className="uppercase text-base font-bold text-gray-700 my-2">
                            indikator sasaran :
                        </label>
                        {fields.map((field, index) => (
                            <div key={index} className="flex flex-col my-2 py-2 px-5 border rounded-lg">
                                <Controller
                                    name={`indikator.${index}.nama_indikator`}
                                    control={control}
                                    defaultValue={field.nama_indikator}
                                    render={({ field }) => (
                                        <div className="flex flex-col py-3">
                                            <label className="uppercase text-xs font-bold text-gray-700 mb-2">
                                                Nama Indikator {index + 1} :
                                            </label>
                                            <input
                                                {...field}
                                                className="border px-4 py-2 rounded-lg"
                                                placeholder={`Masukkan nama indikator ${index + 1}`}
                                            />
                                        </div>
                                    )}
                                />
                                {field.targets.map((_, subindex) => (
                                    <>
                                    <Controller
                                        name={`indikator.${index}.targets.${subindex}.target`}
                                        control={control}
                                        defaultValue={_.target}
                                        render={({ field }) => (
                                            <div className="flex flex-col py-3">
                                                <label className="uppercase text-xs font-bold text-gray-700 mb-2">
                                                    Target :
                                                </label>
                                                <input
                                                    {...field}
                                                    type="text"
                                                    className="border px-4 py-2 rounded-lg"
                                                    placeholder="Masukkan target"
                                                />
                                            </div>
                                        )}
                                    />
                                    <Controller
                                        name={`indikator.${index}.targets.${subindex}.satuan`}
                                        control={control}
                                        defaultValue={_.satuan}
                                        render={({ field }) => (
                                            <div className="flex flex-col py-3">
                                                <label className="uppercase text-xs font-bold text-gray-700 mb-2">
                                                    Satuan :
                                                </label>
                                                <input
                                                    {...field}
                                                    className="border px-4 py-2 rounded-lg"
                                                    placeholder="Masukkan satuan"
                                                />
                                            </div>
                                        )}
                                    />
                                    </>
                                ))}
                                {index >= 0 && (
                                    <ButtonRedBorder
                                        type="button"
                                        onClick={() => remove(index)}
                                        className="w-[200px] my-3"
                                    >
                                        Hapus
                                    </ButtonRedBorder>
                                )}
                            </div>
                        ))}
                        <ButtonSkyBorder
                            className="mb-3 mt-2 w-full"
                            type="button"
                            onClick={() => append({ nama_indikator: "", targets: [{ target: "", satuan: "" }] })}
                        >
                            Tambah Indikator
                        </ButtonSkyBorder>
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

export const FormEditCascading: React.FC<{ 
    formId: number; 
    id: number; 
    level: number;
    onCancel: () => void 
    pokin: 'pemda' | 'opd';
    EditBerhasil : (data: any) => void;
}> = ({ id, level, onCancel, pokin, EditBerhasil }) => {
    
    const {
      control,
      handleSubmit,
      formState: { errors },
      reset
    } = useForm<FormValue>();
    const [Status, setStatus] = useState<string>('');
    const [Parent, setParent] = useState<number | null>(null);
    const [KodeOpd, setKodeOpd] = useState<number | null>(null);
    const [JenisPohon, setJenisPohon] = useState<string | null>(null);
    const [Tahun, setTahun] = useState<any>(null);
    const [Pelaksana, setPelaksana] = useState<OptionTypeString[]>([]);
    const [PelaksanaOption, setPelaksanaOption] = useState<OptionTypeString[]>([]);
    const [SelectedOpd, setSelectedOpd] = useState<any>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [IsEdited, setIsEdited] = useState<boolean>(false);
    const [DataEdit, setDataEdit] = useState<any>(null);
    const [Deleted, setDeleted] = useState<boolean>(false);
    const [Proses, setProses] = useState<boolean>(false);
    const [user, setUser] = useState<any>(null);
    const token = getToken();
    
    useEffect(() => {
        const fetchUser = getUser();
        const data = getOpdTahun();
        if(fetchUser){
            setUser(fetchUser.user);
        }
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

    const { fields, append, remove, replace } = useFieldArray({
        control,
        name: "indikator",
    });

    const fetchPelaksana = async() => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        setIsLoading(true);
        try{ 
          const url = user?.roles == 'super_admin' ? `pegawai/findall?kode_opd=${SelectedOpd?.value}` : `pegawai/findall?kode_opd=${user?.kode_opd}`
          const response = await fetch(`${API_URL}/${url}`,{
            method: 'GET',
            headers: {
              Authorization: `${token}`,
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
                const response = await fetch(`${API_URL}/pohon_kinerja_opd/detail/${id}`, {
                    headers: {
                      Authorization: `${token}`,
                      'Content-Type': 'application/json',
                    },
                });
                if(!response.ok){
                    throw new Error('terdapat kesalahan di koneksi backend');
                }
                const result = await response.json();
                const data = result.data;
                if(data.parent){
                    setParent(data.parent);
                }
                if(data.kode_opd){
                    setKodeOpd(data.kode_opd);
                }
                if(data.jenis_pohon){
                    setJenisPohon(data.jenis_pohon);
                }
                if(data.status){
                    setStatus(data.status);
                }
                reset({
                    nama_pohon: data.nama_pohon || '',
                    keterangan: data.keterangan || '',
                    parent: data.parent || '',
                    pelaksana: data.pelaksana?.map((item: any) => ({
                        value: item.pegawai_id,
                        label: item.nama_pegawai,
                    })) || [],
                    indikator: data.indikator?.map((item: indikator) => ({
                        nama_indikator: item.nama_indikator,
                        targets: item.targets.map((t: target) => ({
                            target: t.target,
                            satuan: t.satuan,
                        })),
                    })),
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
    },[id, reset, token, replace]);
    
    const onSubmit: SubmitHandler<FormValue> = async (data) => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        const pelaksanaIds = Pelaksana?.map((pelaksana) => ({
            pegawai_id: pelaksana.value, // Ubah `value` menjadi `pegawai_id`
        })) || [];
        const formData = {
            //key : value
            nama_pohon : data.nama_pohon,
            Keterangan : data.keterangan,
            jenis_pohon: JenisPohon,
            level_pohon : level,
            parent: Number(Parent),
            pelaksana: pelaksanaIds,
            tahun: Tahun?.value?.toString(),
            kode_opd: KodeOpd,
            status: Status,
            ...(data.indikator && {
                indikator: data.indikator.map((ind) => ({
                    indikator: ind.nama_indikator,
                    target: ind.targets.map((t) => ({
                        target: t.target,
                        satuan: t.satuan,
                    })),
                })),
            }),
        };
        // console.log(formData);
        try{
            setProses(true);
            const url = `/pohon_kinerja_admin/update/${id}`;
            const response = await fetch(`${API_URL}${url}`, {
                method: "PUT",
                headers: {
                  Authorization: `${token}`,
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            if(response.ok){
                AlertNotification("Berhasil", "Berhasil edit pohon", "success", 1000);
                const berhasil = true;
                const result = await response.json();
                const data = result.data;
                if(berhasil){
                    EditBerhasil(data);
                }
            } else {
                AlertNotification("Gagal", "terdapat kesalahan pada backend / database server", "error", 2000);
            }
        } catch(err){
            AlertNotification("Gagal", "cek koneksi internet/terdapat kesalahan pada database server", "error", 2000);
            console.error(err);
        } finally {
            setProses(false);
        }
    };

    return (
        <>
            {IsEdited && DataEdit ?
                <PohonCascadingEdited tema={DataEdit} deleteTrigger={() => setDeleted((prev) => !prev)}/>
            :
            <div className="tf-nc tf flex flex-col w-[600px] rounded-lg shadow-lg shadow-slate-500">
                <div className="flex pt-3 justify-center font-bold text-lg uppercase border my-3 py-3 border-black rounded-lg">
                    Edit Pelaksana
                </div>
                <div className="flex justify-center my-3 w-full">
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className='w-full'
                    >
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
                        <ButtonSky type="submit" className="w-full my-3" disabled={Proses}>
                            {Proses ? 
                                <span className="flex">
                                    <LoadingButtonClip />
                                    Menyimpan...
                                </span> 
                            :
                                "Simpan"
                            }
                        </ButtonSky>
                        <ButtonRed className="w-full my-3" onClick={onCancel}>
                            Batal
                        </ButtonRed>
                    </form>
                </div>
            </div>
            }
        </>
    );
};
