import React from "react";
import { useSearchParams } from "react-router-dom";
import Navbar from "../components/Navbar";

const Info = () => {
  const [searchParams] = useSearchParams();
  const malId = searchParams.get("id");

  return (
    <div>
      <Navbar />
      <h1 className="text-center text-2xl mt-5">Anime Info (ID: {malId})</h1>
    </div>
  );
};

export default Info;
