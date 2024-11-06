// 'use client'

// import { Controller, SubmitHandler, useForm } from "react-hook-form";
// import { useState, useEffect } from "react";
// import Select from 'react-select'
// import { getOpdTahun } from "@/components/lib/Cookie";
// import { ButtonGreen, ButtonRedBorder, ButtonSkyBorder, ButtonRed } from "@/components/global/Button";
// import { useParams } from "next/navigation";

// interface OptionTypeString {
//     value: string;
//     label: string;
// }
// interface FormValue {
//     nama_rencana_kinerja: string;
//     tahun: string;
//     status_rencana_kinerja: string;
//     catatan: string;
//     kode_opd: string;
//     pegawai_id: string;
//     indikator: indikator[];
// }
// interface indikator {
//     tahun: string;
//     nama_indikator: string;
//     target: target[];
// }
// interface target {
//     tahun: string;
//     target: number;
//     satuan: string;
// }

// export const FormRencanaKinerja = () => {

//     const {
//       control,
//       handleSubmit,
//       reset,
//       watch,
//       unregister,
//       formState: { errors },
//     } = useForm<FormValue>();
//     const [Tahun, setTahun] = useState<any>(null);
//     const [SelectedOpd, setSelectedOpd] = useState<any>(null);
//     const [namaRenja, setNamaRenja] = useState<string>('');
//     const [catatan, setCatatan] = useState<string>('');
//     const [statusRekin, setStatusRekin] = useState<OptionTypeString | null>(null);
//     const [keteranganFields, setKeteranganFields] = useState<string[]>(['']);

//     useEffect(() => {
//         const data = getOpdTahun();
//         if(data){
//             if(data.tahun){
//                 const value_tahun = {
//                     value: data.tahun.value,
//                     label: data.tahun.label,
//                 }
//                 setTahun(value_tahun);
//             }
//             if(data.opd){
//                 const value_opd = {
//                     value: data.opd.value,
//                     label: data.opd.label,
//                 }
//                 setSelectedOpd(value_opd);
//             }
//         }
//     },[]);

//     const statusOption: OptionTypeString[] = [
//         {label: "aktif", value: "aktif"},
//         {label: "tidak aktif", value: "tidak aktif"},
//     ];

//     const addKeteranganField = () => {
//         setKeteranganFields((prevFields) => [...prevFields, '']);
//       };
    
//       const removeKeteranganField = (index: number) => {
//         // Remove field from UI
//         setKeteranganFields((prevFields) => prevFields.filter((_, i) => i !== index));
        
//         // Unregister the field from react-hook-form to clear its value
//         unregister(`indikator.${index}`);
//       };

