'use client'

import { ButtonRed, ButtonGreen } from "@/components/global/Button";
import { useEffect, useState } from "react";
import { LoadingClip } from "@/components/global/Loading";
import { AlertNotification, AlertQuestion } from "@/components/global/Alert";
import { getOpdTahun } from "@/components/lib/Cookie";
import { TahunNull } from "@/components/global/OpdTahunNull";
import { getToken, getUser } from "@/components/lib/Cookie";
import { TbPencil, TbArrowBadgeDownFilled } from "react-icons/tb";

const Table = () => {

    const [Data, setData] = useState<any>([]);

    const [User, setUser] = useState<any>(null);
    const [SelectedOpd, setSelectedOpd] = useState<any>(null);
    const [Tahun, setTahun] = useState<any>(null);
    const token = getToken();

    const [Show, setShow] = useState<{ [key: string]: boolean }>({});

    useEffect(() => {
        const data = getOpdTahun();
        const fetchUser = getUser();
        if (fetchUser) {
            setUser(fetchUser.user);
        }
        if (data.tahun) {
            const tahun = {
                value: data.tahun.value,
                label: data.tahun.label,
            }
            setTahun(tahun);
        }
        if (data.opd) {
            const opd = {
                value: data.opd.value,
                label: data.opd.label,
            }
            setSelectedOpd(opd);
        }
    }, []);

    useEffect(() => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        const fetchTujuan = async () => {
            try {
                const response = await fetch(`${API_URL}/role/findall`, {
                    headers: {
                        Authorization: `${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                const result = await response.json();
                const data = result.data;
                setData(data);
            } catch (err) {
                console.error(err)
            }
        }
        if (User?.roles !== undefined) {
            fetchTujuan();
        }
    }, [token, User, Tahun, SelectedOpd]);

    const handleShow = (id: string) => {
        setShow((prev) => ({
            [id]: !prev[id],
        }));
    }

    return (
        <>
            {Data.map((item: any) => {
                const isShown = Show[item.id] || false;

                return (
                    <div className="flex flex-col m-2" key={item.id}>
                        <div
                            className={`flex justify-between border items-center p-5 rounded-xl text-emerald-500 cursor-pointer border-emerald-500 hover:bg-emerald-500 hover:text-white ${isShown ? "bg-emerald-500 text-white" : ""}`}
                            onClick={() => handleShow(item.id)}
                        >
                            <h1 className="font-semibold">Contoh Data Dummy tematik pemda</h1>
                            <div className="flex items-center">
                                <TbArrowBadgeDownFilled className={`transition-all duration-200 ease-in-out text-3xl ${isShown ? "" : "-rotate-90"}`} />
                            </div>
                        </div>
                        <div className={`transition-all duration-300 ease-in-out border-x border-b border-emerald-500 ${isShown ? "max-h-screen opacity-100 mx-4 p-5" : "max-h-0 opacity-0 pointer-events-none"}`}>
                            <div className="overflow-auto rounded-t-xl border">
                                <table className="w-full">
                                    <thead>
                                        <tr className="text-xm bg-emerald-500 text-white">
                                            <td className="border-r border-b px-4 py-3 max-w-[30px] text-center">No</td>
                                            <td className="border-r border-b px-6 py-3 min-w-[200px]">Strategic Pemda</td>
                                            <td colSpan={2} className="border-r border-b px-6 py-3 min-w-[200px]">Sasaran Pemda</td>
                                            <td className="border-r border-b px-6 py-3 min-w-[200px]">Indikator</td>
                                            <td className="border-r border-b px-6 py-3 min-w-[100px]">Target</td>
                                            <td className="border-r border-b px-6 py-3 min-w-[100px]">Satuan</td>
                                            <td className="border-l border-b px-6 py-3 min-w-[100px]">Jenis</td>
                                            <td className="border-l border-b px-6 py-3 min-w-[200px]">Keterangan</td>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td rowSpan={3} className="border-r border-b px-4 py-4 text-center">1</td>
                                            <td rowSpan={3} className="border-r border-b px-6 py-4">Peningkatan Akuntabilitas Kinerja dan Keuangan</td>
                                            <td rowSpan={3} className="border-r border-b px-6 py-4">Meningkatnya Akuntabilitas Kinerja</td>
                                            <td rowSpan={3} className="border-r border-b px-6 py-4">
                                                <div className="flex flex-col justify-center items-center gap-2">
                                                    <ButtonGreen className="flex items-center gap-1 w-full">
                                                        <TbPencil />
                                                        Edit
                                                    </ButtonGreen>
                                                </div>
                                            </td>
                                            <td className="border-r border-b px-6 py-4">Nilai Implementasi SAKIP</td>
                                            <td className="border-r border-b px-6 py-4 text-center">80.01</td>
                                            <td className="border-r border-b px-6 py-4">Nilai/Skor</td>
                                            <td rowSpan={3} className="border-r border-b px-6 py-4">Sub Tematik Kota</td>
                                            <td rowSpan={3} className="border-r border-b px-6 py-4 text-center">--</td>
                                        </tr>
                                        <tr>
                                            <td className="border-r border-b px-6 py-4">Nilai Laporan Penyelenggaraan Pemerintah Daerah</td>
                                            <td className="border-r border-b px-6 py-4 text-center">3.41</td>
                                            <td className="border-r border-b px-6 py-4">Nilai</td>
                                        </tr>
                                        <tr>
                                            <td className="border-r border-b px-6 py-4">Opini BPK terhadap Laporan Keuangan</td>
                                            <td className="border-r border-b px-6 py-4 text-center">0</td>
                                            <td className="border-r border-b px-6 py-4">-</td>
                                        </tr>
                                        <tr>
                                            <td className="border-r border-b px-4 py-4 text-center">OPD</td>
                                            <td colSpan={8} className="border-b px-6 py-4">Badan Perencanaan, Penelitian dan Pengembangan Daerah</td>
                                        </tr>
                                        <tr>
                                            <td className="border-r border-b px-4 py-4 text-center">OPD</td>
                                            <td colSpan={8} className="border-b px-6 py-4">Badan Kepegawaian dan Pengembangan Sumber Daya Manusia</td>
                                        </tr>
                                        <tr>
                                            <td className="border-r border-b px-4 py-4 text-center">OPD</td>
                                            <td colSpan={8} className="border-b px-6 py-4">Inspektorat Daerah</td>
                                        </tr>
                                        <tr>
                                            <td className="border-r border-b px-4 py-4 text-center">OPD</td>
                                            <td colSpan={8} className="border-b px-6 py-4">Bagian Organisasi</td>
                                        </tr>
                                    </tbody>

                                </table>
                            </div>
                        </div>
                    </div>
                );
            })}
        </>
    )
}

export default Table;
