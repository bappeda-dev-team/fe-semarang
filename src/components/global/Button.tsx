'use client'

import { useRouter } from "next/navigation";

interface button {
    onClick? : () => void;
    children: React.ReactNode;
    type? : 'reset' | 'submit' | 'button';
    className? : string;
    halaman_url? : string;
    disabled? : boolean;
}

export const ButtonSky: React.FC<button> = ({children, type, className, halaman_url, onClick, disabled}) => {

    const router = useRouter()
    const pindahHalaman = () => {
        if(halaman_url){
            router.push(halaman_url);
        }
    }

    return(
        <button
            className={`px-3 flex justify-center items-center py-1 bg-gradient-to-r from-[#98B9EC] to-[#3072D6] hover:from-[#071952] hover:to-[#003edab4] text-white rounded-lg ${className}`}
            disabled={disabled}
            type={type}
            onClick={onClick || pindahHalaman}
        >
            {children}
        </button>
    )
}
export const ButtonSkyBorder: React.FC<button> = ({children, type, className, halaman_url, onClick, disabled}) => {

    const router = useRouter()
    const pindahHalaman = () => {
        if(halaman_url){
            router.push(halaman_url);
        }
    }

    return(
        <button
            className={`px-3 flex justify-center items-center py-1 bg-gradient-to-r border-2 border-[#3072D6] hover:bg-[#3072D6] text-[#3072D6] hover:text-white rounded-lg ${className}`}
            disabled={disabled}
            type={type}
            onClick={onClick || pindahHalaman}
        >
            {children}
        </button>
    )
}
export const ButtonGreen: React.FC<button> = ({children, type, className, halaman_url, onClick, disabled}) => {

    const router = useRouter()
    const pindahHalaman = () => {
        if(halaman_url){
            router.push(halaman_url);
        }
    }

    return(
        <button
        disabled={disabled}
        type={type}
        onClick={onClick || pindahHalaman}
            className={`px-3 flex justify-center items-center py-1 bg-gradient-to-r from-[#00A607] to-[#AFD88F] hover:from-[#AFD88F] hover:to-[#00A607] text-white rounded-lg ${className}`}
        >
            {children}
        </button>
    )
}
export const ButtonBlack: React.FC<button> = ({children, type, className, halaman_url, onClick, disabled}) => {

    const router = useRouter()
    const pindahHalaman = () => {
        if(halaman_url){
            router.push(halaman_url);
        }
    }

    return(
        <button
            className={`px-3 flex justify-center items-center py-1 bg-gradient-to-r from-[#1C201A] to-[#434848] hover:from-[#3A4238] hover:to-[#676C6F] text-white rounded-lg ${className}`}
            disabled={disabled}
            type={type}
            onClick={onClick || pindahHalaman}
        >
            {children}
        </button>
    )
}
export const ButtonGreenBorder: React.FC<button> = ({children, type, className, halaman_url, onClick, disabled}) => {

    const router = useRouter()
    const pindahHalaman = () => {
        if(halaman_url){
            router.push(halaman_url);
        }
    }

    return(
        <button
            className={`px-3 flex justify-center items-center py-1 bg-gradient-to-r border-2 border-[#00A607] hover:bg-[#00A607] text-[#00A607] hover:text-white rounded-lg ${className}`}
            disabled={disabled}
            type={type}
            onClick={onClick || pindahHalaman}
        >
            {children}
        </button>
    )
}
export const ButtonBlackBorder: React.FC<button> = ({children, type, className, halaman_url, onClick, disabled}) => {

    const router = useRouter()
    const pindahHalaman = () => {
        if(halaman_url){
            router.push(halaman_url);
        }
    }

    return(
        <button
            className={`px-3 flex justify-center items-center py-1 bg-gradient-to-r border-2 border-[#1C201A] hover:bg-[#1C201A] text-[#1C201A] hover:text-white rounded-lg ${className}`}
            disabled={disabled}
            type={type}
            onClick={onClick || pindahHalaman}
        >
            {children}
        </button>
    )
}
export const ButtonRed: React.FC<button> = ({children, type, className, halaman_url, onClick, disabled}) => {

    const router = useRouter()
    const pindahHalaman = () => {
        if(halaman_url){
            router.push(halaman_url);
        }
    }

    return(
        <button
            className={`px-3 flex justify-center items-center py-1 bg-gradient-to-r from-[#D20606] to-[#D96B6B] hover:from-[#D96B6B] hover:to-[#D20606] text-white rounded-lg ${className}`}
            disabled={disabled}
            type={type}
            onClick={onClick || pindahHalaman}
        >
            {children}
        </button>
    )
}
export const ButtonRedBorder: React.FC<button> = ({children, type, className, halaman_url, onClick, disabled}) => {

    const router = useRouter()
    const pindahHalaman = () => {
        if(halaman_url){
            router.push(halaman_url);
        }
    }

    return(
        <button
            className={`px-3 flex justify-center items-center py-1 bg-gradient-to-r border-2 border-[#D20606] text-[#D20606] hover:bg-[#D20606] hover:text-white rounded-lg ${className}`}
            disabled={disabled}
            type={type}
            onClick={onClick || pindahHalaman}
        >
            {children}
        </button>
    )
}