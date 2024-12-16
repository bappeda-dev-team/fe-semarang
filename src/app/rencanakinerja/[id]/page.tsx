'use client'

import { FiHome } from 'react-icons/fi';
import Musrebang from '@/components/pages/rencanakinerja/Rincian/Musrebang';
import Pokir from '@/components/pages/rencanakinerja/Rincian/Pokir';
import Mandatori from '@/components/pages/rencanakinerja/Rincian/Mandatori';
import Inisiatif from '@/components/pages/rencanakinerja/Rincian/Inisiatif';
import SubKegiatan from '@/components/pages/rencanakinerja/Rincian/SubKegiatan';
import Sakip from '@/components/pages/rencanakinerja/Rincian/Sakip';
import Rekin from '@/components/pages/rencanakinerja/Rincian/Rekin';
import DasarHukum from '@/components/pages/rencanakinerja/Rincian/DasarHukum';
import GambaranUmum from '@/components/pages/rencanakinerja/Rincian/GambaranUmum';
import Inovasi from '@/components/pages/rencanakinerja/Rincian/Inovasi';
import { useParams } from 'next/navigation';

const RincianRencanaKinerja = () => {

    const params = useParams();
    const id_rekin = params.id as string;

    return(
        <>
            <div className="flex items-center">
                <a href="/" className="mr-1"><FiHome /></a>
                <p className="mr-1">/ Perencanaan</p>
                <p className="mr-1">/ Rencana Kinerja</p>
                <p>/ Nama sub kegiatan</p>
            </div>
            <div className="my-5">
                {/* status sasaran */}
                {/* <div className="mt-3 rounded-xl shadow-lg border px-5 py-3">
                    <h1>Status Sasaran</h1>
                    <div className="my-3 border"></div>
                    <button className="w-full uppercase bg-emerald-500 rounded-lg py-1 font-bold my-1">siap ditarik skp</button>
                    <button className="w-full uppercase bg-emerald-500 rounded-lg py-1 font-bold my-1">manrisk siap diverifikasi</button>
                    <div className="my-3 border"></div>
                </div> */}
                <Musrebang id={id_rekin}/>
                <Pokir id={id_rekin}/>
                <Mandatori id={id_rekin}/>
                <Inisiatif id={id_rekin} />
                <SubKegiatan id={id_rekin}/>
                <Sakip id={id_rekin}/>
                <Rekin/>
                {/* Rincian sasaran */}
                {/* <div className="flex flex-wrap justify-between items-center mt-3 rounded-t-xl border px-5 py-3">
                    <h1>Rincian Sasaran</h1>
                    <ButtonSky>Edit Rincian Sasaran</ButtonSky>
                </div>
                <div className="rounded-b-xl shadow-lg border-x border-b px-5 py-3">
                    <div className="mx-2 mt-3">
                        <table className="w-full">
                            <tbody className='border'>
                                <tr>
                                    <td className="px-2 py-2 border">Jenis Layanan </td>
                                    <td className="px-2 py-2 border">Konsultasi perencanaan dan pembangunan daerah</td>
                                </tr>
                                <tr>
                                    <td className="px-2 py-2 border">Penerima Manfaat</td>
                                    <td className="px-2 py-2 border">Seluruh perangkat daerah</td>
                                </tr>
                                <tr>
                                    <td className="px-2 py-2 border">Data Terpilah</td>
                                    <td className="px-2 py-2 border">29 Perangkat Daerah</td>
                                </tr>
                                <tr>
                                    <td className="px-2 py-2 border">Resiko</td>
                                    <td className="px-2 py-2 border">Apabila renstra tidak sinergi dengan dokumen kinerja lainnya</td>
                                </tr>
                                <tr>
                                    <td className="px-2 py-2 border">Lokasi Pelaksanaan</td>
                                    <td className="px-2 py-2 border">Kota Madiun</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div> */}
                {/* permasalahan */}
                {/* <div className="flex flex-wrap justify-between items-center mt-3 rounded-t-xl border px-5 py-3">
                    <h1>Permasalahan</h1>
                    <ButtonSky>Tambah Permasalahan</ButtonSky>
                </div>
                <div className="rounded-b-xl shadow-lg border-x border-b px-5 py-3">
                    <div className="overflow-auto m-2 rounded-t-xl border">
                        <table className="w-full">
                            <thead>
                                <tr>
                                    <td className="border-r border-b px-6 py-3 min-w-[50px]">No</td>
                                    <td className="border-r border-b px-6 py-3 min-w-[100px]">Jenis</td>
                                    <td className="border-r border-b px-6 py-3 min-w-[200px]">Permasalahan</td>
                                    <td className="border-r border-b px-6 py-3 min-w-[200px]">Pemnyebab Internal</td>
                                    <td className="border-r border-b px-6 py-3 min-w-[200px]">Pemnyebab Eksternal</td>
                                    <td className="border-r border-b px-6 py-3 min-w-[200px]">Aksi</td>
                                </tr>
                            </thead>
                            <tbody className='border'>
                                <tr>
                                    <td className="border px-6 py-3">1</td>
                                    <td className="border px-6 py-3">Umum</td>
                                    <td className="border px-6 py-3">Dokumen resntra tidak sinergi dengan dokumen perencanaan, pengendalian dan evaluasi lainnya</td>
                                    <td className="border px-6 py-3">waktu yang dibutuhkan dalam rangka merubah dokumen dampak dari renstra sangat lama</td>
                                    <td className="border px-6 py-3">Adanya peraturan dari kemenpan yang berdampak pada dokumen renstra</td>
                                    <td className="border px-6 py-3">
                                        <div className="flex flex-col justify-center items-center gap-2">
                                            <ButtonSkyBorder className="w-full">Edit</ButtonSkyBorder>
                                            <ButtonRedBorder className="w-full">Hapus</ButtonRedBorder>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div> */}
                <DasarHukum id={id_rekin}/>
                <GambaranUmum id={id_rekin}/>
                {/* Hasil Output sasaran */}
                {/* <div className="flex flex-wrap justify-between items-center mt-3 rounded-t-xl border px-5 py-3">
                    <h1>Hasil Output Sasaran</h1>
                </div>
                <div className="rounded-b-xl shadow-lg border-x border-b px-5 py-3">
                    <div className="overflow-auto m-2 rounded-t-xl border">
                        <table className="w-full">
                            <thead>
                                <tr>
                                    <td className="border-r border-b px-6 py-3 min-w-[200px]">Hasil Output</td>
                                    <td className="border-r border-b px-6 py-3 min-w-[200px]">Nama Output</td>
                                    <td className="border-r border-b px-6 py-3 min-w-[100px]">Aksi</td>
                                </tr>
                            </thead>
                            <tbody className='border'>
                                <tr>
                                    <td className="border px-6 py-3">Bukan Raperda</td>
                                    <td className="border px-6 py-3"></td>
                                    <td className="border px-6 py-3">
                                        <div className="flex flex-col justify-center items-center gap-2">
                                            <ButtonSkyBorder className="w-full">Edit</ButtonSkyBorder>
                                            <ButtonRedBorder className="w-full">Hapus</ButtonRedBorder>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div> */}
                <Inovasi id={id_rekin}/>
            </div>
        </>
    )
}

export default RincianRencanaKinerja;