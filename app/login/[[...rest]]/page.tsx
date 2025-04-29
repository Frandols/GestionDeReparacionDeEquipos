"use client"

import { SignIn } from '@clerk/nextjs'
import themes from '@clerk/themes'
import { useTheme } from 'next-themes'

export default function LoginPage() {
	const { theme, resolvedTheme } = useTheme()

	return (
		<section className='flex min-h-svh w-full items-center justify-center p-6 md:p-10'>
            <SignIn 
				appearance={theme === 'dark' || (theme === 'system' && resolvedTheme === 'dark') ? { baseTheme: themes.dark } : {}}
			/>
		</section>
	)
}
