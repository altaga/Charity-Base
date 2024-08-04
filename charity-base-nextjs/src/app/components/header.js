'use client'; 
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Header() {
  const router = useRouter();
  const size = 0.14;
  return (
    <div className="header-absolute">
      <Image
        src="/logoW.png"
        alt="Next.js Logo"
        width={1022 * size}
        height={443 * size}
        style={{
          cursor: "pointer",
        }}
        priority
        onClick={() => router.push("/")}
      />
      <w3m-button />
    </div>
  );
}