//     return(
//     <>
//         <div className="border p-5 rounded-xl shadow-xl">
//             <h1 className="uppercase font-bold">Form Tambah Rencana Kinerja :</h1>
//             <form
//               className="flex flex-col mx-5 py-5"
//               >
//                 <div className="flex flex-col py-3">
//                     <label
//                     className="uppercase text-xs font-bold text-gray-700 my-2"
//                     htmlFor="nama_rencana_kinerja"
//                     >
//                     Nama Rencana Kinerja :
//                     </label>
//                     <Controller
//                         name="nama_rencana_kinerja"
//                         control={control}
//                         rules={{ required: "Nama Rencana Kinerja harus terisi" }}
//                         render={({ field }) => (
//                             <>
//                             <input
//                                 {...field}
//                                 className="border px-4 py-2 rounded-lg"
//                                 id="nama_rencana_kinerja"
//                                 type="text"
//                                 placeholder="masukkan nama rencana kinerja"
//                                 value={field.value || namaRenja}
//                                 onChange={(e) => {
//                                     field.onChange(e);
//                                     setNamaRenja(e.target.value);
//                                 }}
//                             />
//                             {errors.nama_rencana_kinerja ?
//                                 <h1 className="text-red-500">
//                                 {errors.nama_rencana_kinerja.message}
//                                 </h1>
//                                 :
//                                 <h1 className="text-slate-300 text-xs">*Nama Rencana Kinerja Harus Terisi</h1>
//                             }
//                             </>
//                         )}
//                     />
//                 </div>
//                 <div className="flex flex-col py-3">
//                     <label
//                     className="uppercase text-xs font-bold text-gray-700 my-2"
//                     htmlFor="catatan"
//                     >
//                     Catatan :
//                     </label>
//                     <Controller
//                         name="catatan"
//                         control={control}
//                         render={({ field }) => (
//                             <textarea
//                                 {...field}
//                                 className="border px-4 py-2 rounded-lg"
//                                 id="catatan"
//                                 placeholder="masukkan catatan jika ada"
//                                 value={field.value || catatan}
//                                 onChange={(e) => {
//                                     field.onChange(e);
//                                     setCatatan(e.target.value);
//                                 }}
//                             />
//                         )}
//                     />
//                 </div>
//                 <div className="flex flex-col py-3">
//                     <label
//                         className="uppercase text-xs font-bold text-gray-700 my-2"
//                         htmlFor="tahun"
//                     >
//                         Tahun:
//                     </label>
//                     <Controller
//                         name="tahun"
//                         control={control}
//                         render={({ field }) => (
//                             <Select
//                                 {...field}
//                                 id="tahun"
//                                 placeholder="pilih tahun di header"
//                                 value={Tahun}
//                                 isDisabled
//                                 styles={{
//                                     control: (baseStyles) => ({
//                                         ...baseStyles,
//                                         borderRadius: '8px',
//                                     })
//                                 }}
//                             />
//                         )}
//                     />
//                 </div>
//                 <div className="flex flex-col py-3">
//                     <label
//                         className="uppercase text-xs font-bold text-gray-700 my-2"
//                         htmlFor="status_rencana_kinerja"
//                     >
//                         Status Rencana Kinerja:
//                     </label>
//                     <Controller
//                         name="status_rencana_kinerja"
//                         control={control}
//                         rules={{required: "Status Rekin Harus Terisi"}}
//                         render={({ field }) => (
//                             <>
//                             <Select
//                                 {...field}
//                                 id="Status Rencana Kinerja"
//                                 placeholder="pilih Status Rencana"
//                                 value={statusRekin}
//                                 options={statusOption}
//                                 onChange={(option) => {
//                                     setStatusRekin(option);
//                                     field.onChange(option);
//                                 }}
//                                 styles={{
//                                     control: (baseStyles) => ({
//                                         ...baseStyles,
//                                         borderRadius: '8px',
//                                     })
//                                 }}
//                             />
//                             {errors.status_rencana_kinerja ?
//                                 <h1 className="text-red-500">
//                                 {errors.status_rencana_kinerja.message}
//                                 </h1>
//                                 :
//                                 <h1 className="text-slate-300 text-xs">*Status Rekin Harus Terisi</h1>
//                             }
//                             </>
//                         )}
//                     />
//                 </div>

//                 <label className="uppercase text-base font-bold text-gray-700 my-2">
//                     indikator sasaran:
//                 </label>

