import React from "react";
import { useState, useEffect } from "react";
import { AlertNotification } from "@/components/global/Alert";
import Select from 'react-select'
import { TbCircleCheckFilled, TbCircleLetterXFilled, TbFileCheck, TbFilePlus } from 'react-icons/tb';
import { ButtonRedBorder, ButtonSkyBorder, ButtonRed } from "@/components/global/Button";
import { LoadingButtonClip } from "@/components/global/Loading";
import { getToken, getUser, getOpdTahun } from "@/components/lib/Cookie";

interface modal {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}
interface OptionType {
    value: number;
    label: string;
}
interface TypePohonPemda {
    value: number;
    label: string;
    jenis: string;
    keterangan?: string;
    status?: string;
    tahun?: string;
    indikators?: indikator[];
}
interface indikator {
    nama_indikator: string;
    targets: target[];
}
type target = {
    target: string;
    satuan: string;
};

export const ModalPohonPemda: React.FC<modal> = ({isOpen, onClose, onSuccess}) => {

    const [PohonPemda, setPohonPemda] = useState<TypePohonPemda | null>(null);
    const [PohonParent, setPohonParent] = useState<OptionType | null>(null);
    const [OptionPohonParent, setOptionPohonParent] = useState<OptionType[]>([]);
    const [OptionPohonPemda, setOptionPohonPemda] = useState<TypePohonPemda[]>([]);

    const [Proses, setProses] = useState<boolean>(false);
    const [IsLoading, setIsLoading] = useState<boolean>(false);

    const token = getToken();
    const [User, setUser] = useState<any>(null);
    const [Tahun, setTahun] = useState<any>(null);
    const [SelectedOpd, setSelectedOpd] = useState<any>(null);

    useEffect(() => {
        const fetchUser = getUser();
        if (fetchUser) {
            setUser(fetchUser.user);
        }
        const data = getOpdTahun();
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

    const fetchPohonParent = async (level: number) => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        let url = ''; // Deklarasikan di luar blok
        setIsLoading(true);
        try {
            if (User?.roles == 'super_admin') {
                url = `pohon_kinerja/pilih_parent/${SelectedOpd?.value}/${Tahun?.value}/${level}`;
            } else {
                url = `pohon_kinerja/pilih_parent/${User?.kode_opd}/${Tahun?.value}/${level}`;
            }

            if (!url) {
                throw new Error('URL tidak valid.');
            }

            const response = await fetch(`${API_URL}/${url}`, {
                method: 'GET',
                headers: {
                    Authorization: `${token}`,
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                throw new Error('cant fetch data opd');
            }
            const data = await response.json();
            if(data.data == null){
                console.log("pohon opd kosong, tambahkan di pohon kinerja OPD untuk membuat pohon parent")
            } else {
                const parent = data.data.map((item: any) => ({
                    value: item.id,
                    label: `${item.jenis_pohon} - ${item.nama_pohon}`,
                    jenis: item.jenis_pohon,
                }));
                setOptionPohonParent(parent);
            }
        } catch (err) {
            console.log('gagal mendapatkan data pohon dari opd', err);
        } finally {
            setIsLoading(false);
        }
    };
    const fetchPohonPemda = async () => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        setIsLoading(true);
        try {
            const url = User?.roles == 'super_admin' ? `pohon_kinerja/pemda/${SelectedOpd?.value}/${Tahun?.value}` : `pohon_kinerja/pemda/${User?.kode_opd}/${Tahun?.value}`;
            const response = await fetch(`${API_URL}/${url}`, {
                method: 'GET',
                headers: {
                    Authorization: `${token}`,
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                throw new Error('cant fetch data opd');
            }
            const data = await response.json();
            if(data.data == null){
                console.log("pohon dari pemda kosong/belum ditambahkan")
            } else {
                const pokinPemda = data.data.map((item: any) => ({
                    value: item.id,
                    label: `${item.jenis_pohon} - ${item.nama_pohon}`,
                    jenis: item.jenis_pohon,
                    tahun: item.tahun,
                    status: item.status,
                    indikators: item.indikators,
                }));
                setOptionPohonPemda(pokinPemda);
            }
        } catch (err) {
            console.log('gagal mendapatkan data pohon dari opd', err);
        } finally {
            setIsLoading(false);
        }
    };
    const terimaPohonPemda = async (id: number) => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        const formData = {
            id: id,
            parent: PohonParent ? PohonParent?.value : 0,
            jenis_pohon: PohonPemda?.jenis,
        }
        // console.log(formData);
        try {
            setProses(true);
            const response = await fetch(`${API_URL}/pohon_kinerja_admin/clone_pokin_pemda/create`, {
                method: "POST",
                headers: {
                    Authorization: `${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            })
            if (!response.ok) {
                alert("cant fetch data")
            }
            AlertNotification("Berhasil", "Pohon dari pemda di terima", "success", 1000);
            onClose();
            onSuccess();
        } catch (err) {
            AlertNotification("Gagal", "cek koneksi internet atau database server", "error", 2000);
            console.error(err);
        } finally{
            setProses(false);
        }
    }
    const tolakPohonPemda = async (id: number) => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        const formData = {
            id: id,
        }
        // console.log(formData);
        try {
            setProses(true);
            const response = await fetch(`${API_URL}/pohon_kinerja_admin/tolak_pokin/${id}`, {
                method: "PUT",
                headers: {
                    Authorization: `${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            })
            if (!response.ok) {
                alert("cant fetch data")
            }
            AlertNotification("Berhasil", "Data pohon berhasil di tolak", "success", 1000);
            onClose();
            onSuccess();
            // setTimeout(() => {
            //     window.location.reload();
            // }, 1000);
        } catch (err) {
            AlertNotification("Gagal", "cek koneksi internet atau database server", "error", 2000);
            console.error(err);
        } finally {
            setProses(false);
        }
    }

    const handleClose = () => {
        setPohonParent(null);
        setPohonPemda(null);
        onClose();
    };

    if(!isOpen){
        return null;
    } else {

    return(
        <div className="fixed inset-0 flex items-center justify-center z-50">
            {/* KONDISI ON CLOSE */}
            <div className={`fixed inset-0 bg-black opacity-30`} onClick={handleClose}></div>

            <div className={`bg-white rounded-lg p-8 z-10 w-[50%] text-start`}>
                <div className="w-max-[500px] py-2 border-b text-center font-bold">
                    Pohon Dari Pemda
                </div>
                <div className="py-5 my-5">
                    <div className="mb-1">
                        <label htmlFor="" className='uppercase text-xs font-medium text-gray-700 my-2 ml-1'>
                            pohon pemda
                        </label>
                        <Select
                            placeholder="Pilih Pohon Pemda"
                            value={PohonPemda}
                            options={OptionPohonPemda}
                            isSearchable
                            isClearable
                            isLoading={IsLoading}
                            onMenuOpen={() => {
                                if (OptionPohonPemda.length === 0) {
                                    fetchPohonPemda();
                                }
                            }}
                            onChange={(option) => {
                                setPohonPemda(option);
                            }}
                            styles={{
                                control: (baseStyles) => ({
                                    ...baseStyles,
                                    borderRadius: '8px',
                                    textAlign: 'start',
                                })
                            }}
                        />
                    </div>
                    {(PohonPemda?.jenis == 'Tactical Pemda' || PohonPemda?.jenis == 'Operational Pemda') &&
                        <div className="mb-3">
                            <label htmlFor="" className='uppercase text-xs font-medium text-gray-700 my-2 ml-1'>
                                {PohonPemda?.jenis == 'Tactical Pemda' ? 'Strategic' : 'Tactical'}
                            </label>
                            <Select
                                placeholder="parent untuk pohon yang diterima"
                                value={PohonParent}
                                options={OptionPohonParent}
                                isSearchable
                                isClearable
                                isLoading={IsLoading}
                                onMenuOpen={() => {
                                    if (PohonPemda?.jenis == 'Tactical Pemda') {
                                        fetchPohonParent(4);
                                    } else {
                                        fetchPohonParent(5);
                                    }
                                }}
                                onChange={(option) => {
                                    setPohonParent(option);
                                }}
                                onMenuClose={() => setOptionPohonParent([])}
                                styles={{
                                    control: (baseStyles) => ({
                                        ...baseStyles,
                                        borderRadius: '8px',
                                        textAlign: 'start',
                                    })
                                }}
                            />
                        </div>
                    }
                    <p className="uppercase text-gray-700 font-medium text-xs mt-3">Preview Pohon:</p>
                    {(PohonPemda?.value != undefined || null) &&
                    <div className="py-3 px-2 mt-2 rounded-xl text-sm border shadow-lg">
                        <table className='w-full'>
                            <tbody>
                                <tr>
                                    <td
                                        className={`min-w-[100px] px-2 py-3 bg-white text-start rounded-tl-lg`}
                                    >
                                        Nama Pohon
                                    </td>
                                    <td
                                        className={`py-3 bg-white text-start rounded-tr-lg`}
                                    >
                                        :  
                                    </td>
                                    <td
                                        className={`min-w-[300px] px-2 py-3 bg-white text-start rounded-tr-lg`}
                                    >
                                        {PohonPemda?.label}    
                                    </td>
                                </tr>
                                <tr>
                                    <td
                                        className={`min-w-[100px] px-2 py-3 bg-white text-start rounded-tl-lg`}
                                    >
                                        Jenis Pohon
                                    </td>
                                    <td
                                        className={`py-3 bg-white text-start rounded-tr-lg`}
                                    >
                                        :  
                                    </td>
                                    <td
                                        className={`min-w-[300px] px-2 py-3 bg-white text-start rounded-tr-lg`}
                                    >
                                        {PohonPemda?.jenis}    
                                    </td>
                                </tr>
                                {PohonPemda?.indikators &&
                                <tr>
                                    <td
                                        className={`min-w-[100px] px-2 py-3 bg-white text-start rounded-tl-lg`}
                                    >
                                        Indikator
                                    </td>
                                    <td
                                        className={`py-3 bg-white text-start rounded-tr-lg`}
                                    >
                                        :
                                    </td>
                                    <td
                                        className={`min-w-[300px] px-2 py-3 bg-white text-start rounded-tr-lg`}
                                    >
                                        {PohonPemda?.indikators ? 
                                            PohonPemda?.indikators.map((i: any) => (
                                                <p key={i.id_indikator}>{i.nama_indikator}</p>
                                            ))
                                        :
                                            "-"
                                        }
                                    </td>
                                </tr>
                                }
                                <tr>
                                    <td
                                        className={`min-w-[100px] px-2 py-3 bg-white text-start rounded-tl-lg`}
                                    >
                                        Tahun
                                    </td>
                                    <td
                                        className={`py-3 bg-white text-start rounded-tr-lg`}
                                    >
                                        :  
                                    </td>
                                    <td
                                        className={`min-w-[300px] px-2 py-3 bg-white text-start rounded-tr-lg`}
                                    >
                                        {PohonPemda?.tahun}    
                                    </td>
                                </tr>
                                <tr>
                                    <td
                                        className={`min-w-[100px] px-2 py-3 bg-white text-start rounded-tl-lg`}
                                    >
                                        Status
                                    </td>
                                    <td
                                        className={`py-3 bg-white text-start rounded-tr-lg`}
                                    >
                                        :  
                                    </td>
                                    <td
                                        className={`min-w-[300px] px-2 py-3 bg-white text-start rounded-tr-lg`}
                                    >
                                        {PohonPemda?.status}    
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    }
                </div>
                <div className="flex gap-1 justify-between my-2">
                    <ButtonRedBorder
                        className='w-full'
                        disabled={Proses}
                        onClick={() => {
                            if (PohonPemda?.value == null || undefined) {
                                AlertNotification("Pilih", "Pilih Pohon dari pemda terlebih dahulu", "warning", 1000);
                            } else {
                                tolakPohonPemda(PohonPemda?.value);
                            }
                        }}
                    >
                        {Proses ? 
                            <span className="flex">
                                <LoadingButtonClip />
                                Menolak...
                            </span> 
                        :
                            <span className="flex items-center">
                                <TbCircleLetterXFilled className='mr-1' />
                                Tolak
                            </span> 
                        }
                    </ButtonRedBorder>
                    <ButtonSkyBorder
                        onClick={() => {
                            if (PohonPemda?.value == null || undefined) {
                                AlertNotification("Pilih", "Pilih Pohon dari pemda terlebih dahulu", "warning", 1000);
                            } else {
                                terimaPohonPemda(PohonPemda?.value);
                            }
                        }}
                        className='w-full'
                        disabled={Proses}
                    >
                        {Proses ? 
                            <span className="flex">
                                <LoadingButtonClip />
                                Menerima...
                            </span> 
                        :
                            <span className="flex items-center">
                                <TbCircleCheckFilled className='mr-1' />
                                Terima
                            </span> 
                        }
                    </ButtonSkyBorder>
                </div>
                <ButtonRed className="w-full" onClick={onClose}>
                    Batal
                </ButtonRed>
            </div>
        </div>
    )
    }
}

export const ModalPohonCrosscutting: React.FC<modal> = ({isOpen, onClose, onSuccess}) => {

    const [PohonCross, setPohonCross] = useState<TypePohonPemda | null>(null);
    const [PohonParent, setPohonParent] = useState<OptionType | null>(null);
    const [LevelPohon, setLevelPohon] = useState<OptionType | null>(null);
    const [Baru, setBaru] = useState<boolean>(false);
    const [Pilih, setPilih] = useState<boolean>(false);

    const [OptionPohonParent, setOptionPohonParent] = useState<OptionType[]>([]);
    const [OptionPohonCross, setOptionPohonCross] = useState<TypePohonPemda[]>([]);

    const [Proses, setProses] = useState<boolean>(false);
    const [IsLoading, setIsLoading] = useState<boolean>(false);

    const token = getToken();
    const [User, setUser] = useState<any>(null);
    const [Tahun, setTahun] = useState<any>(null);
    const [SelectedOpd, setSelectedOpd] = useState<any>(null);

    useEffect(() => {
        const fetchUser = getUser();
        if (fetchUser) {
            setUser(fetchUser.user);
        }
        const data = getOpdTahun();
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

    const fetchPohonParent = async (level: number) => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        let url = ''; // Deklarasikan di luar blok
        setIsLoading(true);
        try {
            if (User?.roles == 'super_admin') {
                url = `pohon_kinerja/pilih_parent/${SelectedOpd?.value}/${Tahun?.value}/${level}`;
            } else {
                url = `pohon_kinerja/pilih_parent/${User?.kode_opd}/${Tahun?.value}/${level}`;
            }

            if (!url) {
                throw new Error('URL tidak valid.');
            }

            const response = await fetch(`${API_URL}/${url}`, {
                method: 'GET',
                headers: {
                    Authorization: `${token}`,
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                throw new Error('cant fetch data opd');
            }
            const data = await response.json();
            if(data.data == null){
                console.log("pohon opd kosong, tambahkan di pohon kinerja OPD untuk membuat pohon parent")
            } else {
                const parent = data.data.map((item: any) => ({
                    value: item.id,
                    label: `${item.jenis_pohon} - ${item.nama_pohon}`,
                    jenis: item.jenis_pohon,
                }));
                setOptionPohonParent(parent);
            }
        } catch (err) {
            console.log('gagal mendapatkan data pohon dari opd', err);
        } finally {
            setIsLoading(false);
        }
    };
    const fetchPohonCross = async () => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        setIsLoading(true);
        try {
            const url = User?.roles == 'super_admin' ? `/crosscutting_menunggu/${SelectedOpd?.value}/${Tahun?.value}` : `/crosscutting_menunggu/${User?.kode_opd}/${Tahun?.value}`;
            const response = await fetch(`${API_URL}/${url}`, {
                method: 'GET',
                headers: {
                    Authorization: `${token}`,
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                throw new Error('cant fetch data opd');
            }
            const data = await response.json();
            if(data.data == null){
                console.log("pohon crosscutting kosong/belum ditambahkan")
            } else {
                const pokinCross = data.data.map((item: any) => ({
                    value: item.id,
                    label: `${item.status === "crosscutting_ditolak" ? "Ditolak" : item.status === "crosscutting_menunggu" ? "Pending" : "Unknown"} - ${item.keterangan}`,
                }));
                setOptionPohonCross(pokinCross);
            }
        } catch (err) {
            console.log('gagal mendapatkan data pohon dari opd', err);
        } finally {
            setIsLoading(false);
        }
    };

    const terimaPohonCrossBaru = async (id: number, parent?: number) => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        const formData = {
            approve: true,
            create_new: true,
            use_existing: false,
            parent_id: parent,
            nip_pegawai: User?.nip,
            level_pohon: LevelPohon?.value,
            jenis_pohon: LevelPohon ? (
                LevelPohon?.value === 4 ? "Strategic Crosscutting" :
                LevelPohon?.value === 5 ? "Tactical Crosscutting" :
                LevelPohon?.value === 6 ? "Operational Crosscutting" :
                LevelPohon?.value >= 7 ? "Operational N Crosscutting" : "Pohon Crosscutting"
            )
            :
                "",
        }
        // console.log(formData);
        // console.log("Baru", id);
        try {
            setProses(true);
            const response = await fetch(`${API_URL}/crosscutting/${id}/permission`, {
                method: "POST",
                headers: {
                    Authorization: `${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            })
            if (!response.ok) {
                alert("cant fetch data")
            }
            AlertNotification("Berhasil", "Pohon dari pemda di terima", "success", 1000);
            setPohonCross(null);
            setPohonParent(null);
            setLevelPohon(null);
            onClose();
            onSuccess();
        } catch (err) {
            AlertNotification("Gagal", "cek koneksi internet atau database server", "error", 2000);
            console.error(err);
        } finally {
            setProses(false);
        }
    }
    const terimaPohonCrossPilih = async (id: number, parent?: number) => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        const formData = {
            approve: true,
            create_new: false,
            use_existing: true,
            nip_pegawai: User?.nip,
            existing_id: parent,
        }
        // console.log(formData);
        // console.log("Pilih", id);
        try {
            setProses(true);
            const response = await fetch(`${API_URL}/crosscutting/${id}/permission`, {
                method: "POST",
                headers: {
                    Authorization: `${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            })
            if (!response.ok) {
                alert("cant fetch data")
            }
            AlertNotification("Berhasil", "Pohon dari pemda di terima", "success", 1000);
            setPohonCross(null);
            setPohonParent(null);
            setLevelPohon(null);
            onClose();
            onSuccess();
        } catch (err) {
            AlertNotification("Gagal", "cek koneksi internet atau database server", "error", 2000);
            console.error(err);
        } finally {
            setProses(false);
        }
    }
    const tolakPohonCross = async (id: number) => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        const formData = {
            approve: false,
            nip_pegawai: User?.nip,
        }
        // console.log(formData);
        try {
            setProses(true);
            const response = await fetch(`${API_URL}/crosscutting/${id}/permission`, {
                method: "POST",
                headers: {
                    Authorization: `${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            })
            if (!response.ok) {
                alert("cant fetch data");
                console.error
            }
            AlertNotification("Berhasil", "Data pohon berhasil di tolak", "success", 1000);
            setPohonCross(null);
            setPohonParent(null);
            onClose();
            onSuccess();
            // setTimeout(() => {
            //     window.location.reload();
            // }, 1000);
        } catch (err) {
            AlertNotification("Gagal", "cek koneksi internet atau database server", "error", 2000);
            console.error(err);
        } finally {
            setProses(false);
        }
    }

    const OptionLevel = [
        {label: "Strategic", value: 4},
        {label: "Tactical", value: 5},
        {label: "Operational", value: 6},
        {label: "Operational 1", value: 7},
        {label: "Operational 2", value: 8},
        {label: "Operational 3", value: 9},
        {label: "Operational 4", value: 10},
    ];

    const handleClose = () => {
        setPohonParent(null);
        setPohonCross(null);
        onClose();
    };
    const handleBaru = () => {
        setBaru(Baru ? false : true);
        setPilih(Baru === true ? false : false);
        setPohonParent(null);
    }
    const handlePilih = () => {
        setPilih(Pilih ? false : true);
        setBaru(Pilih === true ? false : false);
        setPohonParent(null);
        setLevelPohon(null);
    }

    if(!isOpen){
        return null;
    } else {

    return(
        <div className="fixed inset-0 flex items-center justify-center z-50">
            {/* KONDISI ON CLOSE */}
            <div className={`fixed inset-0 bg-black opacity-30`} onClick={handleClose}></div>

            <div className={`bg-white rounded-lg p-8 z-10 w-[50%] text-start ${isOpen ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}>
                <div className="w-max-[500px] py-2 border-b text-center font-bold">
                    Pohon OPD Crosscutting
                </div>
                <div className="py-5 my-5">
                    <div className="mb-1">
                        <label htmlFor="" className='uppercase text-xs font-medium text-gray-700 my-2 ml-1'>
                            Pohon Crosscutting OPD
                        </label>
                        <Select
                            placeholder="Pilih Pohon dari OPD lain"
                            value={PohonCross}
                            options={OptionPohonCross}
                            isSearchable
                            isClearable
                            isLoading={IsLoading}
                            onMenuOpen={() => {
                                if (OptionPohonCross.length === 0) {
                                    fetchPohonCross();
                                }
                            }}
                            onChange={(option) => {
                                setPohonCross(option);
                            }}
                            styles={{
                                control: (baseStyles) => ({
                                    ...baseStyles,
                                    borderRadius: '8px',
                                    textAlign: 'start',
                                })
                            }}
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="" className='uppercase text-xs font-medium text-gray-700 my-2 ml-1'>
                            Status Terima Pohon
                        </label>
                        <div className="flex gap-1 mt-1">
                            <button 
                                className={`flex flex-wrap gap-1 items-center py-1 px-3 border rounded-xl transition-all duration-200 ${Baru ? 'bg-blue-500 text-white' : 'border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white'}`}
                                onClick={handleBaru}
                            >
                                <TbFilePlus />
                                Baru
                            </button>
                            <button 
                                className={`flex flex-wrap gap-1 items-center py-1 px-3 border rounded-xl transition-all duration-200 ${Pilih ? 'bg-green-500 text-white' : 'border-green-500 text-green-500 hover:bg-green-500 hover:text-white'}`}
                                onClick={handlePilih}
                            >
                                <TbFileCheck />
                                Pilih
                            </button>
                        </div>
                    </div>
                    {/* BARU */}
                    {Baru &&
                        <>
                            <div className={`mb-1 transition-all duration-200`}>
                                <label className={`uppercase text-xs font-medium text-gray-700 my-2 ml-1 transition-all duration-200`}>
                                    Level Pohon
                                </label>
                                <Select
                                    placeholder="Pilih Level Pohon"
                                    value={LevelPohon}
                                    options={OptionLevel}
                                    isSearchable
                                    isClearable
                                    isLoading={IsLoading}
                                    onChange={(option) => {
                                        setLevelPohon(option);
                                    }}
                                    styles={{
                                        control: (baseStyles) => ({
                                            ...baseStyles,
                                            borderRadius: '8px',
                                            textAlign: 'start',
                                        })
                                    }}
                                />
                            </div>
                            {LevelPohon?.value !== 4 &&
                                <div className="mb-1">
                                    <label htmlFor="" className='uppercase text-xs font-medium text-gray-700 my-2 ml-1 transition-all duration-200'>
                                        {LevelPohon?.value === 5 ? 'Strategic' :
                                         LevelPohon?.value === 6 ? 'Tactical' :
                                         LevelPohon?.value === 7 ? 'Operational' :
                                         LevelPohon?.value === 8 ? 'Operational N' :
                                         LevelPohon?.value === 9 ? 'Operational N' :
                                         LevelPohon?.value === 10 ? 'Operational N' :
                                         "Pohon Parent"
                                        }
                                    </label>
                                    <Select
                                        placeholder="pilih parent"
                                        value={PohonParent}
                                        options={OptionPohonParent}
                                        isSearchable
                                        isClearable
                                        isLoading={IsLoading}
                                        onMenuOpen={() => {
                                            if (LevelPohon?.value === 5) {
                                                fetchPohonParent(4);
                                            } else if(LevelPohon?.value === 6) {
                                                fetchPohonParent(5);
                                            } else if(LevelPohon?.value === 7) {
                                                fetchPohonParent(6);
                                            } else if(LevelPohon?.value === 8) {
                                                fetchPohonParent(7);
                                            } else if(LevelPohon?.value === 9) {
                                                fetchPohonParent(8);
                                            } else if(LevelPohon?.value === 10) {
                                                fetchPohonParent(9);
                                            }
                                        }}
                                        onChange={(option) => {
                                            setPohonParent(option);
                                        }}
                                        onMenuClose={() => setOptionPohonParent([])}
                                        styles={{
                                            control: (baseStyles) => ({
                                                ...baseStyles,
                                                borderRadius: '8px',
                                                textAlign: 'start',
                                            })
                                        }}
                                        />
                                </div>
                            }
                        </>
                    }
                    {/* PILIH */}
                    {Pilih &&
                        <div className="mb-1">
                            <label htmlFor="" className='uppercase text-xs font-medium text-gray-700 my-2 ml-1 transition-all duration-200'>
                                Pohon untuk dipilih
                            </label>
                            <Select
                                placeholder="Pilih pohon untuk dijadikan pilihan crosscutting"
                                value={PohonParent}
                                options={OptionPohonParent}
                                isSearchable
                                isClearable
                                isLoading={IsLoading}
                                onMenuOpen={() => {
                                    fetchPohonParent(0);
                                }}
                                onChange={(option) => {
                                    setPohonParent(option);
                                }}
                                onMenuClose={() => setOptionPohonParent([])}
                                styles={{
                                    control: (baseStyles) => ({
                                        ...baseStyles,
                                        borderRadius: '8px',
                                        textAlign: 'start',
                                    })
                                }}
                                />
                        </div>
                    }
                </div>
                <div className="flex gap-1 justify-between my-2">
                    <ButtonRedBorder
                        className='w-full transition-all duration-200'
                        disabled={Proses}
                        onClick={() => {
                            if (PohonCross?.value == null || undefined) {
                                AlertNotification("Pilih", "Pilih Pohon dari pemda terlebih dahulu", "warning", 1000);
                            } else {
                                tolakPohonCross(PohonCross?.value);
                            }
                        }}
                    >
                        {Proses ? 
                            <span className="flex">
                                <LoadingButtonClip />
                                Menolak...
                            </span> 
                        :
                            <span className="flex items-center">
                                <TbCircleLetterXFilled className='mr-1' />
                                Tolak
                            </span> 
                        }
                    </ButtonRedBorder>
                    <ButtonSkyBorder
                        onClick={() => {
                            if (PohonCross?.value == null || undefined) {
                                AlertNotification("Pilih", "Pilih Pohon dari pemda terlebih dahulu", "warning", 2000);
                            } else {
                                if(Baru){
                                    if(LevelPohon?.value == null || undefined){
                                        AlertNotification("Level Pohon", "Pilih Level Pohon", "warning", 2000);
                                    } else if(LevelPohon?.value === 4){
                                        terimaPohonCrossBaru(PohonCross?.value, 0);
                                    } else if(LevelPohon?.value >= 4) {
                                        if(PohonParent?.value == null || undefined){
                                            AlertNotification("Pohon Parent", "Pilih Pohon Parent", "warning", 2000);
                                        } else {
                                            terimaPohonCrossBaru(LevelPohon?.value, PohonParent?.value);
                                        }
                                    } else {
                                        console.log("level tidak terdeskripsikan di form");
                                    }
                                } else if(Pilih){
                                    if(PohonParent?.value === null || PohonParent?.value === undefined){
                                        AlertNotification("Pohon Pilihan", "Pilih Pohon yang sudah ada untuk dijadikan target crosscutting", "warning", 2000);
                                    } else {
                                        terimaPohonCrossPilih(PohonCross?.value, PohonParent?.value);
                                    }
                                } else {
                                    AlertNotification("Status", "Pilih Status Pohon Baru atau Pilih Pohon yang sudah ada", "warning", 2000);
                                }
                            }
                        }}
                        className='w-full transition-all duration-200'
                        disabled={Proses}
                    >
                        {Proses ? 
                            <span className="flex">
                                <LoadingButtonClip />
                                Menerima...
                            </span> 
                        :
                            <span className="flex items-center">
                                <TbCircleCheckFilled className='mr-1' />
                                {Baru && 'Terima (Baru)'}
                                {Pilih && 'Terima (Pilih)'}
                                {(!Baru && !Pilih) && 'Terima'}
                            </span> 
                        }
                    </ButtonSkyBorder>
                </div>
                <ButtonRed className="w-full" onClick={onClose}>
                    Batal
                </ButtonRed>
            </div>
        </div>
    )
    }
}