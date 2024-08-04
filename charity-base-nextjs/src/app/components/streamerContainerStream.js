import Image from "next/image";
import React from "react";

export default function StreamerContainerStream(props) {
  const logoSize = 60;
  return (
    <div className="streamer-container3">
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
          marginTop: "5px",
        }}
      />
      <div className="streamer-format">
        <div
          style={{ fontSize: "1.2rem", fontWeight: "bold", marginTop: "5px" }}
        >
          {props.title.length > 20
            ? props.title.substring(0, 20) + "..."
            : props.title}
        </div>
        <div style={{ color: "#BBB" }}>{props.name}</div>
        <div style={{ color: "#BBB" }}>{props.charity}</div>
      </div>
    </div>
  );
}