//                 {keteranganFields.map((_, index) => (
//                     <div key={index} className="flex flex-col bg-gray-100 my-2 py-2 px-2 rounded-lg">
//                         <div className="flex flex-col py-3">
//                             <label className="uppercase text-xs font-bold text-gray-700 mb-2">
//                                 Nama Indikator {index + 1} :
//                             </label>
//                             <Controller
//                                 name={`indikator.${index}`}
//                                 control={control}
//                                 render={({ field }) => (
//                                 <input
//                                     {...field}
//                                     className="border px-4 py-2 rounded-lg"
//                                     type="text"
//                                     placeholder={`Masukkan nama indikator ${index + 1}`}
//                                 />
//                                 )}
//                             />
//                         </div>
//                         {/* <div className="flex flex-wrap justify-between py-3"> */}
//                             <div className="flex flex-col py-3">
//                                 <label className="uppercase text-xs font-bold text-gray-700 mb-2">
//                                     Satuan :
//                                 </label>
//                                 <Controller
//                                     name={`indikator.${index}`}
//                                     control={control}
//                                     render={({ field }) => (
//                                     <input
//                                         {...field}
//                                         className="border px-4 py-2 rounded-lg"
//                                         type="text"
//                                         placeholder={`Masukkan Satuan`}
//                                     />
//                                     )}
//                                 />
//                             </div>
//                             <div className="flex flex-col py-3">
//                                 <label className="uppercase text-xs font-bold text-gray-700 mb-2">
//                                     Target :
//                                 </label>
//                                 <Controller
//                                     name={`target.${index}`}
//                                     control={control}
//                                     render={({ field }) => (
//                                     <input
//                                         {...field}
//                                         className="border px-4 py-2 rounded-lg"
//                                         type="number"
//                                         placeholder={`Masukkan Target`}
//                                     />
//                                     )}
//                                 />
//                             </div>
//                         {/* </div> */}
//                         {/* Show delete button for all except the first input */}
//                         {index > 0 && (
//                             <ButtonRedBorder
//                                 type="button"
//                                 onClick={() => removeKeteranganField(index)}
//                                 className="w-[200px] mt-3"
//                             >
//                                 Hapus
//                             </ButtonRedBorder>
//                         )}
//                     </div>
//                 ))}

//                 <ButtonSkyBorder
//                     type="button"
//                     onClick={addKeteranganField}
//                 >
//                     Tambah Indikator
//                 </ButtonSkyBorder>
//                 <ButtonGreen
//                     type="button"
//                     className="my-4"
//                 >
//                     Simpan
//                 </ButtonGreen>
//                 <ButtonRed type="button" halaman_url="/rencanakinerja">
//                     Kembali
//                 </ButtonRed>
//             </form>
//         </div>
//     </>
//     )
// }

// export const FormEditRencanaKinerja = () => {

//     const {
//       control,
//       handleSubmit,
//       reset,
//       watch,
//       unregister,
//       formState: { errors },
//     } = useForm<FormValue>();
//     const API_URL = process.env.NEXT_PUBLIC_API_URL;
//     const [Tahun, setTahun] = useState<any>(null);
//     const [SelectedOpd, setSelectedOpd] = useState<any>(null);
//     const [namaRenja, setNamaRenja] = useState<string>('');
//     const [statusRekin, setStatusRekin] = useState<OptionTypeString | null>(null);
//     const [catatan, setCatatan] = useState<string>('');
//     const [keteranganFields, setKeteranganFields] = useState<string[]>(['']);
//     const params = useParams();
//     const id = params.id as string;

//     useEffect(() => {
//         const data = getOpdTahun();
//         if(data){
//             if(data.tahun){
//                 const value_tahun = {
//                     value: data.tahun.value,
//                     label: data.tahun.label,
//                 }
//                 setTahun(value_tahun);
//             }
//             if(data.opd){
//                 const value_opd = {
//                     value: data.opd.value,
//                     label: data.opd.label,
//                 }
//                 setSelectedOpd(value_opd);
//             }
//         }
//     },[]);

//     useEffect(() => {
//         const fetchId = async() => {
//             try{
//                 const response = await fetch(`${API_URL}/detail-rencana_kinerja/${id}`);
//                 const result = await response.json();
//                 const data = result.rencana_kinerja;
//                 console.log(data);
//                 if(data){
//                     if(data.nama_rencana_kinerja){
//                         setNamaRenja(data.nama_rencana_kinerja);
//                     }
//                     if(data.catatan){
//                         setCatatan(data.catatan);
//                     }
//                     if(data.status_rencana_kinerja){
//                         const status = {
//                             value: data.status_rencana_kinerja,
//                             label: data.status_rencana_kinerja,
//                         }
//                         setStatusRekin(status);
//                     }
//                 }
//             } catch(err){
//                 console.error(err);
//             }
//         };
//         fetchId();
//     },[]);

