import { Inter } from "next/font/google";
import "./globals.css";
import Header from "./components/header";
import { Web3Modal } from "./components/web3modal";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Charity Base",
  description: "Created by Altaga",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Web3Modal>
          <Header />
          <div className="main-absolute">{children}</div>
        </Web3Modal>
      </body>
    </html>
  );
}
