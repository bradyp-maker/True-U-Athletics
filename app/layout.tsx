import type { Metadata } from "next";
import { Inter, Sora } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import SiteHeader from "@/components/SiteHeader";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "True U Athletics",
  description: "Personalized supplement recommendations for athletes.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${sora.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-background text-foreground">
        <ClerkProvider
          appearance={{
            variables: {
              colorPrimary: "#c6ff3f",
              colorPrimaryForeground: "#0a0a0b",
              colorBackground: "#131316",
              colorForeground: "#f5f5f7",
              colorInput: "#1c1c21",
              colorInputForeground: "#f5f5f7",
            },
          }}
        >
          <SiteHeader />
          {children}
        </ClerkProvider>
      </body>
    </html>
  );
}
