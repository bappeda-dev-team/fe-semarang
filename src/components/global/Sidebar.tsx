'use client'

import { useEffect, useState} from 'react';
import { 
  TbBook, TbFileImport, TbApps, TbChecklist, TbShoppingCartDollar, TbRefreshAlert,
  TbLogout,TbBook2,TbBulb,TbFileAlert,TbTooltip,TbBinaryTree,TbBuildingFortress,
  TbBuildingCommunity,TbDatabaseCog,TbHome,TbFileDelta, TbFile3D,
  TbCircleArrowLeftFilled, TbBadges, TbBuilding,
  TbBuildingEstate,
  TbHexagonalPyramid,
  TbFileChart,
  TbFileDots,
  TbFileCode,
  TbFileCode2,
  TbUsers,
  TbArrowUpFromArc
} from "react-icons/tb";
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import "@/app/globals.css";
import { logout, getUser } from '../lib/Cookie';

interface SidebarProps {
  isOpen: boolean | null;
  isZoomed: boolean | null;
  toggleSidebar: () => void;
}

// TODO: REFACTOR SIDEBAR LOGIC
export const Sidebar = ({isZoomed, isOpen, toggleSidebar}: SidebarProps) => {

  const [User, setUser] = useState<any>(null);
  const url = usePathname();
  //state menu, submenu, subsmenu
  const [Dashboard, setDashboard] = useState<boolean | null>(null);
  const [DataMaster, setDataMaster] = useState<boolean | null>(null);
    const [MasterOPD, setMasterOPD] = useState<boolean | null>(null);
    const [MasterPegawai, setMasterPegawai] = useState<boolean | null>(null);
    const [LevelPohon, setLevelPohon] = useState<boolean | null>(null);
    const [MasterProgramKegiatan, setMasterProgramKegiatan] = useState<boolean | null>(null);
      const [MasterUrusan, setMasterUrusan] = useState<boolean | null>(null);
      const [MasterBidangUrusan, setMasterBidangUrusan] = useState<boolean | null>(null);
      const [MasterProgram, setMasterProgram] = useState<boolean | null>(null);
      const [MasterKegiatan, setMasterKegiatan] = useState<boolean | null>(null);
      const [MasterSubKegiatan, setMasterSubKegiatan] = useState<boolean | null>(null);
      const [MasterLembaga, setMasterLembaga] = useState<boolean | null>(null);
    const [MasterJabatan, setMasterJabatan] = useState<boolean | null>(null);
  const [PerencanaanKota, setPerencanaanKota] = useState<boolean | null>(null);
    const [TematikKota, setTematikKota] = useState<boolean | null>(null);
    const [SubTematik, setSubTematik] = useState<boolean | null>(null);
    const [KotaPohonKinerjaKota, setKotaPohonKinerjaKota] = useState<boolean | null>(null);
  const [PerencanaanOPD, setPerencanaanOPD] = useState<boolean | null>(null);
    const [OpdPohonKinerjaKota, setOpdPohonKinerjaKota] = useState<boolean | null>(null);
    const [PohonKinerja, setPohonKinerja] = useState<boolean | null>(null);
    const [PohonCascading, setPohonCascading] = useState<boolean | null>(null);
  const [Perencanaan, setPerencanaan] = useState<boolean | null>(null);
    const [RencanaKinerja, setRencanaKinerja] = useState<boolean | null>(null);
    const [PerencanaanManajemenResiko, setPerencanaanManajemenResiko] = useState<boolean | null>(null);
  const [Laporan, setLaporan] = useState<boolean | null>(null);    
    const [Usulan, setUsulan] = useState<boolean | null>(null);
      const [Musrenbang, setMusrenbang] = useState<boolean | null>(null);
      const [PokokPikiran, setPokokPikiran] = useState<boolean | null>(null);
      const [Mandatori, setMandatori] = useState<boolean | null>(null);
    const [SPIP, setSPIP] = useState<boolean | null>(null);
    const [ManajemenResiko, setManajemenResiko] = useState<boolean | null>(null);
    const [Inovasi, setInovasi] = useState<boolean | null>(null);
    const [RencanaKinerjaKAK, setRencanaKinerjaKAK] = useState<boolean | null>(null);
    const [RincianBelanja, setRincianBelanja] = useState<boolean | null>(null);

  useEffect(() => {
    const fetchUser = getUser();
    if(fetchUser){
      setUser(fetchUser.user);
    }
  },[])

  useEffect(() => {
    if(url == "/"){
      setDashboard(true);
      setDataMaster(false);
      setMasterOPD(false);
      setMasterPegawai(false);
      setLevelPohon(false);
      setMasterProgramKegiatan(false);
      setMasterBidangUrusan(false);
      setMasterKegiatan(false);
      setMasterProgram(false);
      setMasterSubKegiatan(false);
      setMasterUrusan(false);
      setMasterJabatan(false);
      setMasterLembaga(false);
      setTematikKota(false);
      setSubTematik(false);
      setPerencanaanKota(false);
      setKotaPohonKinerjaKota(false);
      setPerencanaanOPD(false);
      setLaporan(false);
      setUsulan(false);
      setRencanaKinerjaKAK(false);
      setRincianBelanja(false);
      setMusrenbang(false);
      setPokokPikiran(false);
      setMandatori(false);
      setManajemenResiko(false);
      setPohonCascading(false);
    }
    //Data Master
    if(url == "/DataMaster/masteropd"){
      setDashboard(false);
      setDataMaster(true);
      setMasterOPD(true);
      setMasterPegawai(false);
      setLevelPohon(false);
      setMasterProgramKegiatan(false);
      setMasterBidangUrusan(false);
      setMasterKegiatan(false);
      setMasterProgram(false);
      setMasterSubKegiatan(false);
      setMasterUrusan(false);
      setMasterJabatan(false);
      setMasterLembaga(false);
      setTematikKota(false);
      setSubTematik(false);
      setPerencanaanKota(false);
      setKotaPohonKinerjaKota(false);
      setPerencanaanOPD(false);
      setLaporan(false);
      setUsulan(false);
      setRencanaKinerjaKAK(false);
      setRincianBelanja(false);
      setMusrenbang(false);
      setPokokPikiran(false);
      setMandatori(false);
      setManajemenResiko(false);
      setPohonCascading(false);
    }
    if(url == "/DataMaster/masterpegawai"){
      setDashboard(false);
      setDataMaster(true);
      setMasterOPD(false);
      setMasterPegawai(true);
      setLevelPohon(false);
      setMasterProgramKegiatan(false);
      setMasterBidangUrusan(false);
      setMasterKegiatan(false);
      setMasterProgram(false);
      setMasterSubKegiatan(false);
      setMasterUrusan(false);
      setMasterJabatan(false);
      setMasterLembaga(false);
      setTematikKota(false);
      setSubTematik(false);
      setPerencanaanKota(false);
      setKotaPohonKinerjaKota(false);
      setPerencanaanOPD(false);
      setLaporan(false);
      setUsulan(false);
      setRencanaKinerjaKAK(false);
      setRincianBelanja(false);
      setMusrenbang(false);
      setPokokPikiran(false);
      setMandatori(false);
      setManajemenResiko(false);
      setPohonCascading(false);
    }
    if(url == "/DataMaster/levelpohon"){
      setDashboard(false);
      setDataMaster(true);
      setMasterOPD(false);
      setMasterPegawai(false);
      setLevelPohon(true);
      setMasterProgramKegiatan(false);
      setMasterBidangUrusan(false);
      setMasterKegiatan(false);
      setMasterProgram(false);
      setMasterSubKegiatan(false);
      setMasterUrusan(false);
      setMasterJabatan(false);
      setMasterLembaga(false);
      setTematikKota(false);
      setSubTematik(false);
      setPerencanaanKota(false);
      setKotaPohonKinerjaKota(false);
      setPerencanaanOPD(false);
      setLaporan(false);
      setUsulan(false);
      setRencanaKinerjaKAK(false);
      setRincianBelanja(false);
      setMusrenbang(false);
      setPokokPikiran(false);
      setMandatori(false);
      setManajemenResiko(false);
      setPohonCascading(false);
    }
    //master program kegiatan
    if(url == "/DataMaster/masterprogramkegiatan/bidangurusan"){
      setDashboard(false);
      setDataMaster(true);
      setMasterOPD(false);
      setMasterPegawai(false);
      setLevelPohon(false);
      setMasterProgramKegiatan(true);
      setMasterBidangUrusan(true);
      setMasterKegiatan(false);
      setMasterProgram(false);
      setMasterSubKegiatan(false);
      setMasterUrusan(false);
      setMasterJabatan(false);
      setMasterLembaga(false);
      setTematikKota(false);
      setSubTematik(false);
      setPerencanaanKota(false);
      setKotaPohonKinerjaKota(false);
      setPerencanaanOPD(false);
      setLaporan(false);
      setUsulan(false);
      setRencanaKinerjaKAK(false);
      setRincianBelanja(false);
      setMusrenbang(false);
      setPokokPikiran(false);
      setMandatori(false);
      setManajemenResiko(false);
      setPohonCascading(false);
    }
    if(url == "/DataMaster/masterprogramkegiatan/kegiatan"){
      setDashboard(false);
      setDataMaster(true);
      setMasterOPD(false);
      setMasterPegawai(false);
      setLevelPohon(false);
      setMasterProgramKegiatan(true);
      setMasterBidangUrusan(false);
      setMasterKegiatan(true);
      setMasterProgram(false);
      setMasterSubKegiatan(false);
      setMasterUrusan(false);
      setMasterJabatan(false);
      setMasterLembaga(false);
      setTematikKota(false);
      setSubTematik(false);
      setPerencanaanKota(false);
      setKotaPohonKinerjaKota(false);
      setPerencanaanOPD(false);
      setLaporan(false);
      setUsulan(false);
      setRencanaKinerjaKAK(false);
      setRincianBelanja(false);
      setMusrenbang(false);
      setPokokPikiran(false);
      setMandatori(false);
      setManajemenResiko(false);
      setPohonCascading(false);
    }
    if(url == "/DataMaster/masterprogramkegiatan/program"){
      setDashboard(false);
      setDataMaster(true);
      setMasterOPD(false);
      setMasterPegawai(false);
      setLevelPohon(false);
      setMasterProgramKegiatan(true);
      setMasterBidangUrusan(false);
      setMasterKegiatan(false);
      setMasterProgram(true);
      setMasterSubKegiatan(false);
      setMasterUrusan(false);
      setMasterJabatan(false);
      setMasterLembaga(false);
      setTematikKota(false);
      setSubTematik(false);
      setPerencanaanKota(false);
      setKotaPohonKinerjaKota(false);
      setPerencanaanOPD(false);
      setLaporan(false);
      setUsulan(false);
      setRencanaKinerjaKAK(false);
      setRincianBelanja(false);
      setMusrenbang(false);
      setPokokPikiran(false);
      setMandatori(false);
      setManajemenResiko(false);
      setPohonCascading(false);
    }
    if(url == "/DataMaster/masterprogramkegiatan/subkegiatan"){
      setDashboard(false);
      setDataMaster(true);
      setMasterOPD(false);
      setMasterPegawai(false);
      setLevelPohon(false);
      setMasterProgramKegiatan(true);
      setMasterBidangUrusan(false);
      setMasterKegiatan(false);
      setMasterProgram(false);
      setMasterSubKegiatan(true);
      setMasterUrusan(false);
      setMasterJabatan(false);
      setMasterLembaga(false);
      setTematikKota(false);
      setSubTematik(false);
      setPerencanaanKota(false);
      setKotaPohonKinerjaKota(false);
      setPerencanaanOPD(false);
      setLaporan(false);
      setUsulan(false);
      setRencanaKinerjaKAK(false);
      setRincianBelanja(false);
      setMusrenbang(false);
      setPokokPikiran(false);
      setMandatori(false);
      setManajemenResiko(false);
      setPohonCascading(false);
    }
    if(url == "/DataMaster/masterprogramkegiatan/urusan"){
      setDashboard(false);
      setDataMaster(true);
      setMasterOPD(false);
      setMasterPegawai(false);
      setLevelPohon(false);
      setMasterProgramKegiatan(true);
      setMasterBidangUrusan(false);
      setMasterKegiatan(false);
      setMasterProgram(false);
      setMasterSubKegiatan(false);
      setMasterUrusan(true);
      setMasterJabatan(false);
      setMasterLembaga(false);
      setTematikKota(false);
      setSubTematik(false);
      setPerencanaanKota(false);
      setKotaPohonKinerjaKota(false);
      setPerencanaanOPD(false);
      setLaporan(false);
      setUsulan(false);
      setRencanaKinerjaKAK(false);
      setRincianBelanja(false);
      setMusrenbang(false);
      setPokokPikiran(false);
      setMandatori(false);
      setManajemenResiko(false);
      setPohonCascading(false);
    }
    if(url == "/DataMaster/masterjabatan"){
      setDashboard(false);
      setDataMaster(true);
      setMasterOPD(false);
      setMasterPegawai(false);
      setLevelPohon(false);
      setMasterProgramKegiatan(false);
      setMasterBidangUrusan(false);
      setMasterKegiatan(false);
      setMasterProgram(false);
      setMasterSubKegiatan(false);
      setMasterUrusan(false);
      setMasterJabatan(true);
      setMasterLembaga(false);      
      setTematikKota(false);
      setSubTematik(false);
      setPerencanaanKota(false);
      setKotaPohonKinerjaKota(false);
      setPerencanaanOPD(false);
      setLaporan(false);
      setUsulan(false);
      setRencanaKinerjaKAK(false);
      setRincianBelanja(false);
      setMusrenbang(false);
      setPokokPikiran(false);
      setMandatori(false);
      setManajemenResiko(false);
      setPohonCascading(false);
    }
    if(url == "/DataMaster/masterlembaga"){
      setDashboard(false);
      setDataMaster(true);
      setMasterOPD(false);
      setMasterPegawai(false);
      setLevelPohon(false);
      setMasterProgramKegiatan(false);
      setMasterBidangUrusan(false);
      setMasterKegiatan(false);
      setMasterProgram(false);
      setMasterSubKegiatan(false);
      setMasterUrusan(false);
      setMasterJabatan(false);
      setMasterLembaga(true);      
      setTematikKota(false);
      setSubTematik(false);
      setPerencanaanKota(false);
      setKotaPohonKinerjaKota(false);
      setPerencanaanOPD(false);
      setLaporan(false);
      setUsulan(false);
      setRencanaKinerjaKAK(false);
      setRincianBelanja(false);
      setMusrenbang(false);
      setPokokPikiran(false);
      setMandatori(false);
      setManajemenResiko(false);
      setPohonCascading(false);
    }
    //PERENCANAAN KOTA
    if(url == "/pohonkinerjakota"){
      setDashboard(false);
      setDataMaster(false);
      setMasterOPD(false);
      setMasterPegawai(false);
      setLevelPohon(false);
      setMasterProgramKegiatan(false);
      setMasterBidangUrusan(false);
      setMasterKegiatan(false);
      setMasterProgram(false);
      setMasterSubKegiatan(false);
      setMasterUrusan(false);
      setMasterJabatan(false);
      setMasterLembaga(false);      
      setTematikKota(false);
      setSubTematik(false);
      setPerencanaanKota(true);
      setKotaPohonKinerjaKota(true);
      setPerencanaanOPD(false);
      setLaporan(false);
      setUsulan(false);
      setRencanaKinerjaKAK(false);
      setRincianBelanja(false);
      setMusrenbang(false);
      setPokokPikiran(false);
      setMandatori(false);
      setManajemenResiko(false);
      setPohonCascading(false);
    }
    if(url == "/tematikkota"){
      setDashboard(false);
      setDataMaster(false);
      setMasterOPD(false);
      setMasterPegawai(false);
      setLevelPohon(false);
      setMasterProgramKegiatan(false);
      setMasterBidangUrusan(false);
      setMasterKegiatan(false);
      setMasterProgram(false);
      setMasterSubKegiatan(false);
      setMasterUrusan(false);
      setMasterJabatan(false);
      setMasterLembaga(false);      
      setPerencanaanKota(true);
      setTematikKota(true);
      setSubTematik(false);
      setKotaPohonKinerjaKota(false);
      setPerencanaanOPD(false);
      setLaporan(false);
      setUsulan(false);
      setRencanaKinerjaKAK(false);
      setRincianBelanja(false);
      setMusrenbang(false);
      setPokokPikiran(false);
      setMandatori(false);
      setManajemenResiko(false);
      setPohonCascading(false);
    }
    if(url == "/subtematik"){
      setDashboard(false);
      setDataMaster(false);
      setMasterOPD(false);
      setMasterPegawai(false);
      setLevelPohon(false);
      setMasterProgramKegiatan(false);
      setMasterBidangUrusan(false);
      setMasterKegiatan(false);
      setMasterProgram(false);
      setMasterSubKegiatan(false);
      setMasterUrusan(false);
      setMasterJabatan(false);
      setMasterLembaga(false);      
      setPerencanaanKota(true);
      setTematikKota(false);
      setSubTematik(true);
      setKotaPohonKinerjaKota(false);
      setPerencanaanOPD(false);
      setLaporan(false);
      setUsulan(false);
      setRencanaKinerjaKAK(false);
      setRincianBelanja(false);
      setMusrenbang(false);
      setPokokPikiran(false);
      setMandatori(false);
      setManajemenResiko(false);
      setPohonCascading(false);
    }
    if(url == "/rencanakinerja"){
      setDashboard(false);
      setDataMaster(false);
      setMasterOPD(false);
      setMasterPegawai(false);
      setLevelPohon(false);
      setMasterProgramKegiatan(false);
      setMasterBidangUrusan(false);
      setMasterKegiatan(false);
      setMasterProgram(false);
      setMasterSubKegiatan(false);
      setMasterUrusan(false);
      setMasterJabatan(false);
      setMasterLembaga(false);
      setTematikKota(false);
      setSubTematik(false);
      setPerencanaanKota(false);
      setKotaPohonKinerjaKota(false);
      setUsulan(false);
      setMusrenbang(false);
      setPokokPikiran(false);
      setMandatori(false);
      setManajemenResiko(false);
      setPohonCascading(false);
      setLaporan(true);
      setRencanaKinerjaKAK(true);
      setRincianBelanja(false);
    }
    if(url == "/rincianbelanja"){
      setDashboard(false);
      setDataMaster(false);
      setMasterOPD(false);
      setMasterPegawai(false);
      setLevelPohon(false);
      setMasterProgramKegiatan(false);
      setMasterBidangUrusan(false);
      setMasterKegiatan(false);
      setMasterProgram(false);
      setMasterSubKegiatan(false);
      setMasterUrusan(false);
      setMasterJabatan(false);
      setMasterLembaga(false);
      setTematikKota(false);
      setSubTematik(false);
      setPerencanaanKota(false);
      setKotaPohonKinerjaKota(false);
      setRencanaKinerjaKAK(false);
      setLaporan(true);
      setUsulan(false);
      setMusrenbang(false);
      setPokokPikiran(false);
      setMandatori(false);
      setManajemenResiko(false);
      setPohonCascading(false);
      setRincianBelanja(true);
    }
    if(url == "/musrenbang"){
      setDashboard(false);
      setDataMaster(false);
      setMasterOPD(false);
      setMasterPegawai(false);
      setLevelPohon(false);
      setMasterProgramKegiatan(false);
      setMasterBidangUrusan(false);
      setMasterKegiatan(false);
      setMasterProgram(false);
      setMasterSubKegiatan(false);
      setMasterUrusan(false);
      setMasterJabatan(false);
      setMasterLembaga(false);
      setTematikKota(false);
      setSubTematik(false);
      setPerencanaanKota(true);
      setUsulan(true);
      setRencanaKinerjaKAK(false);
      setRincianBelanja(false);
      setMusrenbang(true);
      setPokokPikiran(false);
      setMandatori(false);
      setManajemenResiko(false);
      setPohonCascading(false);
    }
    if(url == "/pokokpikiran"){
      setDashboard(false);
      setDataMaster(false);
      setMasterOPD(false);
      setMasterPegawai(false);
      setLevelPohon(false);
      setMasterProgramKegiatan(false);
      setMasterBidangUrusan(false);
      setMasterKegiatan(false);
      setMasterProgram(false);
      setMasterSubKegiatan(false);
      setMasterUrusan(false);
      setMasterJabatan(false);
      setMasterLembaga(false);
      setTematikKota(false);
      setSubTematik(false);
      setPerencanaanKota(true);
      setUsulan(true);
      setRencanaKinerjaKAK(false);
      setRincianBelanja(false);
      setMusrenbang(false);
      setPokokPikiran(true);
      setMandatori(false);
      setManajemenResiko(false);
      setPohonCascading(false);
    }
    if(url == "/mandatori"){
      setDashboard(false);
      setDataMaster(false);
      setMasterOPD(false);
      setMasterPegawai(false);
      setLevelPohon(false);
      setMasterProgramKegiatan(false);
      setMasterBidangUrusan(false);
      setMasterKegiatan(false);
      setMasterProgram(false);
      setMasterSubKegiatan(false);
      setMasterUrusan(false);
      setMasterJabatan(false);
      setMasterLembaga(false);
      setTematikKota(false);
      setSubTematik(false);
      setPerencanaanKota(true);
      setUsulan(true);
      setRencanaKinerjaKAK(false);
      setRincianBelanja(false);
      setMusrenbang(false);
      setPokokPikiran(false);
      setMandatori(true);
      setManajemenResiko(false);
      setPohonCascading(false);
    }
    if(url == "/manajemenresiko"){
      setDashboard(false);
      setDataMaster(false);
      setMasterOPD(false);
      setMasterPegawai(false);
      setLevelPohon(false);
      setMasterProgramKegiatan(false);
      setMasterBidangUrusan(false);
      setMasterKegiatan(false);
      setMasterProgram(false);
      setMasterSubKegiatan(false);
      setMasterUrusan(false);
      setMasterJabatan(false);
      setMasterLembaga(false);
      setTematikKota(false);
      setSubTematik(false);
      setPerencanaanKota(true);
      setUsulan(false);
      setRencanaKinerjaKAK(false);
      setRincianBelanja(false);
      setMusrenbang(false);
      setPokokPikiran(false);
      setMandatori(false);
      setManajemenResiko(true);
      setPohonCascading(false);
    }
    if(url == "/pohoncascading"){
      setDashboard(false);
      setDataMaster(false);
      setMasterOPD(false);
      setMasterPegawai(false);
      setLevelPohon(false);
      setMasterProgramKegiatan(false);
      setMasterBidangUrusan(false);
      setMasterKegiatan(false);
      setMasterProgram(false);
      setMasterSubKegiatan(false);
      setMasterUrusan(false);
      setMasterJabatan(false);
      setMasterLembaga(false);
      setTematikKota(false);
      setSubTematik(false);
      setPerencanaanKota(false);
      setKotaPohonKinerjaKota(false);
      setPerencanaanOPD(true);
      setUsulan(false);
      setRencanaKinerjaKAK(false);
      setRincianBelanja(false);
      setMusrenbang(false);
      setPokokPikiran(false);
      setMandatori(false);
      setManajemenResiko(false);
      setPohonCascading(true);
    }
  }, [url]);

  return (
    <div className="flex">
      {/* tombol sidebar zoom 150% */}
      {isZoomed && (
        <div 
          className={`fixed top-1 bg-gray-800 border border-white p-2 cursor-pointer duration-200 text-white rounded-md z-50 ${!isOpen ? 'rotate-180 ' : 'left-[13rem]'}`}
          onClick={() => toggleSidebar()}
        >
          <TbCircleArrowLeftFilled/>
        </div>
      )}

      {/* awal sidebar */}
      <div className={`bg-gray-800 overflow-y-auto text-white h-full ${isOpen ? 'w-64 py-5 px-3' : 'w-0'} duration-300 fixed custom-scrollbar`}>
        <div className="flex items-center justify-center">
          <Image
            className="mb-3 transition-all duration-300 ease-in-out"
            src="/logo.png"
            alt="logo"
            width={!isZoomed ? 80 : 80}
            height={!isZoomed ? 80 : 80}
          />
        </div>
        {/* tombol sidebar default */}
        {!isZoomed && (
        <div 
          className={`fixed top-1 p-2 mt-5 cursor-pointer border border-white text-white duration-200 rounded-md z-50 ${!isOpen ? 'rotate-180 bg-gray-800' : 'left-[13rem]'}`}
          onClick={toggleSidebar}
        >
          <TbCircleArrowLeftFilled/>
        </div>
        )}
        {/* {!isZoomed && (
          <FiChevronsLeft
            className={`absolute cursor-pointer -right-7 top-1 border-2 bg-gray-900 text-white rounded-md ${
              !isOpen && 'rotate-180'
            }`}
            onClick={toggleSidebar}
          />
        )} */}
        <div className="flex gap-x-4 items-center">
          <div className={`flex flex-wrap justify-center text-white text-center text-xl ${!isOpen && 'scale-0'} duration-300`}>
            <h2 className='font-bold'>
              KERTAS KERJA
            </h2>
            <h3 className='font-normal'>
              Kabupaten Madiun
            </h3>
          </div>
        </div>

        <ul className="pt-6">
          <Link href="/">
            <li className={`flex items-center font-medium gap-x-2 cursor-pointer p-2 rounded-xl ${Dashboard ? "bg-white text-gray-800" : "hover:bg-gray-700"}`}>
              <TbHome className="text-xl" />
              <span className={`${!isOpen && 'hidden'} origin-left duration-200`}>Dashboard</span>
            </li>
          </Link>
          {/* DATA MASTER */}
          {User == 'super_admin' && 
            <li 
              className={`flex items-center font-medium gap-x-2 cursor-pointer p-2 rounded-xl hover:bg-gray-700`}
              onClick={() => setDataMaster(DataMaster ? false : true)}
            >
              <TbDatabaseCog className="text-xl" />
              <span className={`${!isOpen && 'hidden'} origin-left duration-200`}>Data Master</span>
            </li>
          }
          {/* submenu */}
          {DataMaster && 
            <div className="flex flex-col border-l-2 border-white rounded-b-xl px-3 py-2 ml-2 duration-200">
              <Link href="/DataMaster/masterlembaga">
                <li className={`flex items-center gap-x-2 cursor-pointer p-2 rounded-xl ${MasterLembaga ? "bg-white text-gray-800" : "hover:bg-gray-700"}`}>
                  <TbBuildingEstate className="text-xl" />
                  <span className={`${!isOpen && 'hidden'} origin-left duration-200`}>Master Lembaga</span>
                </li>
              </Link>
              <Link href="/DataMaster/masteropd">
                <li className={`flex items-center gap-x-2 cursor-pointer p-2 rounded-xl ${MasterOPD ? "bg-white text-gray-800" : "hover:bg-gray-700"}`}>
                  <TbBuilding className="text-xl" />
                  <span className={`${!isOpen && 'hidden'} origin-left duration-200`}>Master OPD</span>
                </li>
              </Link>
              <Link href="/DataMaster/masterpegawai">
                <li className={`flex items-center gap-x-2 cursor-pointer p-2 rounded-xl ${MasterPegawai ? "bg-white text-gray-800" : "hover:bg-gray-700"}`}>
                  <TbUsers className="text-xl" />
                  <span className={`${!isOpen && 'hidden'} origin-left duration-200`}>Master Pegawai</span>
                </li>
              </Link>
              <Link href="/DataMaster/masterjabatan">
                <li className={`flex items-center gap-x-2 cursor-pointer p-2 rounded-xl ${MasterJabatan ? "bg-white text-gray-800" : "hover:bg-gray-700"}`}>
                  <TbBadges className="text-xl" />
                  <span className={`${!isOpen && 'hidden'} origin-left duration-200`}>Master Jabatan</span>
                </li>
              </Link>
              <Link href="/DataMaster/levelpohon">
                <li className={`flex items-center gap-x-2 cursor-pointer p-2 rounded-xl ${LevelPohon ? "bg-white text-gray-800" : "hover:bg-gray-700"}`}>
                  <TbHexagonalPyramid className="text-xl" />
                  <span className={`${!isOpen && 'hidden'} origin-left duration-200`}>Level Pohon</span>
                </li>
              </Link>
              <li 
                className={`flex gap-x-2 cursor-pointer p-2 rounded-xl hover:bg-gray-700`}
                onClick={() => setMasterProgramKegiatan(MasterProgramKegiatan ? false : true)}
              >
                <TbFile3D className="text-xl mt-1" />
                <span className={`${!isOpen && 'hidden'} origin-left duration-200`}>Master Program Kegiatan</span>
              </li>
              {MasterProgramKegiatan && 
                <div className="flex flex-col border-l-2 border-white rounded-b-xl px-3 py-2 ml-2 duration-200">
                  <Link href="/DataMaster/masterprogramkegiatan/urusan">
                    <li className={`flex items-center gap-x-2 cursor-pointer p-2 rounded-xl ${MasterUrusan ? "bg-white text-gray-800" : "hover:bg-gray-700"}`}>
                      <TbFileChart className="text-xl" />
                      <span className={`${!isOpen && 'hidden'} origin-left duration-200`}>Urusan</span>
                    </li>
                  </Link>
                  <Link href="/DataMaster/masterprogramkegiatan/bidangurusan">
                    <li className={`flex items-center gap-x-2 cursor-pointer p-2 rounded-xl ${MasterBidangUrusan ? "bg-white text-gray-800" : "hover:bg-gray-700"}`}>
                      <TbFileDelta className="text-xl" />
                      <span className={`${!isOpen && 'hidden'} origin-left duration-200`}>Bidang Urusan</span>
                    </li>
                  </Link>
                  <Link href="/DataMaster/masterprogramkegiatan/program">
                    <li className={`flex items-center gap-x-2 cursor-pointer p-2 rounded-xl ${MasterProgram ? "bg-white text-gray-800" : "hover:bg-gray-700"}`}>
                      <TbFileDots className="text-xl" />
                      <span className={`${!isOpen && 'hidden'} origin-left duration-200`}>Program</span>
                    </li>
                  </Link>
                  <Link href="/DataMaster/masterprogramkegiatan/kegiatan">
                    <li className={`flex items-center gap-x-2 cursor-pointer p-2 rounded-xl ${MasterKegiatan ? "bg-white text-gray-800" : "hover:bg-gray-700"}`}>
                      <TbFileCode className="text-xl" />
                      <span className={`${!isOpen && 'hidden'} origin-left duration-200`}>Kegiatan</span>
                    </li>
                  </Link>
                  <Link href="/DataMaster/masterprogramkegiatan/subkegiatan">
                    <li className={`flex items-center gap-x-2 cursor-pointer p-2 rounded-xl ${MasterSubKegiatan ? "bg-white text-gray-800" : "hover:bg-gray-700"}`}>
                      <TbFileCode2 className="text-xl" />
                      <span className={`${!isOpen && 'hidden'} origin-left duration-200`}>Sub Kegiatan</span>
                    </li>
                  </Link>
                </div>
              }
            </div>
          }
          {/* PERENCANAAN KOTA */}
          {User == 'super_admin'&& 
            <li 
              className={`flex font-medium items-center gap-x-2 cursor-pointer p-2 rounded-xl hover:bg-gray-700`}
              onClick={() => setPerencanaanKota(PerencanaanKota ? false : true)}
            >
              <TbBuildingFortress className="text-xl" />
              <span className={`${!isOpen && 'hidden'} origin-left duration-200`}>Perencanaan Kabupaten</span>
            </li>
          }
          {PerencanaanKota &&
          <div className="flex flex-col border-l-2 border-white rounded-b-xl px-3 py-2 ml-2 duration-200">
            {/* submenu */}
            <Link href="/tematikkota">
              <li className={`flex items-center gap-x-2 cursor-pointer p-2 rounded-xl ${TematikKota ? "bg-white text-gray-800" : "hover:bg-gray-700"}`}>
                <TbArrowUpFromArc className="text-xl" />
                <span className={`${!isOpen && 'hidden'} origin-left duration-200`}>Tematik Kab</span>
              </li>
            </Link>
            <Link href="/subtematik">
              <li className={`flex items-center gap-x-2 cursor-pointer p-2 rounded-xl ${SubTematik ? "bg-white text-gray-800" : "hover:bg-gray-700"}`}>
                <TbArrowUpFromArc className="text-xl" />
                <span className={`${!isOpen && 'hidden'} origin-left duration-200`}>Sub Tematik</span>
              </li>
            </Link>
            <Link href="/pohonkinerjakota">
              <li className={`flex items-center gap-x-2 cursor-pointer p-2 rounded-xl ${KotaPohonKinerjaKota ? "bg-white text-gray-800" : "hover:bg-gray-700"}`}>
                <TbBinaryTree className="text-xl" />
                <span className={`${!isOpen && 'hidden'} origin-left duration-200`}>Pohon Kinerja Kab</span>
              </li>
            </Link>
          </div>
          }
          {/* PERENCANAAN OPD */}
          {(User == 'super_admin' || User == 'admin_opd') && 
            <li 
              className={`flex font-medium items-center gap-x-2 cursor-pointer p-2 rounded-xl hover:bg-gray-700`}
              onClick={() => setPerencanaanOPD(PerencanaanOPD ? false : true)}
            >
              <TbBuildingCommunity className="text-xl" />
              <span className={`${!isOpen && 'hidden'} origin-left duration-200`}>Perencanaan OPD</span>
            </li>
          }
            {/* submenu */}
            {PerencanaanOPD && 
            <div className="flex flex-col border-l-2 border-white rounded-b-xl px-3 py-2 ml-2 duration-200">
              <Link href="#">
                <li className={`flex items-center gap-x-2 cursor-pointer p-2 rounded-xl ${OpdPohonKinerjaKota ? "bg-white text-gray-800" : "hover:bg-gray-700"}`}>
                  <TbBinaryTree className="text-xl" />
                  <span className={`${!isOpen && 'hidden'} origin-left duration-200`}>Pohon Kinerja Kabupaten</span>
                </li>
              </Link>
              <Link href="#">
                <li className={`flex items-center gap-x-2 cursor-pointer p-2 rounded-xl ${PohonKinerja ? "bg-white text-gray-800" : "hover:bg-gray-700"}`}>
                  <TbBinaryTree className="text-xl" />
                  <span className={`${!isOpen && 'hidden'} origin-left duration-200`}>Pohon Kinerja</span>
                </li>
              </Link>
              <Link href="/pohoncascading">
                <li className={`flex items-center gap-x-2 cursor-pointer p-2 rounded-xl ${PohonCascading ? "bg-white text-gray-800" : "hover:bg-gray-700"}`}>
                  <TbBinaryTree className="text-xl" />
                  <span className={`${!isOpen && 'hidden'} origin-left duration-200`}>Pohon Cascading</span>
                </li>
              </Link>
            </div>
          }
          {User == 'asn' && 
            <li 
              className={`flex font-medium items-center gap-x-2 cursor-pointer p-2 rounded-xl hover:bg-gray-700`}
              onClick={() => setPerencanaan(Perencanaan ? false : true)}
            >
              <TbBuildingFortress className="text-xl" />
              <span className={`${!isOpen && 'hidden'} origin-left duration-200`}>Perencanaan</span>
            </li>
          }
            {/* submenu */}
            {Perencanaan && 
            <div className="flex flex-col border-l-2 border-white rounded-b-xl px-3 py-2 ml-2 duration-200">
              <li 
                className="flex items-center gap-x-2 cursor-pointer p-2 hover:bg-gray-700 rounded-xl"
                onClick={() => setUsulan(Usulan ? false : true)}
              >
                <TbApps className="text-xl" />
                <span className={`${!isOpen && 'hidden'} origin-left duration-200`}>Usulan</span>
              </li>
                {/* subs menu */}
                {Usulan && 
                <div className="flex flex-col border-l-2 border-white rounded-b-xl px-3 py-2 ml-2 duration-200">
                  <Link href="/musrenbang">
                    <li className={`flex items-center gap-x-2 cursor-pointer p-2 rounded-xl ${Musrenbang ? "bg-white text-gray-800" : "hover:bg-gray-700"}`}>
                      <TbBook2 className="text-xl" />
                      <span className={`${!isOpen && 'hidden'} origin-left duration-200`}>Musrenbang</span>
                    </li>
                  </Link>
                  <Link href="/pokokpikiran">
                    <li className={`flex items-center gap-x-2 cursor-pointer p-2 rounded-xl ${PokokPikiran ? "bg-white text-gray-800" : "hover:bg-gray-700"}`}>
                      <TbBulb className="text-xl" />
                      <span className={`${!isOpen && 'hidden'} origin-left duration-200`}>Pokok Pikiran</span>
                    </li>
                  </Link>
                  <Link href="/mandatori">
                    <li className={`flex items-center gap-x-2 cursor-pointer p-2 rounded-xl ${Mandatori ? "bg-white text-gray-800" : "hover:bg-gray-700"}`}>
                      <TbFileAlert className="text-xl" />
                      <span className={`${!isOpen && 'hidden'} origin-left duration-200`}>Mandatori</span>
                    </li>
                  </Link>
                  <li className="flex items-center gap-x-2 cursor-pointer p-2 hover:bg-gray-700 rounded-xl">
                    <TbTooltip className="text-xl" />
                    <span className={`${!isOpen && 'hidden'} origin-left duration-200`}>Inisiatif Bupati</span>
                  </li>
                </div>
                }
              <Link href="/pohoncascading">
                <li className={`flex items-center gap-x-2 cursor-pointer p-2 rounded-xl ${PohonCascading ? "bg-white text-gray-800" : "hover:bg-gray-700"}`}>
                  <TbBinaryTree className="text-xl" />
                  <span className={`${!isOpen && 'hidden'} origin-left duration-200`}>Pohon Cascading</span>
                </li>
              </Link>
              <Link href="/rencanakinerja">
                <li className={`flex items-center gap-x-2 cursor-pointer p-2 rounded-xl ${RencanaKinerja ? "bg-white text-gray-800" : "hover:bg-gray-700"}`}>
                  <TbChecklist className="text-xl" />
                  <span className={`${!isOpen && 'hidden'} origin-left duration-200`}>Rencana Kinerja</span>
                </li>
              </Link>
              <Link href="/rincianbelanja">
                <li className={`flex items-center gap-x-2 cursor-pointer p-2 rounded-xl ${RincianBelanja ? "bg-white text-gray-800" : "hover:bg-gray-700"}`}>
                  <TbShoppingCartDollar className="text-xl" />
                  <span className={`${!isOpen && 'hidden'} origin-left duration-200`}>Rincian Belanja</span>
                </li>
              </Link>
              <Link href="/manajemenresiko">
                <li className={`flex items-center gap-x-2 cursor-pointer p-2 rounded-xl ${PerencanaanManajemenResiko ? "bg-white text-gray-800" : "hover:bg-gray-700"}`}>
                  <TbRefreshAlert className="text-xl" />
                  <span className={`${!isOpen && 'hidden'} origin-left duration-200`}>Manajemen Resiko</span>
                </li>
              </Link>
            </div>
          }
          <li 
            onClick={() => setLaporan(Laporan ? false : true)}
            className="flex font-medium items-center gap-x-2 cursor-pointer p-2 hover:bg-gray-700 rounded-xl"
          >
            <TbBook className="text-xl" />
            <span className={`${!isOpen && 'hidden'} origin-left duration-200`}>Laporan</span>
          </li>
          {Laporan && 
            <div className="flex flex-col border-l-2 border-white rounded-b-xl px-3 py-2 ml-2 duration-200">
              <li 
                className="flex items-center gap-x-2 cursor-pointer p-2 hover:bg-gray-700 rounded-xl"
                onClick={() => setUsulan(Usulan ? false : true)}
              >
                <TbApps className="text-xl" />
                <span className={`${!isOpen && 'hidden'} origin-left duration-200`}>Usulan</span>
              </li>
                {/* subs menu */}
                {Usulan && 
                <div className="flex flex-col border-l-2 border-white rounded-b-xl px-3 py-2 ml-2 duration-200">
                  <Link href="/musrenbang">
                    <li className={`flex items-center gap-x-2 cursor-pointer p-2 rounded-xl ${Musrenbang ? "bg-white text-gray-800" : "hover:bg-gray-700"}`}>
                      <TbBook2 className="text-xl" />
                      <span className={`${!isOpen && 'hidden'} origin-left duration-200`}>Musrenbang</span>
                    </li>
                  </Link>
                  <Link href="/pokokpikiran">
                    <li className={`flex items-center gap-x-2 cursor-pointer p-2 rounded-xl ${PokokPikiran ? "bg-white text-gray-800" : "hover:bg-gray-700"}`}>
                      <TbBulb className="text-xl" />
                      <span className={`${!isOpen && 'hidden'} origin-left duration-200`}>Pokok Pikiran</span>
                    </li>
                  </Link>
                  <Link href="/mandatori">
                    <li className={`flex items-center gap-x-2 cursor-pointer p-2 rounded-xl ${Mandatori ? "bg-white text-gray-800" : "hover:bg-gray-700"}`}>
                      <TbFileAlert className="text-xl" />
                      <span className={`${!isOpen && 'hidden'} origin-left duration-200`}>Mandatori</span>
                    </li>
                  </Link>
                  <li className="flex items-center gap-x-2 cursor-pointer p-2 hover:bg-gray-700 rounded-xl">
                    <TbTooltip className="text-xl" />
                    <span className={`${!isOpen && 'hidden'} origin-left duration-200`}>Inisiatif Bupati</span>
                  </li>
                </div>
                }
              <Link href="/rencanakinerja">
                <li className={`flex items-center gap-x-2 cursor-pointer p-2 rounded-xl ${RencanaKinerjaKAK ? "bg-white text-gray-800" : "hover:bg-gray-700"}`}>
                  <TbChecklist className="text-xl" />
                  <span className={`${!isOpen && 'hidden'} origin-left duration-200`}>Rencana Kinerja KAK</span>
                </li>
              </Link>
              <Link href="/rincianbelanja">
                <li className={`flex items-center gap-x-2 cursor-pointer p-2 rounded-xl ${RincianBelanja ? "bg-white text-gray-800" : "hover:bg-gray-700"}`}>
                  <TbShoppingCartDollar className="text-xl" />
                  <span className={`${!isOpen && 'hidden'} origin-left duration-200`}>Rincian Belanja</span>
                </li>
              </Link>
              <Link href="/manajemenresiko">
                <li className={`flex items-center gap-x-2 cursor-pointer p-2 rounded-xl ${ManajemenResiko ? "bg-white text-gray-800" : "hover:bg-gray-700"}`}>
                  <TbRefreshAlert className="text-xl" />
                  <span className={`${!isOpen && 'hidden'} origin-left duration-200`}>Manajemen Resiko</span>
                </li>
              </Link>
              <Link href="#">
                <li className={`flex items-center gap-x-2 cursor-pointer p-2 rounded-xl ${Inovasi ? "bg-white text-gray-800" : "hover:bg-gray-700"}`}>
                  <TbRefreshAlert className="text-xl" />
                  <span className={`${!isOpen && 'hidden'} origin-left duration-200`}>Inovasi</span>
                </li>
              </Link>
            </div>
          }
          <li className="flex font-medium items-center gap-x-2 cursor-pointer p-2 hover:bg-gray-700 rounded-xl" onClick={() => logout()}>
            <TbLogout className="text-xl text-red-500" />
            <span className={`${!isOpen && 'hidden'} origin-left duration-200`}>Logout</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