//     const statusOption: OptionTypeString[] = [
//         {label: "aktif", value: "aktif"},
//         {label: "tidak aktif", value: "tidak aktif"},
//     ];

//     const addKeteranganField = () => {
//         setKeteranganFields((prevFields) => [...prevFields, '']);
//       };
    
//       const removeKeteranganField = (index: number) => {
//         // Remove field from UI
//         setKeteranganFields((prevFields) => prevFields.filter((_, i) => i !== index));
        
//         // Unregister the field from react-hook-form to clear its value
//         unregister(`indikator.${index}`);
//       };

//     return(
//     <>
//         <div className="border p-5 rounded-xl shadow-xl">
//             <h1 className="uppercase font-bold">Form Edit Rencana Kinerja :</h1>
//             <form
//               className="flex flex-col mx-5 py-5"
//             >
//                 <div className="flex flex-col py-3">
//                     <label
//                         className="uppercase text-xs font-bold text-gray-700 my-2"
//                         htmlFor="nama_rencana_kinerja"
//                     >
//                     Nama Rencana Kinerja :
//                     </label>
//                     <Controller
//                         name="nama_rencana_kinerja"
//                         control={control}
//                         rules={{ required: "Nama Rencana Kinerja harus terisi" }}
//                         render={({ field }) => (
//                             <>
//                             <input
//                                 {...field}
//                                 className="border px-4 py-2 rounded-lg"
//                                 id="nama_rencana_kinerja"
//                                 type="text"
//                                 placeholder="masukkan nama rencana kinerja"
//                                 value={field.value || namaRenja}
//                                 onChange={(e) => {
//                                     field.onChange(e);
//                                     setNamaRenja(e.target.value);
//                                 }}
//                             />
//                             {errors.nama_rencana_kinerja ?
//                                 <h1 className="text-red-500">
//                                 {errors.nama_rencana_kinerja.message}
//                                 </h1>
//                                 :
//                                 <h1 className="text-slate-300 text-xs">*Nama Rencana Kinerja Harus Terisi</h1>
//                             }
//                             </>
//                         )}
//                     />
//                 </div>
//                 <div className="flex flex-col py-3">
//                     <label
//                     className="uppercase text-xs font-bold text-gray-700 my-2"
//                     htmlFor="catatan"
//                     >
//                     Catatan :
//                     </label>
//                     <Controller
//                         name="catatan"
//                         control={control}
//                         render={({ field }) => (
//                             <textarea
//                                 {...field}
//                                 className="border px-4 py-2 rounded-lg"
//                                 id="catatan"
//                                 placeholder="masukkan catatan jika ada"
//                                 value={field.value || catatan}
//                                 onChange={(e) => {
//                                     field.onChange(e);
//                                     setCatatan(e.target.value);
//                                 }}
//                             />
//                         )}
//                     />
//                 </div>
//                 <div className="flex flex-col py-3">
//                     <label
//                         className="uppercase text-xs font-bold text-gray-700 my-2"
//                         htmlFor="tahun"
//                     >
//                         Tahun:
//                     </label>
//                     <Controller
//                         name="tahun"
//                         control={control}
//                         render={({ field }) => (
//                             <Select
//                                 {...field}
//                                 id="tahun"
//                                 placeholder="pilih tahun di header"
//                                 value={Tahun}
//                                 isDisabled
//                                 styles={{
//                                     control: (baseStyles) => ({
//                                         ...baseStyles,
//                                         borderRadius: '8px',
//                                     })
//                                 }}
//                             />
//                         )}
//                     />
//                 </div>
//                 <div className="flex flex-col py-3">
//                     <label
//                         className="uppercase text-xs font-bold text-gray-700 my-2"
//                         htmlFor="status_rencana_kinerja"
//                     >
//                         Status Rencana Kinerja:
//                     </label>
//                     <Controller
//                         name="status_rencana_kinerja"
//                         control={control}
//                         rules={{required: "Status Rekin Harus Terisi"}}
//                         render={({ field }) => (
//                             <>
//                             <Select
//                                 {...field}
//                                 id="Status Rencana Kinerja"
//                                 placeholder="pilih Status Rencana"
//                                 value={statusRekin}
//                                 options={statusOption}
//                                 onChange={(option) => {
//                                     setStatusRekin(option);
//                                     field.onChange(option);
//                                 }}
//                                 styles={{
//                                     control: (baseStyles) => ({
//                                         ...baseStyles,
//                                         borderRadius: '8px',
//                                     })
//                                 }}
//                             />
//                             {errors.status_rencana_kinerja ?
//                                 <h1 className="text-red-500">
//                                 {errors.status_rencana_kinerja.message}
//                                 </h1>
//                                 :
//                                 <h1 className="text-slate-300 text-xs">*Status Rekin Harus Terisi</h1>
//                             }
//                             </>
//                         )}
//                     />
//                 </div>

