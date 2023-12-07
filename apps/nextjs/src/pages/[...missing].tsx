import Head from "next/head"

export default function Missing() {
    return (
        <>
            <Head>
                <title>Soma</title>
                <meta name="description" content="Soma - Conectando mentes. Servicio de mensajeria instantánea enfocada a profesores y alumnos" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className="flex gap-4 justify-center items-center min-h-screen bg-blue-700 text-white text-xl">
                <p>404</p>
                <div className="w-1 h-14 bg-white border-0 rounded" />
                <div>
                    <p>
                        No se encontró la página
                    </p>
                    <a href="/" className="text-yellow-300 hover:text-yellow-500 ">&larr; Regresar a la principal</a>
                </div>
            </main>
        </>
    )
}
