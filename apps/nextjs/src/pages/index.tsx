import Head from 'next/head'
import Image from 'next/image'

export default function Home() {

  return (
    <>
      <Head>
        <title>Soma</title>
        <meta name="description" content="Soma - Conectando mentes. Servicio de mensajeria instantánea enfocada a profesores y alumnos" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex flex-col justify-between items-center min-h-screen bg-blue-700">
        <div className='flex flex-col w-72 items-center justify-start'>
          <Image src="/soma-logo-white.png" alt='Soma' height={150} width={300} />
          <p className='text-5xl text-white text-center flex-wrap font-sans font-semibold'>Conectando mentes</p>
        </div>
        <hr className='h-1 w-80 bg-white border-0 rounded my-8' />
        <div className='flex-1'>
          <p className='text-white font-sans text-2xl'>
            Página en progreso, gracias por visitar!
          </p>
        </div>
      </main>
    </>
  )
}