//                 <label className="uppercase text-base font-bold text-gray-700 my-2">
//                     indikator sasaran:
//                 </label>

//                 {keteranganFields.map((_, index) => (
//                     <div key={index} className="flex flex-col bg-gray-100 my-2 py-2 px-2 rounded-lg">
//                         <div className="flex flex-col py-3">
//                             <label className="uppercase text-xs font-bold text-gray-700 mb-2">
//                                 Nama Indikator {index + 1} :
//                             </label>
//                             <Controller
//                                 name={`indikator.${index}`}
//                                 control={control}
//                                 render={({ field }) => (
//                                 <input
//                                     {...field}
//                                     className="border px-4 py-2 rounded-lg"
//                                     type="text"
//                                     placeholder={`Masukkan nama indikator ${index + 1}`}
//                                 />
//                                 )}
//                             />
//                         </div>
//                         {/* <div className="flex flex-wrap justify-between py-3"> */}
//                             <div className="flex flex-col py-3">
//                                 <label className="uppercase text-xs font-bold text-gray-700 mb-2">
//                                     Satuan :
//                                 </label>
//                                 <Controller
//                                     name={`indikator.${index}`}
//                                     control={control}
//                                     render={({ field }) => (
//                                     <input
//                                         {...field}
//                                         className="border px-4 py-2 rounded-lg"
//                                         type="text"
//                                         placeholder={`Masukkan Satuan`}
//                                     />
//                                     )}
//                                 />
//                             </div>
//                             <div className="flex flex-col py-3">
//                                 <label className="uppercase text-xs font-bold text-gray-700 mb-2">
//                                     Target :
//                                 </label>
//                                 <Controller
//                                     name={`target.${index}`}
//                                     control={control}
//                                     render={({ field }) => (
//                                     <input
//                                         {...field}
//                                         className="border px-4 py-2 rounded-lg"
//                                         type="number"
//                                         placeholder={`Masukkan Target`}
//                                     />
//                                     )}
//                                 />
//                             </div>
//                         {/* </div> */}
//                         {/* Show delete button for all except the first input */}
//                         {index > 0 && (
//                             <ButtonRedBorder
//                                 type="button"
//                                 onClick={() => removeKeteranganField(index)}
//                                 className="w-[200px] mt-3"
//                             >
//                                 Hapus
//                             </ButtonRedBorder>
//                         )}
//                     </div>
//                 ))}

//                 <ButtonSkyBorder
//                     type="button"
//                     onClick={addKeteranganField}
//                 >
//                     Tambah Indikator
//                 </ButtonSkyBorder>
//                 <ButtonGreen
//                     type="button"
//                     className="my-4"
//                 >
//                     Simpan
//                 </ButtonGreen>
//                 <ButtonRed type="button" halaman_url="/rencanakinerja">
//                     Kembali
//                 </ButtonRed>
//             </form>
//         </div>
//     </>
//     )
// }