'use client'

import { useForm, SubmitHandler } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { TbEye, TbEyeClosed } from "react-icons/tb";
import { ButtonBlack, ButtonSky } from "@/components/global/Button";
import { LoadingButtonClip } from "@/components/global/Loading";
import { login } from "@/components/lib/Cookie";

interface FormValues {
  username: string;
  password: string;
}

const LoginPage = () => {

  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [Proses, setProses] = useState<boolean>(false);
  const router = useRouter();

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    //   console.log(data.username, data.password);
    setProses(true);
    try {
      const isLoggedIn = await login(data.username, data.password);

      if (isLoggedIn) {
        router.push('/'); // Redirect ke halaman dashboard jika login berhasil
      } else {
        console.log('Login gagal');
      }
    } catch (error) {
      console.error(error)
    } finally {
      setProses(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* NIP */}
        <div className="mb-4">
          <label htmlFor="username" className="block text-sm font-medium text-white mb-1">
            USERNAME
          </label>
          <input
            type="text"
            id="username"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-800 focus:border-yellow-800 sm:text-sm"
            {...register('username', { required: 'nip harus terisi' })}
          />
          {errors.username && <span className="text-red-500 text-sm">{errors.username.message}</span>}
        </div>
        {/* PW */}
        <div className="mb-6">
          <label htmlFor="password" className="block text-sm font-medium text-white mb-1">
            PASSWORD
          </label>
          <div className="flex items-center justify-end">
            <input
              type={!showPassword ? 'password' : 'text'}
              id="password"
              className="mt-1 block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-800 focus:border-yellow-800 sm:text-sm"
              {...register('password', { required: 'password harus terisi' })}
            />
            <button
              type="button"
              className="absolute mt-1 mr-3 text-sm"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <TbEye /> : <TbEyeClosed />}
            </button>
          </div>
          {errors.password && <span className="text-red-500 text-sm">{errors.password.message}</span>}
        </div>
        <ButtonBlack
          type="submit"
          className="w-full"
          disabled={Proses}
        >
          {Proses ?
            <span className="flex">
              <LoadingButtonClip />
              Login...
            </span>
            :
            "Login"
          }
        </ButtonBlack>
      </form>
    </>
  )
}

export default LoginPage;
