import Head from 'next/head'
import React, { useState } from 'react'
import { useRouter } from 'next/router';
import { signin, SigninStatus } from '@/lib/apis/payments';
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import { DangerAlert } from '@/components/Alerts';

const Signin = () => {

  const [error, setError] = useState<string | undefined>()
  const [username, setUsername] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const { redirectTo = "/admin" } = router.query

    const response = await signin(username, password)
    if (response.status == SigninStatus.Ok) {
      router.push(redirectTo as string)
    }
    else {
      setError(response.errorMessage as string)
    }

  }

  const renderError = () => {
    if (!error) return null
    return (
      <DangerAlert title="Error d'accés" text={`Usuari o contrasenya incorrectes`} />
    )
  }


  return (
    <>
      <Head>
        <title>Iniciar sessió - IES MOSSÈN ALCOVER</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>

        <div className="max-w-lg m-auto">
          <div className="mt-12">
            {renderError()}
          </div>
          <div className="mt-12">
            <p className="text-lg font-medium text-gray-900">Accés Administratiu</p>
          </div>
          <div className="mb-6">
            <hr />
          </div>

          <div className="mb-6">
            <GoogleLogin
              onSuccess={credentialResponse => {
                console.log(credentialResponse);
              }}
              onError={() => {
                setError("Login Failed")
              }}
            />
          </div>

          <div
            className="my-4 flex items-center before:mt-0.5 before:flex-1 before:border-t before:border-neutral-300 after:mt-0.5 after:flex-1 after:border-t after:border-neutral-300">
            <p
              className="mx-4 mb-0 text-center font-semibold dark:text-white">
              O bé
            </p>
          </div>

          <form action="/api/signin" method="post" onSubmit={handleSubmit}>
            <div className="mb-6">
              <label htmlFor="username" className="block mb-2 text-sm font-medium text-gray-900">Usuari</label>
              <input
                type="text"
                name="username" value={username} onChange={e => setUsername(e.target.value)}
                id="username"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" required />
            </div>
            <div className="mb-6">
              <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900">Contrasenya</label>
              <input
                type="password"
                id="password"
                value={password} onChange={e => setPassword(e.target.value)}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" required />
            </div>

            <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium text-sm w-full sm:w-auto px-5 py-2.5 text-center">Submit</button>
          </form>
        </div>
      </main>
    </>
  )
}


const SingInPage = () => {
  console.log(process.env.CLIENT_ID_GOOGLE as string);
  return <GoogleOAuthProvider clientId={process.env.CLIENT_ID_GOOGLE as string}><Signin /></GoogleOAuthProvider>;
}

export default SingInPage