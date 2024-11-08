'use client'

import Link from "next/link";
import Image from "next/image";
import { setCookie } from "@/components/lib/Cookie";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AlertNotification } from "@/components/global/Alert";

const Login = () => {

    const [SelectedUser, setSelectedUser] = useState<any>("");
    const router = useRouter();

    const setLogin = () => {
        setCookie('user', JSON.stringify(SelectedUser));
        AlertNotification("Berhasil Login", "", "success", 1000);
        router.push("/");
        // setTimeout(() => {
        //   window.location.reload();
        // }, 1000);
    }

    return(
        <>
        <div className="flex items-center justify-center w-full h-screen bg-gray-100">
            <form className="bg-white p-8 rounded-lg shadow-md w-96">
                <div className="flex flex-col items-center">
                    <Image src="/logo.png" alt="image" width={90} height={90} />
                    <h1 className="text-2xl font-bold mt-3 mb-6 text-center">Kertas Kerja Kab. Madiun</h1>
                </div>
                {/* <div className="mb-4">
                    <label htmlFor="nip" className="block text-sm font-medium text-gray-700 mb-1">
                    NIP
                    </label>
                    <input
                        type="nip"
                        id="nip"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                </div>
                <div className="mb-6">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                    </label>
                    <div className="flex items-center justify-end">
                    <input
                        type="password"
                        id="password"
                        className="mt-1 block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                    </div>
                </div> */}
                <select
                    className="w-full"
                    value={SelectedUser}
                    onChange={(e) => setSelectedUser(e.target.value)}
                >
                    <option value="">pilih role</option>
                    <option value="super_admin">super admin</option>
                    <option value="admin_opd">admin opd</option>
                    <option value="asn">asn</option>
                </select>
                <button
                    onClick={setLogin}
                    type="button"
                    className="w-full py-1 mt-2 px-4 border-2 rounded-lg hover:bg-gray-500 hover:text-white"
                >
                    Login
                </button>
            </form>
        </div>
        </>
    )
}

export default Login;