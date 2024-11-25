import { NextRequest, NextResponse } from "next/server";
import * as jwtDecoded from "jwt-decode";

export function middleware(req: NextRequest) {

    const tokenCookie = req.cookies.get('token');
    
    if (tokenCookie) {
        const token = tokenCookie.value;
        try {
            const decodedToken: any = jwtDecoded.jwtDecode(token);
            const currentTime = Math.floor(Date.now() / 1000);

            // Periksa apakah token telah kedaluwarsa
            if (decodedToken.exp < currentTime) {
                return NextResponse.redirect(new URL('/login', req.url));
            }

            return NextResponse.next();
        } catch (error) {
            console.error('Token decoding failed:', error);
        }
    }

    return NextResponse.redirect(new URL('/login', req.url));
};

export const config = {
    matcher: [
        "/", 
        "/User",
        "/PohonKinerja",
        "/ReferensiArsitektur",
        "/SasaranKota",
        "/BidangUrusan",

        "/ProsesBisnis",
        "/ProsesBisnis/TambahData",
        "/ProsesBisnis/EditData/:path*",
        
        "/Layanan/LayananSPBE",
        "/Layanan/LayananSPBE/TambahData",
        "/Layanan/LayananSPBE/EditData/:path*",

        "/DataInformasi",
        "/DataInformasi/TambahData",
        "/DataInformasi/EditData/:path*",

        "/Aplikasi",
        "/Aplikasi/TambahData",
        "/Aplikasi/EditData/:path*",
        
        "/KebutuhanSPBE",
        "/KebutuhanSPBE/TambahKebutuhan",
        "/KebutuhanSPBE/EditKebutuhan/:path*",
        
        "/GapArsitektur",
        "/GapArsitektur/TambahKeterangan/:path",
        "/GapArsitektur/EditKeterangan/:path",

        "/PemenuhanKebutuhan",
        "/PemenuhanKebutuhan/EditPemenuhan/:path",
        
        "/Arsitektur",
        "/SdmInfrastruktur",
        "/PetaRencana",
    ]
}