import Image from "next/image";
import React from "react";
import { useRouter } from "next/navigation";

export default function StreamerContainer(props) {
  const router = useRouter();
  const logoSize = 40;
  return (
    <div
      className="streamer-container"
      onClick={() => router.push("/streamer/" + props.username)}
    >
      <Image
        src={props.logo}
        alt="Streamer Logo"
        width={logoSize}
        height={logoSize}
        priority
        style={{
          borderRadius: "50%",
          border: `4px solid ${props.online ? "red" : ""}`,
          marginRight: "10px",
        }}
      />
      <div className="streamer-format">
        <div style={{ fontSize: "1.2rem", fontWeight: "bold" }}>
          {props.name}
        </div>
        <div style={{ color: "#BBB" }}>{props.charity}</div>
      </div>
    </div>
  );
}
