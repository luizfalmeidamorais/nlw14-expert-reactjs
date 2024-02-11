import type { Metadata } from "next";
import { Lexend } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const lexend = Lexend({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "NLW 14 - Expert ReactJS | Rocketseat",
	description: "Uma aplicação de notas com Next.js e Framer Motion",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="pt-BR" suppressHydrationWarning>
			<link rel="icon" href="/favicon.png" />
			<body className={lexend.className} suppressHydrationWarning>
				<Providers>
					<div className="min-h-screen">{children}</div>
				</Providers>
			</body>
		</html>
	);
}
