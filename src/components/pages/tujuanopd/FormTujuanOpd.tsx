'use client'

import { Controller, SubmitHandler, useForm, useFieldArray } from "react-hook-form";
import { useState, useEffect } from "react";
import { ButtonGreen, ButtonRedBorder, ButtonSkyBorder, ButtonRed } from "@/components/global/Button";
import { LoadingClip } from "@/components/global/Loading";
import { AlertNotification } from "@/components/global/Alert";
import { useParams, useRouter } from "next/navigation";
import { getToken, getUser, getOpdTahun } from "@/components/lib/Cookie";
import { LoadingButtonClip } from "@/components/global/Loading";

interface OptionTypeString {
    value: string;
    label: string;
}
interface FormValue {
    tujuan: string;
    rumus_perhitungan: string;
    sumber_data: string;
    tahun_awal: string;
    tahun_akhir: string;
    kode_opd: string;
    indikator: indikator[];
}
interface indikator {
    nama_indikator: string;
    targets: target[];
}
type target = {
    tahun: string;
    target: string;
    satuan: string;
}

export const FormTujuanOpd = () => {

    const {
      control,
      handleSubmit,
      formState: { errors },
    } = useForm<FormValue>();
    const [Tujuan, setTujuan] = useState<string>('');
    const [Rumus, setRumus] = useState<string>('');
    const [SumberData, setSumberData] = useState<string>('');
    // const [TahunAwal, setTahunAwal] = useState<string>('');
    // const [TahunAkhir, setTahunAkhir] = useState<string>('');
    // const [Tahun, setTahun] = useState<OptionTypeString | null>(null);
    const [User, setUser] = useState<any>(null);
    const [SelectedOpd, setSelectedOpd] = useState<any>(null);
    const [Proses, setProses] = useState<boolean>(false);
    const router = useRouter();
    const token = getToken();

    useEffect(() => {
        const data = getOpdTahun();
        const fetchUser = getUser();
        if (fetchUser) {
            setUser(fetchUser.user);
        }
        if(data.opd){
            const opd = {
                value: data.opd.value,
                label: data.opd.label,
            }
            setSelectedOpd(opd);
        }
    }, [])

    const { fields, append, remove } = useFieldArray({
        control,
        name: "indikator",
    });

    const onSubmit: SubmitHandler<FormValue> = async (data) => {
      const API_URL = process.env.NEXT_PUBLIC_API_URL;
      const formData = {
        //key : value
        tujuan : data.tujuan,
        rumus_perhitungan : data.rumus_perhitungan,
        sumber_data : data.sumber_data,
        tahun_awal : "2024",
        tahun_akhir : "2024",
        kode_opd : User?.roles == 'super_admin' ? SelectedOpd?.value : User?.kode_opd,
        ...(data.indikator && {
          indikator: data.indikator.map((ind) => ({
              indikator: ind.nama_indikator,
              target: ind.targets.map((t) => ({
                  tahun: t.tahun,
                  target: t.target,
                  satuan: t.satuan,
              })),
          })),
        }),
      };
    //   console.log(formData);
      try{
        setProses(true);
          const response = await fetch(`${API_URL}/tujuan_opd/create`, {
              method: "POST",
              headers: {
                Authorization: `${token}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(formData),
          });
          if(response.ok){
              AlertNotification("Berhasil", "Berhasil menambahkan data Tujuan OPD", "success", 1000);
              router.push("/tujuanopd");
          } else {
              AlertNotification("Gagal", "terdapat kesalahan pada backend / database server", "error", 2000);
          }
      } catch(err){
          AlertNotification("Gagal", "cek koneksi internet/terdapat kesalahan pada database server", "error", 2000);
      } finally {
        setProses(false);
      }
    };

    return(
    <>
        <div className="border p-5 rounded-xl shadow-xl">
            <h1 className="uppercase font-bold">Form Tambah Tujuan OPD :</h1>
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col mx-5 py-5"
            >
                <div className="flex flex-col py-3">
                    <label
                        className="uppercase text-xs font-bold text-gray-700 my-2"
                        htmlFor="tujuan"
                    >
                        Tujuan OPD :
                    </label>
                    <Controller
                        name="tujuan"
                        control={control}
                        rules={{ required: "Tujuan OPD harus terisi" }}
                        render={({ field }) => (
                            <>
                                <input
                                    {...field}
                                    className="border px-4 py-2 rounded-lg"
                                    id="tujuan"
                                    type="text"
                                    placeholder="masukkan Tujuan OPD"
                                    value={field.value || Tujuan}
                                    onChange={(e) => {
                                        field.onChange(e);
                                        setTujuan(e.target.value);
                                    }}
                                />
                                {errors.tujuan ?
                                    <h1 className="text-red-500">
                                    {errors.tujuan.message}
                                    </h1>
                                    :
                                    <h1 className="text-slate-300 text-xs">*Tujuan OPD Harus Terisi</h1>
                                }
                            </>
                        )}
                    />
                </div>
                <div className="flex flex-col py-3">
                    <label
                        className="uppercase text-xs font-bold text-gray-700 my-2"
                        htmlFor="rumus_perhitungan"
                    >
                        Rumus Perhitungan :
                    </label>
                    <Controller
                        name="rumus_perhitungan"
                        control={control}
                        rules={{ required: "Rumus Perhitungan harus terisi" }}
                        render={({ field }) => (
                            <>
                                <textarea
                                    {...field}
                                    className="border px-4 py-2 rounded-lg"
                                    id="rumus_perhitungan"
                                    placeholder="masukkan Rumus Perhitungan"
                                    value={field.value || Rumus}
                                    onChange={(e) => {
                                        field.onChange(e);
                                        setRumus(e.target.value);
                                    }}
                                />
                                {errors.rumus_perhitungan ?
                                    <h1 className="text-red-500">
                                    {errors.rumus_perhitungan.message}
                                    </h1>
                                    :
                                    <h1 className="text-slate-300 text-xs">*Rumus Perhitungan Harus Terisi</h1>
                                }
                            </>
                        )}
                    />
                </div>
                <div className="flex flex-col py-3">
                    <label
                        className="uppercase text-xs font-bold text-gray-700 my-2"
                        htmlFor="sumber_data"
                    >
                        Sumber Data :
                    </label>
                    <Controller
                        name="sumber_data"
                        control={control}
                        rules={{ required: "Sumber Data harus terisi" }}
                        render={({ field }) => (
                            <>
                                <input
                                    {...field}
                                    className="border px-4 py-2 rounded-lg"
                                    id="sumber_data"
                                    type="text"
                                    placeholder="masukkan Sumber Data"
                                    value={field.value || SumberData}
                                    onChange={(e) => {
                                        field.onChange(e);
                                        setSumberData(e.target.value);
                                    }}
                                />
                                {errors.sumber_data ?
                                    <h1 className="text-red-500">
                                    {errors.sumber_data.message}
                                    </h1>
                                    :
                                    <h1 className="text-slate-300 text-xs">*Sumber Data Harus Terisi</h1>
                                }
                            </>
                        )}
                    />
                </div>
                {/* <div className="flex flex-col py-3">
                    <label
                        className="uppercase text-xs font-bold text-gray-700 my-2"
                        htmlFor="tahun_awal"
                    >
                        Tahun Awal :
                    </label>
                    <Controller
                        name="tahun_awal"
                        control={control}
                        rules={{ required: "Tahun Awal harus terisi" }}
                        render={({ field }) => (
                            <>
                                <input
                                    {...field}
                                    className="border px-4 py-2 rounded-lg"
                                    id="tahun_awal"
                                    type="text"
                                    placeholder="masukkan Tahun Awal"
                                    value={field.value || TahunAwal}
                                    onChange={(e) => {
                                        field.onChange(e);
                                        setTahunAwal(e.target.value);
                                    }}
                                />
                                {errors.tahun_awal ?
                                    <h1 className="text-red-500">
                                    {errors.tahun_awal.message}
                                    </h1>
                                    :
                                    <h1 className="text-slate-300 text-xs">*Tahun Awal Harus Terisi</h1>
                                }
                            </>
                        )}
                    />
                </div>
                <div className="flex flex-col py-3">
                    <label
                        className="uppercase text-xs font-bold text-gray-700 my-2"
                        htmlFor="tahun_akhir"
                    >
                        Tahun Akhir :
                    </label>
                    <Controller
                        name="tahun_akhir"
                        control={control}
                        rules={{ required: "Tahun Akhir harus terisi" }}
                        render={({ field }) => (
                            <>
                                <input
                                    {...field}
                                    className="border px-4 py-2 rounded-lg"
                                    id="tahun_akhir"
                                    type="text"
                                    placeholder="masukkan Tahun Akhir"
                                    value={field.value || TahunAkhir}
                                    onChange={(e) => {
                                        field.onChange(e);
                                        setTahunAkhir(e.target.value);
                                    }}
                                />
                                {errors.tahun_akhir ?
                                    <h1 className="text-red-500">
                                    {errors.tahun_akhir.message}
                                    </h1>
                                    :
                                    <h1 className="text-slate-300 text-xs">*Tahun Akhir Harus Terisi</h1>
                                }
                            </>
                        )}
                    />
                </div> */}
                
                <label className="uppercase text-base font-bold text-gray-700 my-2">
                    indikator tujuan OPD:
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
                                name={`indikator.${index}.targets.${subindex}.tahun`}
                                control={control}
                                defaultValue={_.tahun}
                                render={({ field }) => (
                                    <div className="flex flex-col py-3">
                                        <label className="uppercase text-xs font-bold text-gray-700 mb-2">
                                            Tahun :
                                        </label>
                                        <input
                                            {...field}
                                            type="number"
                                            className="border px-4 py-2 rounded-lg"
                                            placeholder="Masukkan Tahun"
                                        />
                                    </div>
                                )}
                            />
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
                    onClick={() => append({ nama_indikator: "", targets: [{ target: "", satuan: "", tahun: "" }] })}
                >
                    Tambah Indikator
                </ButtonSkyBorder>
                <ButtonGreen
                    type="submit"
                    className="my-4"
                    disabled={Proses}
                >
                    {Proses ? 
                        <span className="flex">
                            <LoadingButtonClip />
                            Menyimpan...
                        </span> 
                    :
                        "Simpan"
                    }
                </ButtonGreen>
                <ButtonRed type="button" halaman_url="/tujuanopd">
                    Kembali
                </ButtonRed>
            </form>
        </div>
    </>
    )
}
export const FormEditTujuanOpd = () => {

    const {
      control,
      handleSubmit,
      reset,
      formState: { errors },
    } = useForm<FormValue>();
    const [Tujuan, setTujuan] = useState<string>('');
    const [Rumus, setRumus] = useState<string>('');
    const [SumberData, setSumberData] = useState<string>('');
    const [KodeOpd, setKodeOpd] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean | null>(null);
    const [idNull, setIdNull] = useState<boolean | null>(null);
    const [User, setUser] = useState<any>(null);
    const [SelectedOpd, setSelectedOpd] = useState<any>(null);
    const [Proses, setProses] = useState<boolean>(false);
    const router = useRouter();
    const {id} = useParams();
    const token = getToken();

    useEffect(() => {
        const data = getOpdTahun();
        const fetchUser = getUser();
        if (fetchUser) {
            setUser(fetchUser.user);
        }
        if(data.opd){
            const opd = {
                value: data.opd.value,
                label: data.opd.label,
            }
            setSelectedOpd(opd);
        }
    }, [])

    const { fields, append, remove, replace } = useFieldArray({
        control,
        name: "indikator",
    });
    
    useEffect(() => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        const fetchTujuan = async() => {
            setLoading(true);
            try{
                const response = await fetch(`${API_URL}/tujuan_opd/detail/${id}`, {
                    headers: {
                      Authorization: `${token}`,
                      'Content-Type': 'application/json',
                    },
                });
                if(!response.ok){
                    throw new Error('terdapat kesalahan di koneksi backend');
                }
                const result = await response.json();
                if(result.code == 500){
                    setIdNull(true);
                } else {
                    const data = result.data;
                    if(data.kode_opd){
                        setKodeOpd(data.kode_opd);
                        reset((prev) => ({ ...prev, nama_pohon: data.nama_pohon }))
                    }
                    if(data.indikator){
                        reset({
                            tujuan: data.tujuan || '',
                            rumus_perhitungan: data.rumus_perhitungan || '',
                            sumber_data: data.sumber_data || '',
                            indikator: data.indikator?.map((item: indikator) => ({
                                nama_indikator: item.nama_indikator,
                                targets: item.targets.map((t: target) => ({
                                    target: t.target,
                                    satuan: t.satuan,
                                })),
                            })),
                        });
                        replace(data.indikator.map((item: indikator) => ({
                            indikator: item.nama_indikator,
                            targets: item.targets,
                        })));
                    } else {
                        reset({
                            tujuan: data.tujuan || '',
                            rumus_perhitungan: data.rumus_perhitungan || '',
                            sumber_data: data.sumber_data || '',
                        });
                    }
                }
            } catch(err) {
                setError('gagal mendapatkan data, periksa koneksi internet atau database server')
                console.error(err);
                console.log(id);
            } finally {
                setLoading(false);
            }
        }
        fetchTujuan();
    },[id, reset, token, replace]);
    
    const onSubmit: SubmitHandler<FormValue> = async (data) => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        const formData = {
              //key : value
              tujuan : data.tujuan,
              rumus_perhitungan : data.rumus_perhitungan,
              sumber_data : data.sumber_data,
              tahun_awal : "2024",
              tahun_akhir : "2024",
              kode_opd : KodeOpd,
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
            const response = await fetch(`${API_URL}/tujuan_opd/update/${id}`, {
                method: "PUT",
                headers: {
                  Authorization: `${token}`,
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            if(response.ok){
                AlertNotification("Berhasil", "Berhasil edit data tujuan opd", "success", 1000);
                router.push("/tujuanopd");
            } else {
                AlertNotification("Gagal", "terdapat kesalahan pada backend / database server", "error", 2000);
            }
        } catch(err){
            AlertNotification("Gagal", "cek koneksi internet/terdapat kesalahan pada database server", "error", 2000);
        } finally {
            setProses(false);
        }
    };

    if(loading){
        return (    
            <div className="border p-5 rounded-xl shadow-xl">
                <h1 className="uppercase font-bold">Form Edit Tujuan OPD :</h1>
                <LoadingClip className="mx-5 py-5"/>
            </div>
        );
    } else if(error){
        return (
            <div className="border p-5 rounded-xl shadow-xl">
                <h1 className="uppercase font-bold">Form Edit Tujuan OPD :</h1>
                <h1 className="text-red-500 mx-5 py-5">{error}</h1>
            </div>
        )
    } else if(idNull){
        return (
            <div className="border p-5 rounded-xl shadow-xl">
                <h1 className="uppercase font-bold">Form Edit Tujuan OPD :</h1>
                <h1 className="text-red-500 mx-5 py-5">id tidak ditemukan</h1>
            </div>
        )
    } else {
        return(
        <>
            <div className="border p-5 rounded-xl shadow-xl">
                <h1 className="uppercase font-bold">Form Edit Tujuan OPD :</h1>
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="flex flex-col mx-5 py-5"
                >
                    <div className="flex flex-col py-3">
                        <label
                            className="uppercase text-xs font-bold text-gray-700 my-2"
                            htmlFor="tujuan"
                        >
                            Tujuan OPD :
                        </label>
                        <Controller
                            name="tujuan"
                            control={control}
                            rules={{ required: "Tujuan OPD harus terisi" }}
                            render={({ field }) => (
                                <>
                                    <input
                                        {...field}
                                        className="border px-4 py-2 rounded-lg"
                                        id="tujuan"
                                        type="text"
                                        placeholder="masukkan Tujuan OPD"
                                        value={field.value || Tujuan}
                                        onChange={(e) => {
                                            field.onChange(e);
                                            setTujuan(e.target.value);
                                        }}
                                    />
                                    {errors.tujuan ?
                                        <h1 className="text-red-500">
                                        {errors.tujuan.message}
                                        </h1>
                                        :
                                        <h1 className="text-slate-300 text-xs">*Tujuan OPD Harus Terisi</h1>
                                    }
                                </>
                            )}
                        />
                    </div>
                    <div className="flex flex-col py-3">
                        <label
                            className="uppercase text-xs font-bold text-gray-700 my-2"
                            htmlFor="rumus_perhitungan"
                        >
                            Rumus Perhitungan :
                        </label>
                        <Controller
                            name="rumus_perhitungan"
                            control={control}
                            rules={{ required: "Rumus Perhitungan harus terisi" }}
                            render={({ field }) => (
                                <>
                                    <textarea
                                        {...field}
                                        className="border px-4 py-2 rounded-lg"
                                        id="rumus_perhitungan"
                                        placeholder="masukkan Rumus Perhitungan"
                                        value={field.value || Rumus}
                                        onChange={(e) => {
                                            field.onChange(e);
                                            setRumus(e.target.value);
                                        }}
                                    />
                                    {errors.rumus_perhitungan ?
                                        <h1 className="text-red-500">
                                        {errors.rumus_perhitungan.message}
                                        </h1>
                                        :
                                        <h1 className="text-slate-300 text-xs">*Rumus Perhitungan Harus Terisi</h1>
                                    }
                                </>
                            )}
                        />
                    </div>
                    <div className="flex flex-col py-3">
                        <label
                            className="uppercase text-xs font-bold text-gray-700 my-2"
                            htmlFor="sumber_data"
                        >
                            Sumber Data :
                        </label>
                        <Controller
                            name="sumber_data"
                            control={control}
                            rules={{ required: "Sumber Data harus terisi" }}
                            render={({ field }) => (
                                <>
                                    <input
                                        {...field}
                                        className="border px-4 py-2 rounded-lg"
                                        id="sumber_data"
                                        type="text"
                                        placeholder="masukkan Sumber Data"
                                        value={field.value || SumberData}
                                        onChange={(e) => {
                                            field.onChange(e);
                                            setSumberData(e.target.value);
                                        }}
                                    />
                                    {errors.sumber_data ?
                                        <h1 className="text-red-500">
                                        {errors.sumber_data.message}
                                        </h1>
                                        :
                                        <h1 className="text-slate-300 text-xs">*Sumber Data Harus Terisi</h1>
                                    }
                                </>
                            )}
                        />
                    </div>
                    <label className="uppercase text-base font-bold text-gray-700 my-2">
                        indikator tujuan OPD :
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
                        onClick={() => append({ nama_indikator: "", targets: [{ target: "", tahun: "", satuan: "" }] })}
                    >
                        Tambah Indikator
                    </ButtonSkyBorder>
                    <ButtonGreen
                        type="submit"
                        className="my-4"
                        disabled={Proses}
                    >
                        {Proses ? 
                            <span className="flex">
                                <LoadingButtonClip />
                                Menyimpan...
                            </span> 
                        :
                            "Simpan"
                        }
                    </ButtonGreen>
                    <ButtonRed type="button" halaman_url="/tujuanopd">
                        Kembali
                    </ButtonRed>
                </form>
            </div>
        </>
        )
    }
}