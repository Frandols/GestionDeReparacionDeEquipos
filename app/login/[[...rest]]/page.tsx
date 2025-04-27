"use client"

import { SignIn } from '@clerk/nextjs'
import { dark } from '@clerk/themes'


export default function LoginPage() {
	return (
		<section className='flex min-h-svh w-full items-center justify-center p-6 md:p-10'>
            <SignIn appearance={{
				baseTheme: dark
			}}/>
		</section>
	)
}
