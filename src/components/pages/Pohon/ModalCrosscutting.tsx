'use client'

import { useState, useEffect } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { ButtonSky, ButtonRed } from '@/components/global/Button';
import { AlertNotification } from "@/components/global/Alert";
import { getOpdTahun } from "@/components/lib/Cookie";

interface OptionTypeString {
    value: string;
    label: string;
}
interface modal {
    isOpen: boolean;
    onClose: () => void;
    id?: number | null;
    level?: number;
    // onSuccess: () => void;
}
interface FormValue {
    id: number;
    parent: string;
    nama_pohon: string;
    jenis_pohon: string;
    keterangan: string;
    tahun: OptionTypeString;
    status: string;
    kode_opd: OptionTypeString;
    pelaksana: OptionTypeString[];
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

export const ModalAddCrosscutting: React.FC<modal> = ({isOpen, onClose}) => {

    const {
      control,
      handleSubmit,
      formState: { errors },
      reset
    } = useForm<FormValue>();
    const [NamaPohon, setNamaPohon] = useState<string>('');
    const [Keterangan, setKeterangan] = useState<string>('');
    const [Tahun, setTahun] = useState<any>(null);
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

    const handleClose = () => {
      reset(); // Mereset seluruh form
      setNamaPohon('');
      setKeterangan('');
      onClose();
    };

    // const onSubmit: SubmitHandler<FormValue> = async (data) => {
    //     const API_URL = process.env.NEXT_PUBLIC_API_URL;
    //     const formData = {
    //         //key : value
    //         nama_pohon : data.nama_pohon,
    //         Keterangan : data.keterangan,
    //         jenis_pohon:    level === 1 ? "Strategic" :
    //                         level === 2 ? "Tactical" :
    //                         level === 3 ? "Operational" : "Unknown",
    //         level_pohon :   level === 1 ? 4 :
    //                         level === 2 ? 5 :
    //                         level === 3 ? 6 : "Unknown",
    //         parent: id,
    //         tahun: Tahun?.value?.toString(),
    //         kode_opd: SelectedOpd?.value,
    //     };
    //     // console.log(formData);
    //     try{
    //         const response = await fetch(`${API_URL}/pohon_kinerja_opd/create`, {
    //             method: "POST",
    //             headers: {
    //                 "Content-Type" : "application/json",
    //             },
    //             body: JSON.stringify(formData),
    //         });
    //         if(response.ok){
    //             AlertNotification("Berhasil", "Berhasil menambahkan strategic", "success", 1000);
    //             onClose();
    //             onSuccess();
    //         } else {
    //             AlertNotification("Gagal", "terdapat kesalahan pada backend / database server", "error", 2000);
    //         }
    //     } catch(err){
    //         AlertNotification("Gagal", "cek koneksi internet/terdapat kesalahan pada database server", "error", 2000);
    //         console.error(err);
    //     }
    //   };

    if(!isOpen){
        return null;
    } else {

    return(
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className={`fixed inset-0 bg-black opacity-30`} onClick={handleClose}></div>
            <div className={`bg-white rounded-lg p-8 z-10 w-3/5 text-start`}>
                <form
                    // onSubmit={handleSubmit(onSubmit)}
                >
                    <div className="w-max-[500px] py-2 border-b text-center">
                       Cross Cutting
                    </div>
                    <div className="flex flex-col py-3">
                        <label
                            className="uppercase text-xs font-bold text-gray-700 my-2"
                            htmlFor="nama_pohon"
                        >
                            Perangkat Daerah
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
                                    placeholder="Pilih Perangkat Daerah"
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
                    <ButtonSky type="submit" className="w-full my-3">
                        Simpan
                    </ButtonSky>
                    <ButtonRed className="w-full my-3" onClick={handleClose}>
                        Batal
                    </ButtonRed>
                </form>
            </div>
        </div>
    )
    }
}


// export const ModalEditCrosscutting: React.FC<modal> = ({isOpen, onClose}) => {

//     const {
//       control,
//       handleSubmit,
//       formState: { errors },
//       reset
//     } = useForm<FormValue>();
//     const [NamaPohon, setNamaPohon] = useState<string>('');
//     const [Keterangan, setKeterangan] = useState<string>('');
//     const [Parent, setParent] = useState<string>('');
//     const [Tahun, setTahun] = useState<any>(null);
//     const [SelectedOpd, setSelectedOpd] = useState<any>(null);
//     const [Loading, setLoading] = useState<boolean>(false);
//     const [error, setError] = useState<string>('');
    
//     const handleClose = () => {
//       reset(); // Mereset seluruh form
//       setNamaPohon('');
//       setKeterangan('');
//       onClose();
//     };
    
//     useEffect(() => {
//         const data = getOpdTahun();
//         if(data.tahun){
//             const tahun = {
//                 value: data.tahun.value,
//                 label: data.tahun.label,
//             }
//             setTahun(tahun);
//         }
//         if(data.opd){
//             const opd = {
//                 value: data.opd.value,
//                 label: data.opd.label,
//             }
//             setSelectedOpd(opd);
//         }
//     },[]);

//     useEffect(() => {
//         const API_URL = process.env.NEXT_PUBLIC_API_URL;
//         const fetchStrategic = async() => {
//             setLoading(true);
//             try{
//                 const response = await fetch(`${API_URL}/pohon_kinerja_opd/detail/${id}`);
//                 if(!response.ok){
//                     throw new Error('terdapat kesalahan di koneksi backend');
//                 }
//                 const result = await response.json();
//                 const data = result.data;
//                 if(data.parent){
//                     setParent(data.parent);
//                 }
//                 reset({
//                     nama_pohon: data.nama_pohon || '',
//                     keterangan: data.keterangan || '',
//                     parent: data.parent || ''
//                 });
//             } catch(err) {
//                 setError('gagal mendapatkan data, periksa koneksi internet atau database server')
//             } finally {
//                 setLoading(false);
//             }
//         }
//         if(isOpen && id){
//             fetchStrategic();
//         }
//     },[id, isOpen, reset]);

//     const onSubmit: SubmitHandler<FormValue> = async (data) => {
//         const API_URL = process.env.NEXT_PUBLIC_API_URL;
//         const formData = {
//             //key : value
//             tema : data.nama_pohon,
//             Keterangan : data.keterangan,
//             jenis_pohon:    level === 1 ? "Strategic" :
//                             level === 2 ? "Tactical" :
//                             level === 3 ? "Operational" : "Unknown",
//             level_pohon :   level === 1 ? 4 :
//                             level === 2 ? 5 :
//                             level === 3 ? 6 : "Unknown",
//             parent: Number(Parent),
//             tahun: Tahun?.value?.toString(),
//             kode_opd: SelectedOpd?.value,
//         };
//         // console.log(formData);
//         try{
//             const response = await fetch(`${API_URL}/pohon_kinerja_opd/update/${id}`, {
//                 method: "PUT",
//                 headers: {
//                     "Content-Type" : "application/json",
//                 },
//                 body: JSON.stringify(formData),
//             });
//             if(response.ok){
//                 AlertNotification("Berhasil", "Berhasil edit strategic", "success", 1000);
//                 onClose();
//                 onSuccess();
//             } else {
//                 AlertNotification("Gagal", "terdapat kesalahan pada backend / database server", "error", 2000);
//             }
//         } catch(err){
//             AlertNotification("Gagal", "cek koneksi internet/terdapat kesalahan pada database server", "error", 2000);
//             console.error(err);
//         }
//       };

//     if(!isOpen){
//         return null;
//     } else {

//     return(
//         <div className="fixed inset-0 flex items-center justify-center z-50">
//             <div className={`fixed inset-0 bg-black opacity-30`} onClick={handleClose}></div>
//             <div className={`bg-white rounded-lg p-8 z-10 w-3/5 text-start`}>
//                 <form
//                     onSubmit={handleSubmit(onSubmit)}
//                 >
//                     <div className="w-max-[500px] py-2 border-b text-center">
//                     {level == 1 && 
//                         <h1 className="text-xl uppercase">Edit Strategic</h1>
//                     } 
//                     {level == 2 && 
//                         <h1 className="text-xl uppercase">Edit Tactical</h1>
//                     } 
//                     {level == 3 && 
//                         <h1 className="text-xl uppercase">Edit Operational</h1>
//                     }
//                     </div>
//                     <div className="flex flex-col py-3">
//                         <label
//                             className="uppercase text-xs font-bold text-gray-700 my-2"
//                             htmlFor="nama_pohon"
//                         >
//                             {level == 1 && 
//                                 "Strategic"
//                             } 
//                             {level == 2 && 
//                                 "Tactical"
//                             } 
//                             {level == 3 && 
//                                 "Operational"
//                             }
//                         </label>
//                         <Controller
//                             name="nama_pohon"
//                             control={control}
//                             defaultValue={NamaPohon}
//                             render={({ field }) => (
//                                 <input
//                                     {...field}
//                                     className="border px-4 py-2 rounded-lg"
//                                     id="nama_pohon"
//                                     type="text"
//                                     placeholder="masukkan Nama Pohon"
//                                     // value={field.value || NamaPohon}
//                                     onChange={(e) => {
//                                         field.onChange(e);
//                                         setNamaPohon(e.target.value);
//                                     }}
//                                 />
//                             )}
//                         />
//                     </div>
//                     <div className="flex flex-col py-3">
//                         <label
//                             className="uppercase text-xs font-bold text-gray-700 my-2"
//                             htmlFor="keterangan"
//                         >
//                             Keterangan:
//                         </label>
//                         <Controller
//                             name="keterangan"
//                             control={control}
//                             defaultValue={Keterangan}
//                             render={({ field }) => (
//                                 <textarea
//                                     {...field}
//                                     className="border px-4 py-2 rounded-lg"
//                                     id="keterangan"
//                                     placeholder="masukkan keterangan"
//                                     // value={field.value || Keterangan}
//                                     onChange={(e) => {
//                                         field.onChange(e);
//                                         setKeterangan(e.target.value);
//                                     }}
//                                 />
//                             )}
//                         />
//                     </div>
//                     <ButtonSky type="submit" className="w-full my-3">
//                         Simpan
//                     </ButtonSky>
//                     <ButtonRed className="w-full my-3" onClick={handleClose}>
//                         Batal
//                     </ButtonRed>
//                 </form>
//             </div>
//         </div>
//     )
//     }
// }