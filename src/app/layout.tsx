import type { Metadata } from "next";
import { Providers } from "@/components/shared/Providers";
import { Navbar } from "@/components/shared/Navbar";
import { AutoConnect } from "thirdweb/react";
import { client } from "@/consts/client";
import "./globals.css";

export const metadata: Metadata = {
	title: "Marketplace",
	description: "A modern NFT marketplace",
	themeColor: "#121212"
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className="dark-mode">
				<Providers>
					<AutoConnect client={client} />
					<Navbar />
					<main
						style={{
							maxWidth: "1400px",
							margin: "0 auto",
							padding: "0 20px",
							paddingBottom: "100px",
							minHeight: "calc(100vh - 100px)",
						}}
					>
						{children}
					</main>
				</Providers>
			</body>
		</html>
	);
}
