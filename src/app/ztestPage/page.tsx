'use client';

import { useState } from 'react';
import { Controller, useFieldArray, useForm } from 'react-hook-form';

interface FormValues {
  siswa: {
    nama: string;
    mata_kuliah: {
      mata_kuliah: string;
      nilai: string;
    }[];
  }[];
}

const FormSiswa = () => {
  const { control, handleSubmit } = useForm<FormValues>({
    defaultValues: {
      siswa: [
        {
          nama: '',
          mata_kuliah: [
            { mata_kuliah: '', nilai: '' },
          ],
        },
      ],
    },
  });

  const { fields: siswaFields, append: appendSiswa } = useFieldArray({
    control,
    name: 'siswa',
  });

  const onSubmit = (data: FormValues) => {
    console.log('Submitted Data:', data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {siswaFields.map((siswa, siswaIndex) => (
        <div key={siswa.id} className="border p-4 rounded space-y-4">
          <div className="flex flex-col py-3">
            <label
              className="uppercase text-xs font-bold text-gray-700 my-2"
              htmlFor={`siswa-${siswaIndex}-nama`}
            >
              Nama Siswa:
            </label>
            <Controller
              name={`siswa.${siswaIndex}.nama`}
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  className="border px-4 py-2 rounded-lg"
                  id={`siswa-${siswaIndex}-nama`}
                  placeholder="Masukkan nama siswa"
                />
              )}
            />
          </div>
          <MataKuliahFields control={control} siswaIndex={siswaIndex} />
        </div>
      ))}
      <button
        type="button"
        onClick={() =>
          appendSiswa({
            nama: '',
            mata_kuliah: [{ mata_kuliah: '', nilai: '' }],
          })
        }
        className="bg-green-500 text-white px-4 py-2 rounded"
      >
        Tambah Siswa
      </button>
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Submit
      </button>
    </form>
  );
};

const MataKuliahFields = ({
  control,
  siswaIndex,
}: {
  control: any;
  siswaIndex: number;
}) => {
  const { fields: mataKuliahFields, append: appendMataKuliah } = useFieldArray({
    control,
    name: `siswa.${siswaIndex}.mata_kuliah`,
  });

  return (
    <div>
      <label className="block uppercase text-xs font-bold text-gray-700 my-2">
        Mata Kuliah:
      </label>
      {mataKuliahFields.map((mataKuliah, mkIndex) => (
        <div key={mataKuliah.id} className="space-y-4">
          <div className="flex flex-col py-3">
            <label
              className="uppercase text-xs font-bold text-gray-700 my-2"
              htmlFor={`siswa-${siswaIndex}-mata_kuliah-${mkIndex}`}
            >
              Mata Kuliah:
            </label>
            <Controller
              name={`siswa.${siswaIndex}.mata_kuliah.${mkIndex}.mata_kuliah`}
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  className="border px-4 py-2 rounded-lg"
                  id={`siswa-${siswaIndex}-mata_kuliah-${mkIndex}`}
                  placeholder="Masukkan mata kuliah"
                />
              )}
            />
          </div>
          <div className="flex flex-col py-3">
            <label
              className="uppercase text-xs font-bold text-gray-700 my-2"
              htmlFor={`siswa-${siswaIndex}-nilai-${mkIndex}`}
            >
              Nilai:
            </label>
            <Controller
              name={`siswa.${siswaIndex}.mata_kuliah.${mkIndex}.nilai`}
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  className="border px-4 py-2 rounded-lg"
                  id={`siswa-${siswaIndex}-nilai-${mkIndex}`}
                  placeholder="Masukkan nilai"
                />
              )}
            />
          </div>
          <button
            type="button"
            onClick={() =>
              appendMataKuliah({ mata_kuliah: '', nilai: '' })
            }
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Tambah Mata Kuliah
          </button>
        </div>
      ))}
    </div>
  );
};

export default FormSiswa;
